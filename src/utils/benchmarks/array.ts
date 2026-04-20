import { Registro } from "../generateData";

export function benchmarkArray(operacao: string, dados: Registro[], termo: string) {
  if(operacao === "Ordenação") {
    return [...dados].sort((a, b) => a.preco - b.preco);

  } else if(operacao === "Busca") {
    const encontrado = dados.find((item) => item.idx === Number(termo));
    return encontrado ? [encontrado] : [];

  } else {
    return dados.filter((item) => item.categoria.toLowerCase().includes(termo.toLowerCase()));
  }
}