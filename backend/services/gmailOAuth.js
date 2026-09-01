import fs from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";

const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const defaultSecretsDir = path.join(process.cwd(), "secrets");
const configuredClientConfigPath = process.env.GOOGLE_OAUTH_CLIENT_FILE
  ? path.resolve(process.env.GOOGLE_OAUTH_CLIENT_FILE)
  : path.join(defaultSecretsDir, "google-oauth-client.json");
const tokenPath = process.env.GMAIL_OAUTH_TOKEN_FILE
  ? path.resolve(process.env.GMAIL_OAUTH_TOKEN_FILE)
  : path.join(defaultSecretsDir, "gmail-token.json");
const tokenStorePath = process.env.GMAIL_OAUTH_TOKEN_STORE_FILE
  ? path.resolve(process.env.GMAIL_OAUTH_TOKEN_STORE_FILE)
  : path.join(defaultSecretsDir, "gmail-tokens.json");
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
  || "http://localhost:4000/api/gmail/oauth/callback";

async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

// Google reports expired/revoked refresh tokens as an `invalid_grant` error.
// Keep this check in one place so API status and notification results expose
// an actionable message instead of a low-level OAuth error.
export function isGmailAuthorizationError(error) {
  const oauthError = error?.response?.data?.error;
  return oauthError === "invalid_grant"
    || error?.code === "invalid_grant"
    || String(error?.message || "").toLowerCase().includes("invalid_grant");
}

export function gmailAuthorizationErrorMessage(error) {
  if (isGmailAuthorizationError(error)) {
    return "Gmail authorization expired or was revoked. Please reconnect Gmail in Settings.";
  }
  return error?.message || "Gmail authorization is required for this account";
}

async function readTokenStore() {
  try {
    const value = await readJson(tokenStorePath);
    return value && typeof value === "object" ? value : {};
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    return {};
  }
}

async function writeTokenStore(store) {
  await fs.mkdir(path.dirname(tokenStorePath), { recursive: true });
  await fs.writeFile(tokenStorePath, JSON.stringify(store, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
}

async function resolveToken(email) {
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail) {
    const store = await readTokenStore();
    if (store[normalizedEmail]) return store[normalizedEmail];
    try {
      const legacyTokens = await readJson(tokenPath);
      const legacyClient = await createOAuthClient();
      legacyClient.setCredentials(legacyTokens);
      const legacyGmail = google.gmail({ version: "v1", auth: legacyClient });
      const profile = await legacyGmail.users.getProfile({ userId: "me" });
      if (normalizeEmail(profile.data.emailAddress) === normalizedEmail) {
        store[normalizedEmail] = legacyTokens;
        await writeTokenStore(store);
        return legacyTokens;
      }
    } catch {
      // The caller will receive a disconnected status when this account is not authorized.
    }
    throw Object.assign(new Error("Gmail authorization is required for this account"), { code: "ENOENT" });
  }
  return readJson(tokenPath);
}

async function createOAuthClient() {
  let configPath = configuredClientConfigPath;
  try {
    await fs.access(configPath);
  } catch (error) {
    if (error?.code !== "ENOENT" || process.env.GOOGLE_OAUTH_CLIENT_FILE) throw error;
    const candidates = (await fs.readdir(defaultSecretsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /^client_secret_.*\.json$/i.test(entry.name))
      .map((entry) => path.join(defaultSecretsDir, entry.name));
    if (candidates.length !== 1) {
      throw new Error("Google OAuth client JSON was not found in backend/secrets");
    }
    configPath = candidates[0];
  }
  const config = await readJson(configPath);
  const credentials = config.web || config.installed || config;
  if (!credentials.client_id || !credentials.client_secret) {
    throw new Error("Google OAuth client JSON is missing client_id or client_secret");
  }

  return new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    redirectUri,
  );
}

export async function getGmailAuthorizationUrl(state) {
  const client = await createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [GMAIL_SCOPE],
    state,
  });
}

