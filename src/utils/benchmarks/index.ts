import { Registro } from "../generateData";
import { benchmarkArray } from "./array";
import { benchmarkArvoreAvl } from "./arvoreAvl";
import { benchmarkArvoreBinaria } from "./arvoreBinaria";
import { benchmarkMap } from "./map";
import { benchmarkSet } from "./set";

export function executar(estrutura: string, operacao: string, dados: Registro[], termo: string): Registro[] {
  if (estrutura === "Array") return benchmarkArray(operacao, dados, termo);
  if (estrutura === "Map") return benchmarkMap(operacao, dados, termo);
  if (estrutura === "Árvore Binária") return benchmarkArvoreBinaria(operacao, dados, termo);
  if (estrutura === "Set") return benchmarkSet(operacao, dados, termo);
  if (estrutura === "Árvore AVL") return benchmarkArvoreAvl(operacao, dados, termo);

  return [];
}