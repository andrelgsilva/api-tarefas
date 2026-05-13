import "./env.js";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models/index.js";
import { tarefa, session, user, message } from "./routes/index.js";
import { authMiddleware, protectRoutes } from "./middlewares/auth.js";
import bcrypt from "bcrypt";

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(async (req, res, next) => {
  req.context = { models };
  next();
});

app.use(authMiddleware);
app.use(protectRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API de tarefas rodando" });
});

app.use("/tarefas", tarefa);
app.use("/session", session);
app.use("/user", user);
app.use("/message", message);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
});

const createUsersWithMessages = async () => {
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password456", 10);

  const user1 = await models.User.create({
    username: "rwieruch",
    email: "rwieruch@example.com",
    password: password1,
  });

  const user2 = await models.User.create({
    username: "ddavids",
    email: "ddavids@example.com",
    password: password2,
  });

  await models.Message.create({ text: "Hello World", userId: user1.id });
  await models.Message.create({ text: "Hi again", userId: user2.id });
};

sequelize.sync({ force: true }).then(async () => {
  await createUsersWithMessages();

  if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  }
});

export default app;