export async function exchangeGmailAuthorizationCode(code, aliasEmail) {
  const client = await createOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: client });
  const profile = await gmail.users.getProfile({ userId: "me" });
  const accountEmail = normalizeEmail(profile.data.emailAddress);
  if (!accountEmail) throw new Error("Google did not return the authorized Gmail address");
  const store = await readTokenStore();
  store[accountEmail] = tokens;
  // Keep a mapping for the OptiMind login address when it differs from the
  // Google address used during OAuth (for example a university alias).
  const normalizedAlias = normalizeEmail(aliasEmail);
  if (normalizedAlias && normalizedAlias !== accountEmail) {
    store[normalizedAlias] = tokens;
  }
  await writeTokenStore(store);
  await fs.mkdir(path.dirname(tokenPath), { recursive: true });
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
  return { tokens, email: accountEmail };
}

export async function getAuthorizedGmailClient(email) {
  const tokens = await resolveToken(email);
  const client = await createOAuthClient();
  client.setCredentials(tokens);
  return google.gmail({ version: "v1", auth: client });
}

export async function ensureGmailLabel(labelName = "OptiMind", email) {
  const gmail = await getAuthorizedGmailClient(email);
  const response = await gmail.users.labels.list({ userId: "me" });
  const existing = (response.data.labels || []).find(
    (label) => label.name === labelName,
  );
  if (existing) return existing;

  const created = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      name: labelName,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    },
  });
  return created.data;
}

export async function applyGmailLabelToMessage({
  messageId,
  subject,
  labelName = "OptiMind",
  recipientEmail,
  toEmail,
}) {
  const gmail = await getAuthorizedGmailClient(recipientEmail);
  const label = await ensureGmailLabel(labelName, recipientEmail);
  const normalizedMessageId = String(messageId || "")
    .trim()
    .replace(/^<|>$/g, "");
  const normalizedSubject = String(subject || "").trim().replace(/[\\"]+/g, " ");
  const normalizedTo = normalizeEmail(toEmail);
  const sender = normalizeEmail(process.env.SMTP_USER);
  const queries = [];
  if (normalizedMessageId) queries.push(`rfc822msgid:${normalizedMessageId}`);
  if (normalizedSubject) {
    const parts = [sender ? `from:${sender}` : "from:me"];
    if (normalizedTo) parts.push(`to:${normalizedTo}`);
    parts.push(`subject:"${normalizedSubject}"`, "newer_than:2d");
    queries.push(parts.join(" "));
  }

  let messages = [];
  // Gmail may take a moment to index the sent/received copy. Received copies
  // can lag behind the SMTP response by tens of seconds, especially for an
  // alias or a different mailbox. Keep retrying with a bounded backoff so a
  // delayed index does not permanently lose the label.
  const labelRetryDelays = [500, 1000, 2000, 4000, 8000, 12000];
  for (let attempt = 0; attempt <= labelRetryDelays.length && !messages.length; attempt += 1) {
    for (const q of queries) {
      const response = await gmail.users.messages.list({
        userId: "me",
        q,
        maxResults: 10,
      });
      messages = response.data.messages || [];
      if (messages.length) break;
    }
    if (!messages.length && attempt < labelRetryDelays.length) {
      await new Promise((resolve) => setTimeout(resolve, labelRetryDelays[attempt]));
    }
  }
  if (!messages.length) {
    return { labeled: false, reason: "Sent message not visible in Gmail yet" };
  }

  await gmail.users.messages.modify({
    userId: "me",
    id: messages[0].id,
    requestBody: { addLabelIds: [label.id] },
  });
  return { labeled: true, messageId: messages[0].id, labelId: label.id };
}

export async function getGmailConnectionStatus() {
  return getGmailConnectionStatusForEmail();
}

export async function getGmailConnectionStatusForEmail(email) {
  const requestedEmail = normalizeEmail(email);
  try {
    const gmail = await getAuthorizedGmailClient(requestedEmail);
    const profile = await gmail.users.getProfile({ userId: "me" });
    return {
      connected: true,
      // `email` is the address the frontend uses to identify this connection.
      // `authorizedEmail` remains available for diagnostics.
      email: requestedEmail || profile.data.emailAddress || null,
      authorizedEmail: profile.data.emailAddress || null,
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        connected: false,
        reason: "Gmail authorization is required",
        code: "authorization_required",
        email: requestedEmail || null,
      };
    }
    if (isGmailAuthorizationError(error)) {
      return {
        connected: false,
        reason: gmailAuthorizationErrorMessage(error),
        code: "invalid_grant",
        email: requestedEmail || null,
      };
    }
    throw error;
  }
}
