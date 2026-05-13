import jwt from "jsonwebtoken";
import models from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next(); // sem token, vai seguir sem usuário

  const token = authHeader.split(" ")[1]; // extrair o Bearer <TOKEN>

  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.User.findByPk(payload.id);
    req.context.me = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export const protectRoutes = (req, res, next) => {
    console.log("METHOD:", req.method);
  console.log("originalUrl:", req.originalUrl);
  console.log("me:", req.context.me);


  const writeMethod = ["POST", "PUT", "DELETE"].includes(req.method);

  const whitelist = [
    { method: "POST", path: "/session" },
    { method: "POST", path: "/session/refresh" },
    { method: "POST", path: "/user" },
  ];

  const isWhitelisted = whitelist.some(
    (r) => r.method === req.method && req.originalUrl.startsWith(r.path)
  );

  if (isWhitelisted) return next();

  // GET /session exigir login
  if (req.method === "GET" && req.originalUrl.startsWith("/session")) {
    if (!req.context.me) return res.status(401).json({ error: "Não autorizado" });
    return next();
  }

  // Bloquear escrita sem autenticação
  if (writeMethod && !req.context.me) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
};