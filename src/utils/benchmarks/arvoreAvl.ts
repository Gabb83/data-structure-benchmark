import { Registro } from "../generateData";

class No {
  registro: Registro;
  esquerda: No | null = null;
  direita: No | null = null;
  altura: number = 1;

  constructor(registro: Registro){
    this.registro = registro;
  }
}

class ArvoreAvl {
  raiz: No | null = null;

  private getAltura(no: No | null): number {
    return no ? no.altura : 0;
  } 

  private getFatorBalanceamento(no: No | null): number {
    return no ? this.getAltura(no.esquerda) - this.getAltura(no.direita) : 0;
  }

  private atualizarAltura(no: No) {
    no.altura = 1 + Math.max(this.getAltura(no.esquerda), this.getAltura(no.direita));
  }

  private rotacionarDireita(y: No): No {
    const x = y.esquerda!;
    const T2 = x.direita;

    x.direita = y;
    y.esquerda = T2;

    this.atualizarAltura(y);
    this.atualizarAltura(x);

    return x;
  }

  private rotacionarEsquerda(x: No): No {
    const y = x.direita!;
    const T2 = y.esquerda;

    y.esquerda = x;
    x.direita = T2;

    this.atualizarAltura(x);
    this.atualizarAltura(y);

    return y;
  }

  inserir(registro: Registro) {
    this.raiz = this._inserir(this.raiz, registro);
  }

  private _inserir(no: No | null, registro: Registro): No {
    // 1. Inserção normal de BST
    if (no === null) return new No(registro);

    if (registro.idx < no.registro.idx) {
      no.esquerda = this._inserir(no.esquerda, registro);
    } else if (registro.idx > no.registro.idx) {
      no.direita = this._inserir(no.direita, registro);
    } else {
      return no; // Não permite duplicatas de IDX
    }

    // 2. Atualiza a altura do nó pai
    this.atualizarAltura(no);

    // 3. Verifica o fator de balanceamento para ver se ficou desbalanceado
    const balanceamento = this.getFatorBalanceamento(no);

    // Caso 1: Esquerda-Esquerda (LL)
    if (balanceamento > 1 && registro.idx < no.esquerda!.registro.idx) {
      return this.rotacionarDireita(no);
    }

    // Caso 2: Direita-Direita (RR)
    if (balanceamento < -1 && registro.idx > no.direita!.registro.idx) {
      return this.rotacionarEsquerda(no);
    }

    // Caso 3: Esquerda-Direita (LR)
    if (balanceamento > 1 && registro.idx > no.esquerda!.registro.idx) {
      no.esquerda = this.rotacionarEsquerda(no.esquerda!);
      return this.rotacionarDireita(no);
    }

    // Caso 4: Direita-Esquerda (RL)
    if (balanceamento < -1 && registro.idx < no.direita!.registro.idx) {
      no.direita = this.rotacionarDireita(no.direita!);
      return this.rotacionarEsquerda(no);
    }

    return no;
  }

  // Métodos de Busca e Ordenação (Iguais à sua ABB)
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
  // ... dentro da classe ArvoreAvl

  buscarPorIdx(idx: number): Registro | null {
    let atual = this.raiz;
    while (atual !== null) {
      if (idx === atual.registro.idx) return atual.registro;
      // A busca continua sendo O(log n), mas agora garantida pelo balanceamento
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
    if (no === null) return;

    // O filtro percorre a árvore toda, então continua sendo O(n)
    if (no.registro.categoria.toLowerCase().includes(termo)) {
      resultado.push(no.registro);
    }

    this._filtrar(no.esquerda, termo, resultado);
    this._filtrar(no.direita, termo, resultado);
  }
}

export function benchmarkArvoreAvl(
  operacao: string, 
  dados: Registro[], 
  termo: string
): Registro[] {
  const avl = new ArvoreAvl();
  
  // 1. Medição da Inserção (Custo de Montagem)
  // Para a AVL, o custo de montagem é crucial no seu relatório
  const inicioMontagem = performance.now();
  
  // Dica: Para a AVL, não é estritamente necessário embaralhar para evitar 
  // degeneração (ela resolve isso), mas manter o shuffle garante 
  // igualdade de condições com a ABB no seu teste.
  const dadosParaInserir = [...dados].sort(() => Math.random() - 0.5);
  
  dadosParaInserir.forEach((item) => avl.inserir(item));
  const fimMontagem = performance.now();
  
  // Você pode imprimir isso no console para ver a diferença de 'set-up'
  // console.log(`Montagem AVL: ${fimMontagem - inicioMontagem}ms`);

  // 2. Execução das Operações de Benchmark
  if (operacao === "Ordenação") {
    return avl.emOrdem();
  }
  
  if (operacao === "Busca") {
    const encontrado = avl.buscarPorIdx(Number(termo));
    return encontrado ? [encontrado] : [];
  }

  if (operacao === "Filtro") {
    return avl.filtrarCategoria(termo);
  }

  return [];
}