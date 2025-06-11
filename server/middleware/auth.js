const isActive = (req, res, next) => {
  if (req.user?.isBlocked) {
    return res.status(403).json({ message: "Account is blocked" });
  }
  next();
};

module.exports = isActive;
