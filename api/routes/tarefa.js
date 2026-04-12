import express from "express";
import * as controller from "../controllers/tarefaController.js";

const router = express.Router();

router.post("/", controller.criarTarefa);
router.get("/", controller.listarTarefas);
router.get("/:objectId", controller.buscarTarefa);
router.put("/:objectId", controller.atualizarTarefa);
router.delete("/:objectId", controller.deletarTarefa);

export default router;