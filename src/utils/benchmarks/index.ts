import { Registro } from "../generateData";
import { benchmarkArray } from "./array";
import { benchmarkMap } from "./map";

export function executar(estrutura: string, operacao: string, dados: Registro[], termo: string): Registro[] {
  if (estrutura === "array") return benchmarkArray(operacao, dados, termo);
  if (estrutura === "map") return benchmarkMap(operacao, dados, termo);
  
  return [];
}