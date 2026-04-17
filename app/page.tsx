"use client";

import { Profiler, ProfilerOnRenderCallback, useMemo, useState } from "react";
import Button from "@/src/components/Button";
import { geracaoDeDados, Registro } from "@/src/utils/generateData";

export default function Home() {
  const [estrutura, setEstrutura] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [operacao, setOperacao] = useState<string | null>(null);

  const [tempoDeResposta, setTempoDeResposta] = useState<string>("0 ms");
  const [tempoRenderizacaoo, setTempoRenderizacao] = useState<string>("0 ms");
  const [logs, setLogs] = useState<string>("");
  const [resultados, setResultados] = useState<Registro[]>([]);

  const estruturas = ["array", "hashmap", "árvore binária", "árvore avl", "map", "set"];
  const volumes = ["Pequeno | 10k", "Médio | 50k", "Grande | 100k"];
  const operacoes = ["Busca", "Ordenação", "Filtrar"];

  const volumeNumerico = useMemo(() => {
    if (volume?.includes("10k")) return 10000;
    if (volume?.includes("50k")) return 50000;
    if (volume?.includes("100k")) return 100000;
    return 0;
  }, [volume]);

  const dadosMestre = useMemo(() => {
    if (volumeNumerico === 0) return [];
    return geracaoDeDados(volumeNumerico);
  }, [volumeNumerico]);

  const executarBenchmark = () => {
    if (!estrutura || !operacao || volumeNumerico === 0) {
      alert("Selecione estrutura, volume e operação!");
      return;
    }

    const copiaTeste = [...dadosMestre];
    let res: Registro[] = [];
    
    const t0 = performance.now();

    if (estrutura === "array") {
      if (operacao === "Ordenação") {
        res = copiaTeste.sort((a, b) => a.preco - b.preco);
      }
    }

    const t1 = performance.now();
    
    setTempoDeResposta(`${(t1 - t0).toFixed(4)} ms`);
    setResultados(res.slice(0, volumeNumerico));
    setLogs(`Sucesso: ${estrutura} processou ${volumeNumerico} registros em modo ${operacao}.`);
  };

  const renderizacao: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration
  ) => {
    if (phase === "update") {
      setTempoRenderizacao(`${actualDuration.toFixed(4)} ms`);
    }
  };

  const zerarAmbiente = () => {
    setEstrutura(null);
    setVolume(null);
    setOperacao(null);
    setTempoDeResposta("0 ms");
    setTempoRenderizacao("0 ms");
    setLogs("Ambiente reiniciado.");
    setResultados([]);
  };

  return (
    <div className="">
      <div className="bg-[#222222] text-[#ffffff] pt-2 mb-6 p-3">
        <p className="text-[18px] font-semibold">Data Structure Benchmark — MVP</p>
        <p>ambiente de teste * Next.js | TypeScript</p>
      </div>
      <div className="grid grid-cols-2 gap-5 px-5">
        <div>
          <div>
            <p>Estrutura de dados:</p>
            <div className="flex flex-row gap-2">
              {
                estruturas.map((item) => (
                   <Button
                    key={item}
                    nome={item}
                    selecionado={estrutura === item}
                    onClick={() => setEstrutura(item)}
                  />
                ))
              }
            </div>
          </div>
          <div className="pt-4">
            <p>Volume de dados:</p>
            <div className="flex flex-row gap-2">
              {
                volumes.map((item) => (
                   <Button
                    key={item}
                    nome={item}
                    selecionado={volume === item}
                    onClick={() => setVolume(item)}
                  />
                ))
              }
            </div>
          </div>
          <div className="pt-4">
            <p>Operações:</p>
            <div className="flex flex-row gap-3">
              {
                operacoes.map((item) => (
                   <Button
                    key={item}
                    nome={item}
                    selecionado={operacao === item}
                    onClick={() => setOperacao(item)}
                  />
                ))
              }
              <button onClick={executarBenchmark} className="border rounded-sm cursor-pointer p-1 ml-20">Executar</button>
              <button onClick={zerarAmbiente} className="border rounded-sm cursor-pointer p-1 ml-20">Zerar</button>
            </div>
          </div>
        </div>
        
        <div>
          <div>
            <p>Métricas — Última execução:</p>
            <div className="flex flex-row gap-2">
              <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p className="text-sm text-zinc-500">tempo de resposta:</p>
                <p className="text-xl font-bold">{tempoDeResposta}</p>
              </div>
              <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p className="text-sm text-zinc-500">tempo de renderização:</p>
                <p className="text-xl font-bold">{tempoRenderizacaoo}</p>
              </div>
              <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p className="text-sm text-zinc-500">taxa de quadros FPS:</p>
              </div>
            </div>
          </div>
        </div>
      </div>   

      <div className="grid grid-cols-2 pt-10 px-5">
        <div>
          <p className="font-bold mb-2">Lista de Resultado</p>
          <Profiler id="ListaResultados" onRender={renderizacao}>
            <div className="bg-white border rounded-md h-[220px] overflow-y-auto p-2">
              <div className="text-[14px] border-b border-zinc-100 py-1">
                <p>idx | nome | categoria | item | quantidade | preço</p>
              </div>
              {resultados.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum dado processado.</p>
              ) : (
                resultados.map((item) => (
                  <div key={item.idx} className="text-[12px] border-b border-zinc-100 py-1">
                    {item.idx} | {item.nome} | {item.categoria} | {item.quantidade} | R$ {item.preco.toFixed(2)}
                  </div>
                ))
              )}
            </div>
          </Profiler>
        </div>
      </div> 
    </div>
  );
}
