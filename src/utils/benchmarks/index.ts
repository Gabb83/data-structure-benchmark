import { Registro } from "../generateData";
import { benchmarkArray } from "./array";
import { benchmarkArvoreBinaria } from "./arvoreBinaria";
import { benchmarkMap } from "./map";

export function executar(estrutura: string, operacao: string, dados: Registro[], termo: string): Registro[] {
  if(estrutura === "Array") return benchmarkArray(operacao, dados, termo);
  if(estrutura === "Map") return benchmarkMap(operacao, dados, termo);
  if(estrutura === "Árvore Binária") return benchmarkArvoreBinaria(operacao, dados, termo);
  
  return [];
}