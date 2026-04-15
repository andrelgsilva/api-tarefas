import "dotenv/config";
import cors from "cors";
import express from "express";
import { tarefa, session, user, message } from "./routes/index.js";

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log das requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Rota raiz (health check)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API de tarefas rodando" });
});

// Rotas principais
app.use("/tarefas", tarefa);
app.use("/session", session);
app.use("/user", user);
app.use("/message", message);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

export default app;