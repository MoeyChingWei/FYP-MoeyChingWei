import auditService from "../services/audit.js";

/**
 * Extract user info from request
 */
function getUserInfo(req) {
  return {
    userId: req.user?.id || null,
    userEmail: req.user?.email || null,
    userName: req.user?.name || null,
    ipAddress: req.ip || req.connection.remoteAddress || null,
    userAgent: req.get("user-agent") || null,
  };
}

/**
 * Audit middleware - automatically logs important operations
 */
export function auditMiddleware(req, res, next) {
  const originalJson = res.json;
  const originalSend = res.send;

  // Store original body for comparison
  req.auditOriginalBody = req.body ? JSON.parse(JSON.stringify(req.body)) : null;

  // Override res.json to capture responses
  res.json = function (data) {
    captureAuditLog(req, res, data);
    return originalJson.call(this, data);
  };

  // Override res.send for non-JSON responses
  res.send = function (data) {
    captureAuditLog(req, res, data);
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Capture audit log based on route and method
 */
function captureAuditLog(req, res, responseData) {
  const method = req.method;
  const path = req.path;
  const userInfo = getUserInfo(req);

  // Skip audit for read-only operations and internal endpoints
  if (method === "GET" || path.includes("/debug") || path.includes("/audit") || path.includes("/backup")) {
    return;
  }

  let action = null;
  let entity = null;
  let entityId = null;
  let changes = null;
  let metadata = null;

  // Auth operations
  if (path === "/login") {
    action = "LOGIN";
    entity = "Auth";
    metadata = { success: res.statusCode === 200 };
    // Capture failed logins too
    if (res.statusCode === 401) {
      metadata.failedEmail = req.body?.email;
    }
  } else if (path === "/logout") {
    action = "LOGOUT";
    entity = "Auth";
  }

  // User management
  else if (path.includes("/users")) {
    entity = "User";
    if (method === "POST") {
      action = "CREATE";
      entityId = responseData?.user?.id;
      changes = { after: { email: req.body?.email, role: req.body?.role } };
    } else if (method === "PUT" || method === "PATCH") {
      action = "UPDATE";
      entityId = req.params.id || req.body?.id;
      changes = { after: req.body };
    } else if (method === "DELETE") {
      action = "DELETE";
      entityId = req.params.id;
    }
  }

  // Role changes (already has dedicated audit)
  else if (path.includes("/users") && path.includes("/role")) {
    return; // Skip, handled by RoleChangeAudit
  }

  // Purchase Requests
  else if (path.includes("/workflow/purchase-requests")) {
    entity = "PurchaseRequest";
    if (method === "POST") {
      action = "CREATE";
      entityId = req.body?.localId;
      metadata = { itemCount: req.body?.payload?.items?.length };
    } else if (method === "PUT" || method === "PATCH") {
      action = "UPDATE";
      entityId = req.body?.localId || req.params.id;
    } else if (method === "DELETE") {
      action = "DELETE";
      entityId = req.params.id;
    }
  }

  // Purchase Orders
  else if (path.includes("/workflow/purchase-orders")) {
    entity = "PurchaseOrder";
    if (method === "POST") {
      action = "CREATE";
      entityId = req.body?.localId;
      metadata = { itemCount: req.body?.payload?.items?.length, supplierId: req.body?.payload?.supplierId };
    } else if (method === "PUT" || method === "PATCH") {
      action = "UPDATE";
      entityId = req.body?.localId || req.params.id;
    } else if (method === "DELETE") {
      action = "DELETE";
      entityId = req.params.id;
    }
  }

  // Supplier Order Acknowledgements
  else if (path.includes("/workflow/supplier-order-acknowledgements")) {
    entity = "SupplierOrderAcknowledgement";
    if (method === "POST") action = "CREATE";
    else if (method === "PUT" || method === "PATCH") action = "UPDATE";
    else if (method === "DELETE") action = "DELETE";
    entityId = req.body?.localId || req.params.id;
  }

  // Deliveries
  else if (path.includes("/workflow/deliveries")) {
    entity = "Delivery";
    if (method === "POST") action = "CREATE";
    else if (method === "PUT" || method === "PATCH") action = "UPDATE";
    else if (method === "DELETE") action = "DELETE";
    entityId = req.body?.localId || req.params.id;
  }

  // GRNs
  else if (path.includes("/workflow/grns")) {
    entity = "GRN";
    if (method === "POST") action = "CREATE";
    else if (method === "PUT" || method === "PATCH") action = "UPDATE";
    else if (method === "DELETE") action = "DELETE";
    entityId = req.body?.localId || req.params.id;
  }

  // File uploads
  else if (path.includes("/chatbot/upload") || path.includes("/sources")) {
    entity = "File";
    action = "UPLOAD";
    entityId = responseData?.fileId || responseData?.id;
    metadata = {
      fileName: req.file?.originalname || req.body?.fileName,
      fileSize: req.file?.size,
      mimeType: req.file?.mimetype,
    };
  }


  // Export operations
  else if (path.includes("/export")) {
    entity = "Export";
    action = "EXPORT";
    metadata = {
      exportType: req.body?.type || req.query?.type,
      format: req.body?.format || req.query?.format,
    };
  }

  // If we identified an action, log it
  if (action && entity) {
    auditService.log({
      action,
      entity,
      entityId,
      ...userInfo,
      changes,
      metadata,
      status: res.statusCode < 400 ? "SUCCESS" : "FAILED",
    }).catch(err => {
      console.error("Audit log failed:", err);
    });
  }
}

/**
 * Manual audit logging helper for explicit calls
 */
export async function logAudit(req, { action, entity, entityId, changes, metadata }) {
  const userInfo = getUserInfo(req);

  try {
    await auditService.log({
      action,
      entity,
      entityId,
      ...userInfo,
      changes,
      metadata,
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("❌ [AUDIT-ERROR]", error.message);
  }
}
