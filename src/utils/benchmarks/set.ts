import { Registro } from "../generateData";

export function benchmarkSet(operacao: string, dados: Registro[], termo: string): Registro[] {
  if(operacao === "Busca") {
    const set = new Set(dados.map((item) => item.idx));
    const existe = set.has(Number(termo));

    return existe ? dados.filter((item) => item.idx === Number(termo)) : [];
  }

  if(operacao === "Ordenação") {
    const set = new Set(dados);
    return [...set].sort((a, b) => a.preco - b.preco);
  }

  if(operacao === "Filtro") {
    const set = new Set(dados);
    return [...set].filter((item) => item.categoria.toLowerCase().includes(termo.toLowerCase()));
  }

  return [];
}