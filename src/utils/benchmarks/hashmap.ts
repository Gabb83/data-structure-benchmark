import { Registro } from "../generateData";

class NoHash {
  chave: number;
  valor: Registro;
  proxNo: NoHash | null = null;

  constructor(chave: number, valor: Registro) {
    this.chave = chave;
    this.valor = valor;
  }
}

class TabelaHash {
  private tamanho: number;
  private tabela: (NoHash | null)[];

  constructor(capacidade: number = 1000) {
    this.tamanho = capacidade;
    this.tabela = new Array(this.tamanho).fill(null);
  }
}

export function benchmarkHashmap(operacao: string, dados: Registro[], termo: string) {
  const hashmap = new TabelaHash(dados.length * 1.5);
  
  return [];
}