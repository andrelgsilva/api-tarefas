export class Tarefa {
  constructor({ objectId, descricao, concluida = false }) {
    if (!descricao) {
      throw new Error("Descrição é obrigatória");
    }

    this.objectId = objectId;
    this.descricao = descricao;
    this.concluida = concluida;
  }
}