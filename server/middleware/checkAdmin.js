const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "Access denied: Admins only"));
  }
  next();
};

module.exports = checkAdmin;