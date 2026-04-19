import { neon } from "@neondatabase/serverless";
import { Tarefa } from "../models/tarefa.js";

const sql = neon(process.env.DATABASE_URL);

// CREATE
import { v4 as uuidv4 } from "uuid";

export const criarTarefa = async (data) => {
  if (!data.descricao) throw new Error("O campo descricao é obrigatório");
  
  const objectId = uuidv4();

  const result = await sql`
    INSERT INTO tarefas (id, titulo, descricao, concluida)
    VALUES (${objectId}, ${data.titulo}, ${data.descricao}, ${data.concluida ?? false})
    RETURNING *
  `;
  return result[0];
};

// READ ALL
export const listarTarefas = async () => {
  const tarefas = await sql`SELECT * FROM tarefas`;
  return tarefas;
};

// READ ONE
export const buscarTarefa = async (id) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE id = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  return result[0];
};

// UPDATE
export const atualizarTarefa = async (id, data) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE id = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  const tarefa = result[0];

  const novoTitulo = data.titulo ?? tarefa.titulo;
  const novaDescricao = data.descricao || tarefa.descricao;
  const novaConclusao = data.concluida ?? tarefa.concluida;

  const updated = await sql`
    UPDATE tarefas
    SET 
      titulo = ${novoTitulo},
      descricao = ${novaDescricao}, 
      concluida = ${novaConclusao}
    WHERE id = ${id}
    RETURNING *
  `;

  return updated[0];
};

// DELETE
export const deletarTarefa = async (id) => {
  const result = await sql`
    SELECT * FROM tarefas WHERE id = ${id}
  `;

  if (result.length === 0) throw new Error("Tarefa não encontrada");

  await sql`DELETE FROM tarefas WHERE id = ${id}`;
};