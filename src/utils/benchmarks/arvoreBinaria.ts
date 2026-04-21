import { Registro } from "../generateData";

class No {
  registro: Registro;
  esquerda: No | null = null;
  direita: No | null = null;

  constructor(registro: Registro) {
    this.registro = registro;
  }
}

class Arvore {
  raiz: No | null = null;

  inserir(registro: Registro) {
    this.raiz = this._inserir(this.raiz, registro);
  }

  private _inserir(no: No | null, registro: Registro): No {
    if(no === null) return new No(registro);

    if(registro.idx < no.registro.idx) {
      no.esquerda = this._inserir(no.esquerda, registro);
    } else {
      no.direita = this._inserir(no.direita, registro);
    }

    return no;
  }

  emOrdem(): Registro[] {
    const resultado: Registro[] = [];
    const pilha: No[] = [];
    let atual: No | null = this.raiz;

    while (atual !== null || pilha.length > 0) {
      while (atual !== null) {
        pilha.push(atual);
        atual = atual.esquerda;
      }
      atual = pilha.pop()!;
      resultado.push(atual.registro);
      atual = atual.direita;
    }

    return resultado;
  }

  buscarPorIdx(idx: number): Registro | null {
    let atual = this.raiz;
    while (atual !== null) {
      if (idx === atual.registro.idx) return atual.registro;
      atual = idx < atual.registro.idx ? atual.esquerda : atual.direita;
    }
    return null;
  }

  filtrarCategoria(termo: string): Registro[] {
    const resultado: Registro[] = [];
    this._filtrar(this.raiz, termo.toLowerCase(), resultado);
    return resultado;
  }

  private _filtrar(no: No | null, termo: string, resultado: Registro[]) {
    if(no === null) return;

    if(no.registro.categoria.toLowerCase().includes(termo)) {
      resultado.push(no.registro);
    }

    this._filtrar(no.esquerda, termo, resultado);
    this._filtrar(no.direita, termo, resultado);
  }
}

export function benchmarkArvoreBinaria(operacao: string, dados: Registro[], termo: string): Registro[] {
  const abb = new Arvore();
  
  const embaralhado = [...dados].sort(() => Math.random() - 0.5);
  embaralhado.forEach((item) => abb.inserir(item));

  if(operacao === "Ordenação") return abb.emOrdem();
  
  if(operacao === "Busca") {
    const encontrado = abb.buscarPorIdx(Number(termo));
    return encontrado ? [encontrado] : [];
  }

  if(operacao === "Filtro") return abb.filtrarCategoria(termo);
  return [];
}