import { Registro } from "../generateData";

export function benchmarkMap(operacao: string, dados: Registro[], termo: string): Registro[] {
  const mapa = new Map<number, Registro>();
  dados.forEach((item) => mapa.set(item.idx, item));

  if(operacao === "Ordenação") return [...mapa.values()].sort((a, b) => a.preco - b.preco);
  
  if (operacao === "Busca") {
    const encontrado = mapa.get(Number(termo));
    return encontrado ? [encontrado] : [];
  } 
  
  if(operacao === "Filtro") return [...mapa.values()].filter((item) => item.categoria.toLowerCase().includes(termo.toLowerCase()));

  return [];
}