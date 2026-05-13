import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import models from "../models/index.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m",
  });
};

const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

export const login = async (req, res) => {
  const { login, password } = req.body;

  const user = await models.User.findByLogin(login);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Credenciais inválidas" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await user.update({ refreshToken, refreshTokenExpiresAt });

  return res.json({ accessToken, refreshToken });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await models.User.findOne({ where: { refreshToken } });
  if (!user) return res.status(404).json({ error: "Token não encontrado" });

  await user.update({ refreshToken: null, refreshTokenExpiresAt: null }); // corrigido typo

  return res.json({ message: "Logout realizado com sucesso" });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await models.User.findOne({ where: { refreshToken } });
  if (!user) return res.status(401).json({ error: "Refresh token inválido" });

  if (new Date() > user.refreshTokenExpiresAt) {
    return res.status(401).json({ error: "Refresh token expirado" });
  }

  const originalExpiresAt = user.refreshTokenExpiresAt;

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  await user.update({
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: originalExpiresAt,
  });

  return res.json({ accessToken, refreshToken: newRefreshToken });
};