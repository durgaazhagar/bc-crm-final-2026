const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const fallbackMarker = res.locals?.authFallback ? ' [AUTH FALLBACK]' : '';
    const dbStatus = res.locals?.dbConnected !== undefined ? (res.locals.dbConnected ? ' [DB CONNECTED]' : ' [DB DISCONNECTED]') : '';
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms${fallbackMarker}${dbStatus}`);
  });
  next();
};

module.exports = logger;
