import prisma from "../config/prisma.js";

/**
 * Audit Log Service
 * Tracks all critical operations in the system for compliance and debugging
 */

class AuditService {
  /**
   * Log an action to the audit trail
   * @param {Object} params
   * @param {string} params.action - Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
   * @param {string} params.entity - Entity type (User, PurchaseRequest, etc.)
   * @param {string} [params.entityId] - ID of the affected entity
   * @param {number} [params.userId] - User who performed the action
   * @param {string} [params.userEmail] - Email of the actor
   * @param {string} [params.userName] - Name of the actor
   * @param {string} [params.ipAddress] - IP address
   * @param {string} [params.userAgent] - Browser/client info
   * @param {Object} [params.changes] - What changed: {before, after}
   * @param {Object} [params.metadata] - Additional context
   * @param {string} [params.status] - SUCCESS or FAILED
   * @param {string} [params.errorMsg] - Error message if failed
   */
  async log({
    action,
    entity,
    entityId = null,
    userId = null,
    userEmail = null,
    userName = null,
    ipAddress = null,
    userAgent = null,
    changes = null,
    metadata = null,
    status = "SUCCESS",
    errorMsg = null,
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          entity,
          entityId: entityId ? String(entityId) : null,
          userId,
          userEmail,
          userName,
          ipAddress,
          userAgent,
          changes,
          metadata,
          status,
          errorMsg,
        },
      });
    } catch (error) {
      // Don't let audit logging break the main operation
      console.error("❌ [AUDIT-ERROR] Failed to log audit entry:", error.message);
    }
  }

  /**
   * Query audit logs with filters
   */
  async query({
    userId = null,
    entity = null,
    action = null,
    startDate = null,
    endDate = null,
    limit = 100,
    offset = 0,
  }) {
    const where = {};

    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, limit, offset };
  }

  /**
   * Get audit trail for a specific entity
   */
  async getEntityHistory(entity, entityId, limit = 50) {
    return await prisma.auditLog.findMany({
      where: {
        entity,
        entityId: String(entityId),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get user activity history
   */
  async getUserActivity(userId, limit = 50) {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get statistics
   */
  async getStats(startDate = null, endDate = null) {
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [total, byAction, byEntity, byStatus, failed] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ["action"],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ["entity"],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
      prisma.auditLog.count({
        where: { ...where, status: "FAILED" },
      }),
    ]);

    return {
      total,
      failed,
      byAction: byAction.map((g) => ({ action: g.action, count: g._count })),
      byEntity: byEntity.map((g) => ({ entity: g.entity, count: g._count })),
      byStatus: byStatus.map((g) => ({ status: g.status, count: g._count })),
    };
  }
}

export default new AuditService();
