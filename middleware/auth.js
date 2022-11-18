import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
const publicKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "rsa.key.pub"),
  "utf8"
);
const auth = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    console.log({ err: "No token provided" });
    return res
      .status(400)
      .json({ error: true, message: "Access Denied: No token provided" });
  }

  try {
    const publicKey = Buffer.from(
      process.env.ACCESS_TOKEN_PUBLIC_KEY,
      "base64"
    ).toString("ascii");
    const tokenDetails = jwt.verify(token, publicKey, { algorithm: "RS256" });
    req.user = tokenDetails;
    next();
  } catch (err) {
    console.log({ err: "jwt Experired Error" });
    res
      .status(401)
      .json({ error: true, message: "Access Denied: Invalid token puto" });
  }
};

export default auth;
