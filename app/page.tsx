"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChartBar, Play, RotateCcw, Clock, FlaskConical } from "lucide-react";
import Button from "@/src/components/Button";
import { geracaoDeDados, Registro } from "@/src/utils/generateData";
import { executar } from "@/src/utils/benchmarks";

const GraficoLatencia = dynamic(
  () => import("../src/components/GraficoLatencia"),
  { ssr: false }
);

type Historico = {
  estrutura: string;
  operacao: string;
  volume: number;
  latencia: string;
  renderizacao: string;
};

type DadoGrafico = {
  execucao: string;
  latencia: number;
};

export default function Home() {
  const [estrutura, setEstrutura] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [operacao, setOperacao] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState<string>("");

  const [tempoDeResposta, setTempoDeResposta] = useState<string>("0.0 ms");
  const [tempoRenderizacao, setTempoRenderizacao] = useState<string>("0.0 ms");
  const [resultados, setResultados] = useState<Registro[]>([]);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<DadoGrafico[]>([]);
  const [labelGrafico, setLabelGrafico] = useState<string>("");
  const [fps, setFps] = useState<number>(0);

  const framesRef = useRef<number>(0);
  const ultimoTempoFps = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  // --- FPS ---
  useEffect(() => {
    let animationId: number;

    const calcularFps = () => {
      const agora = performance.now();
      framesRef.current++;

      if (agora - ultimoTempoFps.current >= 1000) {
        setFps(framesRef.current);
        framesRef.current = 0;
        ultimoTempoFps.current = agora;
      }

      animationId = requestAnimationFrame(calcularFps);
    };

    animationId = requestAnimationFrame(calcularFps);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // --- Tempo de renderização ---
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (resultados.length === 0) return;

    const t0 = performance.now();

    return () => {
      const tempo = performance.now() - t0;
      const tempoFormatado = `${tempo.toFixed(1)} ms`;

      setTempoRenderizacao(tempoFormatado);
      setHistorico((prev) => {
        if (prev.length === 0) return prev;
        const [ultima, ...resto] = prev;
        return [{ ...ultima, renderizacao: tempoFormatado }, ...resto];
      });
    };
  }, [resultados]);

  const estruturas = ["Array", "Hashmap", "Árvore Binária", "Árvore AVL", "Map", "Set"];
  const volumes = ["Pequeno | 10k", "Médio | 50k", "Grande | 100k"];
  const operacoes = ["Busca", "Ordenação", "Filtro"];

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

    if ((operacao === "Busca" || operacao === "Filtro") && termoBusca === "") {
      alert(operacao === "Busca" ? "Digite um idx para buscar!" : "Digite uma categoria para filtrar!");
      return;
    }

    const copiaTeste = [...dadosMestre];

    const t0 = performance.now();
    const res = executar(estrutura, operacao, copiaTeste, termoBusca);
    const t1 = performance.now();

    const latencia = `${(t1 - t0).toFixed(1)} ms`;

    setTempoDeResposta(latencia);
    setTotalResultados(res.length);
    setResultados(res.slice(0, 100));

    setHistorico((prev) => [
      { estrutura: estrutura!, operacao: operacao!, volume: volumeNumerico, latencia, renderizacao: "—" },
      ...prev,
    ].slice(0, 5));
  };

  // --- 5x Benchmark ---
  const executarTestes = () => {
    if (!estrutura || !operacao || volumeNumerico === 0) {
      alert("Selecione estrutura, volume e operação!");
      return;
    }

    if ((operacao === "Busca" || operacao === "Filtro") && termoBusca === "") {
      alert(operacao === "Busca" ? "Digite um idx para buscar!" : "Digite uma categoria para filtrar!");
      return;
    }

    const medicoes: number[] = [];
    let ultimoResultado: Registro[] = [];

    for (let i = 0; i < 100; i++) {
      const copiaTeste = [...dadosMestre];
      const t0 = performance.now();
      ultimoResultado = executar(estrutura, operacao, copiaTeste, termoBusca);
      const t1 = performance.now();
      medicoes.push(t1 - t0);
    }

    const media = medicoes.reduce((acc, val) => acc + val, 0) / medicoes.length;
    const latenciaMedia = `~${media.toFixed(1)} ms`;

    setTempoDeResposta(latenciaMedia);
    setTotalResultados(ultimoResultado.length);
    setResultados(ultimoResultado.slice(0, 100));

    const dados: DadoGrafico[] = medicoes.map((m, i) => ({
      execucao: `${i + 1}`,
      latencia: parseFloat(m.toFixed(1)),
    }));

    setDadosGrafico(dados);
    setLabelGrafico(`${estrutura} | ${operacao} | ${(volumeNumerico / 1000).toFixed(0)}k`);

    setHistorico((prev) => [
      { estrutura: estrutura!, operacao: operacao!, volume: volumeNumerico, latencia: latenciaMedia, renderizacao: "—" },
      ...prev,
    ].slice(0, 5));
  };

  const zerarAmbiente = () => {
    setEstrutura(null);
    setVolume(null);
    setOperacao(null);
    setTempoDeResposta("0.0 ms");
    setTempoRenderizacao("0.0 ms");
    setResultados([]);
    setTotalResultados(0);
    setHistorico([]);
    setTermoBusca("");
    setDadosGrafico([]);
    setLabelGrafico("");
    isFirstRender.current = true;
  };

  return (
    <div className="bg-[#F9FAFB] pb-5 min-h-screen">
      <div className="bg-[#222222] text-[#ffffff] pt-2 mb-6 p-3">
        <p className="text-[18px] font-semibold">Data Structure Benchmark — MVP</p>
        <p className="text-sm">ambiente de teste • Next.js | TypeScript</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-3 md:px-5">
        <div>
          <div>
            <p className="border-b-[1.5px] border-zinc-200 mb-3">Estrutura de dados:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {estruturas.map((item) => (
                <Button key={item} nome={item} selecionado={estrutura === item} onClick={() => setEstrutura(item)} />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="border-b-[1.5px] border-zinc-200 mb-3">Volume de dados:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {volumes.map((item) => (
                <Button key={item} nome={item} selecionado={volume === item} onClick={() => setVolume(item)} />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="border-b-[1.5px] border-zinc-200 mb-3">Operações:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {operacoes.map((item) => (
                <Button key={item} nome={item} selecionado={operacao === item} onClick={() => setOperacao(item)} />
              ))}
              <button
                onClick={executarBenchmark}
                className="w-[120px] h-[40px] bg-[#00BC7D] text-white flex flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1 ml-auto"
              >
                <Play size={16} />
                Executar
              </button>
              <button
                onClick={executarTestes}
                className="w-[140px] h-[40px] bg-[#6366F1] text-white flex flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1"
              >
                <FlaskConical size={16} />
                Benchmark
              </button>
              <button
                onClick={zerarAmbiente}
                className="w-[120px] h-[40px] bg-[#FC959A] text-white flex flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1"
              >
                <RotateCcw size={16} />
                Zerar
              </button>
            </div>
            <div>
              {(operacao === "Busca" || operacao === "Filtro") && (
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executarBenchmark()}
                  placeholder={operacao === "Busca" ? "Digite o idx para buscar..." : "Digite a categoria para filtragem..."}
                  className="w-full max-w-[290px] text-sm border border-zinc-300 rounded-md px-3 py-2 mt-4"
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] border-none rounded-md shadow-md p-3">
          <p className="text-zinc-700 font-semibold mb-2">Métricas — Última execução:</p>
          <div className="flex flex-row flex-wrap gap-2">
            <div className="bg-zinc-50 flex-1 min-w-[140px] h-[150px] border border-[2px] border-[#E5E7EB] rounded-md p-1">
              <p className="text-sm text-zinc-500">tempo de resposta:</p>
              <p className="text-lg text-zinc-700 font-bold break-all">{tempoDeResposta}</p>
            </div>
            <div className="bg-zinc-50 flex-1 min-w-[140px] h-[150px] border border-[2px] border-[#E5E7EB] rounded-md p-1">
              <p className="text-sm text-zinc-500">tempo de renderização:</p>
              <p className="text-lg text-zinc-700 font-bold break-all">{tempoRenderizacao}</p>
            </div>
            <div className="bg-zinc-50 flex-1 min-w-[140px] h-[150px] border border-[2px] border-[#E5E7EB] rounded-md p-1">
              <p className="text-sm text-zinc-500">taxa de quadros FPS:</p>
              <p className="text-lg text-zinc-700 font-bold">{fps} fps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pt-10 px-3 md:px-5">
        <div className="h-full lg:col-span-2 bg-[#ffffff] border-none rounded-md shadow-md p-2">
          <div className="flex flex-row items-center gap-3 pb-2">
            <ChartBar />
            <p className="font-bold">Lista de resultado</p>
            {totalResultados > 0 && (
              <span className="ml-auto text-[11px] text-zinc-400">
                exibindo {Math.min(100, totalResultados)} de {totalResultados} registros
              </span>
            )}
          </div>

          <div className="h-[220px] bg-zinc-50 border border-[#E5E7EB] rounded-md overflow-y-auto p-2">
            <div className="text-[14px] border-b border-zinc-100 py-1">
              <p>idx | nome | categoria | quantidade | preço</p>
            </div>
            {resultados.length === 0 ? (
              <p className="text-gray-400 text-sm mt-2">Nenhum dado processado.</p>
            ) : (
              resultados.map((item) => (
                <div key={item.idx} className="text-[12px] border-b border-zinc-100 py-1">
                  {item.idx} | {item.nome} | {item.categoria} | {item.quantidade} | R$ {item.preco.toFixed(2)}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-[#ffffff] border-none rounded-md shadow-md p-2">
          <div className="flex flex-row items-center gap-3 pb-2 border-b border-zinc-100">
            <Clock size={18} />
            <p className="font-bold">Histórico de execuções</p>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            {historico.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhuma execução ainda.</p>
            ) : (
              historico.map((h, i) => (
                <div
                  key={i}
                  className={`text-[12px] rounded-md p-2 border ${
                    i === 0 ? "border-[#00BC7D] bg-green-50" : "border-zinc-100 bg-zinc-50"
                  }`}
                >
                  <div className="flex flex-row flex-wrap items-center gap-2">
                    <span className="text-zinc-400 font-mono">#{i + 1}</span>
                    <span className="font-semibold text-zinc-700">{h.estrutura}</span>
                    <span className="text-zinc-400">|</span>
                    <span className="text-zinc-600">{h.operacao}</span>
                    <span className="text-zinc-400">|</span>
                    <span className="text-zinc-600">{(h.volume / 1000).toFixed(0)}k volume</span>
                    {i === 0 && (
                      <span className="ml-auto text-[10px] text-[#00BC7D] font-semibold">
                        mais recente
                      </span>
                    )}
                  </div>
                  <div className="flex flex-row flex-wrap gap-4 mt-1 text-zinc-500">
                    <span>latência: <span className="font-semibold text-zinc-700">{h.latencia}</span></span>
                    <span>render: <span className="font-semibold text-zinc-700">{h.renderizacao}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {dadosGrafico.length > 0 && (
        <div className="px-3 md:px-5 pt-5">
          <GraficoLatencia dados={dadosGrafico} label={labelGrafico} />
        </div>
      )}
    </div>
  );
}