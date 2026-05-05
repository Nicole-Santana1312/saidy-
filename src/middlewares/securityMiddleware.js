const loginAttempts = new Map();

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

function limitLoginAttempts(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const attempt = loginAttempts.get(key) || {
    count: 0,
    firstAttemptAt: now,
  };

  if (now - attempt.firstAttemptAt > LOGIN_WINDOW_MS) {
    attempt.count = 0;
    attempt.firstAttemptAt = now;
  }

  attempt.count += 1;
  loginAttempts.set(key, attempt);

  if (attempt.count > MAX_LOGIN_ATTEMPTS) {
    const error = new Error(
      "Demasiados intentos de inicio de sesion. Intenta de nuevo en 15 minutos."
    );
    error.status = 429;
    return next(error);
  }

  return next();
}

function clearLoginAttempts(req) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  loginAttempts.delete(key);
}

module.exports = {
  clearLoginAttempts,
  limitLoginAttempts,
};
