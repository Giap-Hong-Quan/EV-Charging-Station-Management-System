export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const logLine = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent")
  };
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} from ${logLine.ip}`);
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${new Date().toISOString()}] Response ${res.statusCode} for ${req.method} ${req.originalUrl}`);
    return originalSend.call(this, data);
  };
  
  next();
}

