import { Router } from "express";
import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
/* import fs from "fs";
import path from "path"; */

const router = Router();

/* const privateKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "rsa.key"),
  "utf8"
);
 */
// get new access token
router.post("/", async (req, res) => {
  console.log("== refresh token ==");
  const { error } = refreshTokenBodyValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const privateKey = Buffer.from(
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        "base64"
      ).toString("ascii");
      const accessToken = jwt.sign(payload, privateKey, {
        expiresIn: "30s",
        algorithm: "RS256",
      });
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(401).json(err));
});

// logout
router.delete("/", async (req, res) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Sucessfully" });

    await userToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
