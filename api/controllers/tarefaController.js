import { criarTarefa, listarTarefas, buscarTarefa, atualizarTarefa, deletarTarefa } from "../services/index.js";

export const criarTarefaController = async (req, res) => {
  try {
    const tarefa = await criarTarefa(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarTarefasController = async (req, res) => {
  try {
    const tarefas = await listarTarefas();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarTarefaController = async (req, res) => {
  try {
    const tarefa = await buscarTarefa(req.params.objectId);
    res.json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const atualizarTarefaController = async (req, res) => {
  try {
    const tarefa = await atualizarTarefa(req.params.objectId, req.body);
    res.json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deletarTarefaController = async (req, res) => {
  try {
    await deletarTarefa(req.params.objectId);
    res.json({ mensagem: "Tarefa removida com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};