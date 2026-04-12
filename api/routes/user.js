import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.status(200).send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);

  if (!user) {
    return res.status(404).send();
  }

  return res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const user = await req.context.models.User.create({
    username: req.body.username,
    email: req.body.email,
  });

  return res.status(201).send(user);
});

router.put("/:userId", async (req, res) => {
  const response = await req.context.models.User.update(
    {
      username: req.body.username,
      email: req.body.email,
    },
    {
      where: { id: req.params.userId },
      returning: true,
    },
  );

  if (response[0] === 0) {
    return res.status(404).send();
  }

  const user = response[1][0];
  return res.status(200).send(user);
});

router.delete("/:userId", async (req, res) => {
  const result = await req.context.models.User.destroy({
    where: { id: req.params.userId },
  });

  if (!result) {
    return res.status(404).send();
  }

  return res.status(204).send();
});

export default router;
