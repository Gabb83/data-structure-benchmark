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
    this._emOrdem(this.raiz, resultado);
    return resultado;
  }

  private _emOrdem(no: No | null, resultado: Registro[]) {
    if (no === null) return;

    this._emOrdem(no.esquerda, resultado);
    resultado.push(no.registro);
    this._emOrdem(no.direita, resultado);
  }

  buscarPorIdx(idx: number): Registro | null {
    return this._buscarIdx(this.raiz, idx);
  }

  private _buscarIdx(no: No | null, idx: number): Registro | null {
    if (no === null) return null;
    if (no.registro.idx === idx) return no.registro;

    if (idx < no.registro.idx) {
      return this._buscarIdx(no.esquerda, idx);
    } else {
      return this._buscarIdx(no.direita, idx);
    }
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

  dados.forEach((item) => (abb.inserir(item)));

  if(operacao === "Ordenação") return abb.emOrdem();
  
  if(operacao === "Busca") {
    const encontrado = abb.buscarPorIdx(Number(termo));
    return encontrado ? [encontrado] : [];
  }

  if(operacao === "Fitro") return abb.filtrarCategoria(termo);
  return [];
}