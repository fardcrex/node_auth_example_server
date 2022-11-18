import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";
import fs from "fs";
import path from "path";

/* const privateKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "rsa.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "rsa.key.pub"),
  "utf8"
); */
const generateTokens = async (user) => {
  try {
    const privateKey = Buffer.from(
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      "base64"
    ).toString("ascii");

    const payload = { _id: user._id, roles: user.roles };
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "90s" }
    );

    /*   const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.remove(); */

    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export default generateTokens;
