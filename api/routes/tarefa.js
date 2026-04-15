import express from "express";
import * as controller from "../controllers/tarefaController.js";

const router = express.Router();

router.post("/", controller.criarTarefaController);
router.get("/", controller.listarTarefasController);
router.get("/:objectId", controller.buscarTarefaController);
router.put("/:objectId", controller.atualizarTarefaController);
router.delete("/:objectId", controller.deletarTarefaController);

export default router;