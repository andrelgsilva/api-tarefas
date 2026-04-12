import * as service from "../services/tarefaService.js";

export const criarTarefa = async (req, res) => {
  try {
    const tarefa = await service.criarTarefa(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarTarefas = async (req, res) => {
  const tarefas = await service.listarTarefas();
  res.json(tarefas);
};

export const buscarTarefa = async (req, res) => {
  try {
    const tarefa = await service.buscarTarefa(req.params.objectId);
    res.json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const atualizarTarefa = async (req, res) => {
  try {
    const tarefa = await service.atualizarTarefa(req.params.objectId, req.body);
    res.json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deletarTarefa = async (req, res) => {
  try {
    await service.deletarTarefa(req.params.objectId);
    res.json({ mensagem: "Tarefa removida com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};