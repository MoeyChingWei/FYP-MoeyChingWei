import prisma from '../config/prisma.js';
import { ROLES } from '../constants/roles.js';

/**
 * Simple authentication middleware that validates userId and email from query/body
 * This matches the existing pattern used in authController.js
 *
 * In test environments, if req.user is already set (by test mock), skip validation
 */
export function authenticateRequest(req, res, next) {
  // Allow test mock authentication to bypass
  if (req.user && process.env.NODE_ENV === 'test') {
    req.auth = {
      userId: req.user.id,
      email: req.user.email
    };
    return next();
  }

  const userId = req.query.userId || req.body?.userId;
  const email = req.query.email || req.body?.email;

  if (!userId || !email) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required: userId and email must be provided'
    });
  }

  const parsedUserId = Number(userId);
  if (!Number.isFinite(parsedUserId)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid userId'
    });
  }

  // Attach to request for downstream use
  req.auth = {
    userId: parsedUserId,
    email: String(email).trim().toLowerCase()
  };

  next();
}

/**
 * Authorization middleware factory for role-based access control
 * @param {string[]} allowedRoles - Array of role names that are allowed
 *
 * In test environments, if req.user is already set with a role, skip DB lookup
 */
export function requireRoles(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.auth) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Allow test mock user to bypass DB lookup
      if (req.user && process.env.NODE_ENV === 'test') {
        if (!req.user.isActive && req.user.isActive !== undefined) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: account is deactivated'
          });
        }

        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: `Access denied: requires one of [${allowedRoles.join(', ')}]`
          });
        }

        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: req.auth.userId },
        select: { id: true, email: true, role: true, department: true, isActive: true }
      });

      if (!user || user.email.toLowerCase() !== req.auth.email) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: user not found or email mismatch'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: account is deactivated'
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: requires one of [${allowedRoles.join(', ')}]`
        });
      }

      // Attach full user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
}

/**
 * Department-scoped authorization: ensures user can only access their own department data
 * Use after requireRoles middleware
 */
export function requireOwnDepartment(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Treasury/Finance Officer and Admin can access all departments
  if ([ROLES.TREASURY_FINANCE_OFFICER, ROLES.ADMIN].includes(req.user.role)) {
    next();
    return;
  }

  // Department Executive can only access their own department
  const departmentId = req.params.departmentId || req.body.departmentId;

  if (!departmentId) {
    // No department scoping required for this endpoint
    next();
    return;
  }

  // Validate department access
  prisma.department.findUnique({
    where: { id: parseInt(departmentId) }
  }).then(department => {
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const userDept = String(req.user.department || '').trim();
    const deptCode = String(department.code || '').trim();
    const deptName = String(department.name || '').trim();

    if (userDept.toLowerCase() !== deptCode.toLowerCase() &&
        userDept.toLowerCase() !== deptName.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: cannot access other department data'
      });
    }

    next();
  }).catch(error => {
    console.error('Department authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  });
}
