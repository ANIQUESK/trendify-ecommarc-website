import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Unauthorized, invalid credentials" });
    }

    next();
  } catch (error) {
    console.log("Error while authenticating admin: ", error.message);
    res.status(401).json({ success: false, message: "Session expired or invalid token. Please log in again." });
  }
};

export default adminAuth;
