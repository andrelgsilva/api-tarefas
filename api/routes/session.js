import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.context.me.id);

  if (!user) {
    return res.status(404).send();
  }

  return res.status(200).send(user);
});

export default router;
