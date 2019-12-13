import jwt from "jsonwebtoken";
import config from "config";

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  const secret = config.get("jwtSecret");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Missing auth token. Auth failed." });
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.income = decodedToken.income;

    next();
  } catch (error) {
    res.status(401).json({ message: "invalid auth token. Auth failed." });
  }
};

export default auth;
