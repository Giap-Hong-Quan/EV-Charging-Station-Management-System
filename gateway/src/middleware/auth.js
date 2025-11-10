export function authenticate(req, res, next) {
  // Extract token from headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For now, allow requests without auth (you can enable this later)
    // return res.status(401).json({
    //   error: "Unauthorized",
    //   message: "No authentication token provided"
    // });
    return next();
  }
  
  const token = authHeader.substring(7);
  
  // TODO: Implement token validation
  // For now, just pass through
  next();
}

export function optionalAuth(req, res, next) {
  // This middleware doesn't enforce authentication
  return next();
}

