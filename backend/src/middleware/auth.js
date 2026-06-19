import prisma from '../../config/prisma.js';

/**
 * Authentication middleware for routes that require userId and email validation
 *
 * For GET requests: Expects userId and email as query parameters
 * For other requests: Expects userId and email in request body
 *
 * After validation, attaches validated user data to req.user
 */
export async function authenticateToken(req, res, next) {
  try {
    let userId, email;

    // Extract userId and email from query params (GET) or body (POST/PUT/PATCH)
    if (req.method === 'GET') {
      userId = Number(req.query.userId);
      email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
    } else {
      userId = Number(req.body.userId);
      email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    }

    // Validate parameters
    if (!Number.isFinite(userId) || !email) {
      return res.status(400).json({
        success: false,
        message: 'userId and email are required'
      });
    }

    const normalized = email.toLowerCase();

    // Verify user exists and email matches
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        isActive: true
      }
    });

    if (!user || user.email.toLowerCase() !== normalized) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed'
      });
    }

    // Attach validated user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
