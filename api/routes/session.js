import { Router } from "express";
import { login, logout, refresh } from "../controllers/sessionController.js";

const router = Router();

router.get("/", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.context.me.id);
  if (!user) return res.status(404).send();
  return res.status(200).send(user);
});

router.post("/", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;