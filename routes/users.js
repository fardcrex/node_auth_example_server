import { Router } from "express";
import fs from "fs";

import UserToken from "../models/UserToken.js";
import Market from "../models/Market.js";
import auth from "../middleware/auth.js";

import bcrypt from "bcrypt";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();
const hashCode = function (s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
};

router.get("/mercados", auth, async (req, res) => {
  const marketsDb = await Market.find({});
  console.log({
    getMercadosFrom: req.rawHeaders,
    at: Date.now().toLocaleString(),
  });
  const markets = marketsDb.map((data) => {
    return { ...data._doc, id: hashCode(data._doc._id.toString()) };
  });

  res.status(200).json({
    succes: true,
    data: markets,
  });
});

router.get(
  "/loadMarkets",
  auth,
  roleCheck(["super_admin"]),
  async (req, res) => {
    const markets = JSON.parse(
      fs.readFileSync("./data/mercados_list.json", "utf-8")
    );

    await Market.insertMany(markets, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: `Error interno del servidor. ${err.message}`,
        });
      }
      return res.status(200).json({ message: "mercados cargados" });
    });
    //return res.status(200).json({ message: "user authenticated." });
  }
);

router.delete("/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;

    await UserToken.deleteMany({ userId: user._id });

    res
      .status(200)
      .json({ error: false, message: "Logged All Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});
router.get("/test", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("req.body.password", salt);
    res.status(200).json({ error: false, message: hashPassword });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
