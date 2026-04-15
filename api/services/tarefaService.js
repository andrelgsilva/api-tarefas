import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from "uuid";
import { Tarefa } from "../models/tarefa.js";

const sql = neon(process.env.DATABASE_URL);

// CREATE
export const criarTarefa = async (data) => {
  const tarefa = new Tarefa({
    objectId: uuidv4(),
    descricao: data.descricao,
    concluida: data.concluida ?? false,
  });

  await sql`
    INSERT INTO tarefas (objectId, descricao, concluida)
    VALUES (${tarefa.objectId}, ${tarefa.descricao}, ${tarefa.concluida})
  `;

  return tarefa;
};

// READ ALL
export const listarTarefas = async () => {
  const tarefas = await sql`SELECT * FROM tarefas`;
  return tarefas;
};

// READ ONE
export const buscarTarefa = async (id) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE objectId = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  return result[0];
};

// UPDATE
export const atualizarTarefa = async (id, data) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE objectId = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  const tarefa = result[0];
  const novaDescricao = data.descricao ?? tarefa.descricao;
  const novaConclusao = data.concluida ?? tarefa.concluida;

  await sql`
    UPDATE tarefas
    SET descricao = ${novaDescricao}, concluida = ${novaConclusao}
    WHERE objectId = ${id}
  `;

  return { ...tarefa, descricao: novaDescricao, concluida: novaConclusao };
};

// DELETE
export const deletarTarefa = async (id) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE objectId = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  await sql`DELETE FROM tarefas WHERE objectId = ${id}`;
};