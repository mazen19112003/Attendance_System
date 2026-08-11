const jwt = require("jsonwebtoken");

// بيتأكد إن فيه توكن صحيح قبل ما يسمح بالدخول لأي route محمي
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "لازم تسجل دخول الأول",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "الجلسة انتهت، سجل دخول تاني",
    });
  }
};

module.exports = { protect };