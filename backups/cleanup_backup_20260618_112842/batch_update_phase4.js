const fs = require('fs');
const path = require('path');

// Files that need updating
const FILES = [
  'client/src/FrontEnd/pages/purchasing/ApprovalDetailSubmodule.tsx',
  'client/src/FrontEnd/pages/purchasing/ApprovalSubmodule.tsx',
  'client/src/FrontEnd/pages/purchasing/GoodsReceivedNoteDetailSubmodule.tsx',
  'client/src/FrontEnd/pages/purchasing/PurchaseOrderApproval.tsx',
  'client/src/FrontEnd/pages/purchasing/PurchaseOrderApprovalDetail.tsx',
  'client/src/FrontEnd/pages/purchasing/PurchaseOrderCreation.tsx',
  'client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx',
  'client/src/FrontEnd/pages/purchasing/PurchaseOrderReviewDetail.tsx',
  'client/src/FrontEnd/pages/purchasing/ReviewDetailSubmodule.tsx',
  'client/src/FrontEnd/pages/purchasing/ReviewSubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/CreateDeliveryFromGrnSubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/DeliveryDetailSubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/DeliverySubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/OrderAcknowledgementDetailSubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/OrderAcknowledgementSubmodule.tsx',
  'client/src/FrontEnd/pages/supplierFulfillment/SupplierFulfillmentHome.tsx',
  'client/src/FrontEnd/pages/userAccess/rbac/Roles.tsx',
  'client/src/FrontEnd/pages/userAccess/users/UserList.tsx',
  'client/src/FrontEnd/pages/userAccess/users/SupplierTypeSubmodule.tsx',
  'client/src/FrontEnd/pages/settings/FeedbackSubmodule.tsx',
  'client/src/FrontEnd/pages/settings/CompanyAddressSubmodule.tsx',
  'client/src/FrontEnd/pages/categorySelection/LookupKindTable.tsx',
  'client/src/FrontEnd/pages/ForgetPassword.tsx',
  'client/src/FrontEnd/components/purchasing/CreatableLookupSelect.tsx',
  'client/src/FrontEnd/components/ChatBot/ChatWindow.tsx',
  'client/src/FrontEnd/components/ChatBot/MultiAgentChatWindowEnhanced.tsx',
  'client/src/FrontEnd/components/ChatBot/AgentCollaboration.tsx',
  'client/src/FrontEnd/components/ChatBot/VoiceInput.tsx',
  'client/src/FrontEnd/components/ChatBot/ExportChat.tsx',
  'client/src/FrontEnd/components/ChatBot/SessionHistory.tsx',
  'client/src/FrontEnd/components/ChatBot/MultiAgentChatWindow.tsx',
  'client/src/FrontEnd/components/ChatBot/AgentSelector.tsx',
];

function addImportIfNeeded(content) {
  if (content.includes('useTranslation')) {
    return { content, added: false };
  }

  // Find last import line
  const importRegex = /import\s+.+\s+from\s+['"].+['"];?\n/g;
  const imports = [...content.matchAll(importRegex)];

  if (imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const insertPos = lastImport.index + lastImport[0].length;
    const newImport = 'import { useTranslation } from "react-i18next";\n';
    content = content.slice(0, insertPos) + newImport + content.slice(insertPos);
    return { content, added: true };
  }

  return { content, added: false };
}

function addTranslationHook(content) {
  if (content.includes('t: tMsg') || content.includes('t:tMsg')) {
    return { content, added: false };
  }

  // Find component function
  const patterns = [
    /export default function \w+\([^)]*\):\s*React\.ReactElement\s*\{/,
    /export default function \w+\([^)]*\)\s*\{/,
    /const \w+:\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*\{/,
    /function \w+\([^)]*\)\s*\{/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const insertPos = match.index + match[0].length;
      const hook = "\n  const { t: tMsg } = useTranslation('messages');\n";
      content = content.slice(0, insertPos) + hook + content.slice(insertPos);
      return { content, added: true };
    }
  }

  return { content, added: false };
}

function replaceMessageCalls(content) {
  let changed = false;

  // Replace simple string messages
  const replacements = [
    // Success messages
    { from: /message\.success\(['"]([^'"]+)['"]\)/g, to: "message.success(tMsg('success.save'))", key: 'success' },

    // Error with fallback: err?.message ?? "text"
    { from: /message\.error\(err\?\.message\s*\?\?\s*['"]([^'"]+)['"]\)/g, to: "message.error(err?.message ?? tMsg('error.operationFailed'))", key: 'error-fallback' },

    // Simple error messages
    { from: /message\.error\(['"]([^'"]+)['"]\)/g, to: "message.error(tMsg('error.operationFailed'))", key: 'error' },

    // Warning messages
    { from: /message\.warning\(['"]([^'"]+)['"]\)/g, to: "message.warning(tMsg('warning.general'))", key: 'warning' },

    // Info messages
    { from: /message\.info\(['"]([^'"]+)['"]\)/g, to: "message.info(tMsg('info.general'))", key: 'info' },
  ];

  for (const { from, to } of replacements) {
    const before = content;
    content = content.replace(from, to);
    if (content !== before) {
      changed = true;
    }
  }

  return { content, changed };
}

function processFile(filePath) {
  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;
    const changes = [];

    // Step 1: Add import
    const importResult = addImportIfNeeded(content);
    content = importResult.content;
    if (importResult.added) changes.push('import');

    // Step 2: Add hook
    const hookResult = addTranslationHook(content);
    content = hookResult.content;
    if (hookResult.added) changes.push('hook');

    // Step 3: Replace messages
    const msgResult = replaceMessageCalls(content);
    content = msgResult.content;
    if (msgResult.changed) changes.push('messages');

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`✅ ${filePath} (${changes.join(', ')})`);
      return true;
    } else {
      console.log(`⏭️  ${filePath} (already updated)`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
    return false;
  }
}

function main() {
  console.log('=' . repeat(60));
  console.log('Phase 4 Translation Batch Update');
  console.log('=' . repeat(60));
  console.log();

  let updated = 0;
  let skipped = 0;

  for (const file of FILES) {
    const result = processFile(file);
    if (result) {
      updated++;
    } else {
      skipped++;
    }
  }

  console.log();
  console.log('=' . repeat(60));
  console.log(`Summary: ${updated} updated, ${skipped} skipped, ${FILES.length} total`);
  console.log('=' . repeat(60));
  console.log();
  console.log('Next steps:');
  console.log('1. Review changes: git diff');
  console.log('2. Build: cd client && npm run build');
  console.log('3. Test with language switching');
}

main();
