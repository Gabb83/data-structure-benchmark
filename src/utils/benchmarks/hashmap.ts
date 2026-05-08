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

  private _gerarHash(chave: number): number {
    return Math.abs(chave) % this.tamanho;
  }

  inserir(registro: Registro) {
    const indice = this._gerarHash(registro.idx);
    const novoNodo = new NoHash(registro.idx, registro);

    if (this.tabela[indice] === null) {
      this.tabela[indice] = novoNodo;
    } else {
      novoNodo.proxNo = this.tabela[indice];
      this.tabela[indice] = novoNodo;
    }
  }

  buscarPorIdx(idx: number): Registro | null {
    const indice = this._gerarHash(idx);
    let atual = this.tabela[indice];

    while (atual !== null) {
      if (atual.chave === idx) return atual.valor;
      atual = atual.proxNo;
    }
    return null;
  }

  todosRegistros(): Registro[] {
    const resultado: Registro[] = [];
    for (let i = 0; i < this.tamanho; i++) {
      let atual = this.tabela[i];
      while (atual !== null) {
        resultado.push(atual.valor);
        atual = atual.proxNo;
      }
    }
    return resultado;
  }

  filtrarCategoria(termo: string): Registro[] {
    const resultado: Registro[] = [];
    const termoLower = termo.toLowerCase();

    for (let i = 0; i < this.tamanho; i++) {
      let atual = this.tabela[i];
      while (atual !== null) {
        if (atual.valor.categoria.toLowerCase().includes(termoLower)) {
          resultado.push(atual.valor);
        }
        atual = atual.proxNo;
      }
    }
    return resultado;
  }
}

export function benchmarkHashmap(operacao: string, dados: Registro[], termo: string) {
  const hashmap = new TabelaHash(dados.length * 1.5);
  dados.forEach((item) => hashmap.inserir(item));

  if (operacao === "Busca") {
    const encontrado = hashmap.buscarPorIdx(Number(termo));
    return encontrado ? [encontrado] : [];
  }

  if (operacao === "Filtro") {
    return hashmap.filtrarCategoria(termo);
  }

  if (operacao === "Ordenação") {
    return hashmap.todosRegistros().sort((a, b) => a.idx - b.idx);
  }

  return [];
}