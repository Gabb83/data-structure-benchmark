"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, FlaskConical, SquarePercent, Layers, Settings, MemoryStick } from "lucide-react";
import Button from "@/src/components/Button";
import { geracaoDeDados, Registro } from "@/src/utils/generateData";
import { executar } from "@/src/utils/benchmarks";
import Historico from "@/src/components/Historico/Historico";
import ListaResultado from "@/src/components/ListaResultado/ListaResultado";
import Header from "@/src/components/Header";

const GraficoLatencia = dynamic(
  () => import("../src/components/GraficoLatencia/GraficoLatencia"),
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

type Estatisticas = {
  media: string;
  mediana: string;
  desvio: string;
  min: string;
  max: string;
  p99: string;
  p95: string;
  p90: string;
};

const estatisticasInicial: Estatisticas = {
  media: "0.0 ms",
  mediana: "0.0 ms",
  desvio: "0.0 ms",
  min: "0.0 ms",
  max: "0.0 ms",
  p99: "0.0ms",
  p95: "0.0ms",
  p90: "0.0ms",
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
  const [estatisticas, setEstatisticas] = useState<Estatisticas>(estatisticasInicial);
  
  const [memoryHeap, setMemoryHeap] = useState<string>("0.0 KB");
  const [memoryHeapPeak, setMemoryHeapPeak] = useState<string>("0.0 KB");

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

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const obterMemoriaHeap = () => {
    if ("memory" in performance) {
      const memory = (performance as any).memory;

      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }

    return null;
  };

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

  const medirMemoria = (antes: any, depois: any) => {
    if (!antes || !depois) return;

    const delta = depois.used - antes.used;

    setMemoryHeap(formatBytes(delta));
    setMemoryHeapPeak(formatBytes(depois.used));
  };

  const executarBenchmark = () => {
    if (!estrutura || !operacao || volumeNumerico === 0) {
      alert("Selecione estrutura, volume e operação!");
      return;
    }

    if ((operacao === "Busca" || operacao === "Filtro") && termoBusca === "") {
      alert(operacao === "Busca" ? "Digite um idx para buscar!" : "Digite uma categoria para filtrar!");
      return;
    }

    const memoriaAntes = obterMemoriaHeap();
    const copiaTeste = [...dadosMestre];

    const t0 = performance.now();
    const res = executar(estrutura, operacao, copiaTeste, termoBusca);
    const t1 = performance.now();

    const memoriaDepois = obterMemoriaHeap();
    medirMemoria(memoriaAntes, memoriaDepois);

    const latencia = `${(t1 - t0).toFixed(1)} ms`;

    setTempoDeResposta(latencia);
    setTotalResultados(res.length);
    setResultados(res.slice(0, 100));

    setHistorico((prev) => [
      { estrutura: estrutura!, operacao: operacao!, volume: volumeNumerico, latencia, renderizacao: "—" },
      ...prev,
    ].slice(0, 5));
  };

  // --- Benchmark ---
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

    const memoriaAntes = obterMemoriaHeap();

    for (let i = 0; i < 100; i++) {
      const copiaTeste = [...dadosMestre];
      const t0 = performance.now();
      ultimoResultado = executar(estrutura, operacao, copiaTeste, termoBusca);
      const t1 = performance.now();
      medicoes.push(t1 - t0);
    }

    const memoriaDepois = obterMemoriaHeap();
    medirMemoria(memoriaAntes, memoriaDepois);

    const ordenadas = [...medicoes].sort((a, b) => a - b);
    const media = medicoes.reduce((acc, val) => acc + val, 0) / medicoes.length;

    const somaDosQuadrados = medicoes.reduce((acc,val) => {
      return acc + Math.pow(val-media, 2);
    })

    const variancia = somaDosQuadrados/(medicoes.length-1);
    const desvioPadrao = Math.sqrt(variancia);

    const mediana = ordenadas.length % 2 === 0
      ? (ordenadas[ordenadas.length / 2 - 1] + ordenadas[ordenadas.length / 2]) / 2
      : ordenadas[Math.floor(ordenadas.length / 2)];

    const min = ordenadas[0];
    const max = ordenadas[ordenadas.length - 1];

    const calcular99Percentual = (dadosOrdenados: number[], percentil: number) => {
      const index = Math.ceil((percentil / 100) * dadosOrdenados.length) - 1;
      return dadosOrdenados[index];
    };

    const p90 = calcular99Percentual(ordenadas, 90);
    const p95 = calcular99Percentual(ordenadas, 95);
    const p99 = calcular99Percentual(ordenadas, 99);

    console.log(`No pior cenário (P99), a latência foi de ${p99.toFixed(1)} ms`);
    console.log(`No pior cenário (P95), a latência foi de ${p95.toFixed(1)} ms`);
    console.log(`No pior cenário (P90), a latência foi de ${p90.toFixed(1)} ms`);

    const latenciaMedia = `~${media.toFixed(1)} ms`;

    setTempoDeResposta(latenciaMedia);
    setTotalResultados(ultimoResultado.length);
    setResultados(ultimoResultado.slice(0, 100));

    setEstatisticas({
      media: `${media.toFixed(1)} ms`,
      mediana: `${mediana.toFixed(1)} ms`,
      desvio: `${desvioPadrao.toFixed(1)} ms`,
      min: `${min.toFixed(1)} ms`,
      max: `${max.toFixed(1)} ms`,
      p99: `${p99.toFixed(1)} ms`,
      p95: `${p95.toFixed(1)} ms`,
      p90: `${p90.toFixed(1)} ms`,
    });

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
    setEstatisticas(estatisticasInicial);
    isFirstRender.current = true;
    setMemoryHeap("0.0 KB");
    setMemoryHeapPeak("0.0 KB");
  };

  return (
    <div className="bg-[#F9FAFB] pb-5 min-h-screen">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 px-3 md:px-5">
        <div className="lg:col-span-3 bg-white border-none rounded-xl shadow-sm p-5 border border-zinc-100">
          <div className="flex flex-row items-center gap-3 pb-4 mb-4 border-b border-gray-50">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Settings size={20} className="text-gray-600"/>
            </div>
            <h2 className="font-bold text-zinc-800 leading-tight">Configuração de Ambiente</h2>
          </div>
          <div>
            <p className="text-sm border-b-[1.5px] border-zinc-200 mb-3">Estrutura de dados:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {estruturas.map((item) => (
                <Button key={item} nome={item} selecionado={estrutura === item} onClick={() => setEstrutura(item)} />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm border-b-[1.5px] border-zinc-200 mb-3">Volume de dados:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {volumes.map((item) => (
                <Button key={item} nome={item} selecionado={volume === item} onClick={() => setVolume(item)} />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm border-b-[1.5px] border-zinc-200 mb-3">Operações:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {operacoes.map((item) => (
                <Button key={item} nome={item} selecionado={operacao === item} onClick={() => setOperacao(item)} />
              ))}
              <button
                onClick={executarBenchmark}
                className="w-30 h-10 bg-[#00BC7D] text-white flex text-sm flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1 ml-auto"
              >
                <Play size={16} />
                Executar
              </button>
              <button
                onClick={executarTestes}
                className="w-35 h-10 bg-[#6366F1] text-white text-sm flex flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1"
              >
                <FlaskConical size={16} />
                Benchmark
              </button>
              <button
                onClick={zerarAmbiente}
                className="w-30 h-10 bg-[#FC959A] text-white text-sm flex flex-row items-center justify-center gap-2 border border-none rounded-md cursor-pointer p-1"
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
                  className="w-full max-w-72.5 text-sm border border-zinc-300 rounded-md px-3 py-2 mt-4"
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#ffffff] border-none rounded-xl shadow-sm p-5">
          <div className="flex flex-row items-center gap-3 pb-4 mb-4 border-b border-cyan-50">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Layers size={20} className="text-cyan-600"/>
            </div>
            <p className="font-bold text-zinc-800 leading-tight">Métricas – Última Execução</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="bg-zinc-50 flex-1 border border-[#E5E7EB] rounded-lg p-2">
                <p className="text-sm text-zinc-500 pb-2">tempo de resposta:</p>
                <p className="text-md text-zinc-700 font-semibold break-all">{tempoDeResposta}</p>
              </div>
              <div className="bg-zinc-50 flex-1 border border-[#E5E7EB] rounded-lg p-2">
                <p className="text-sm text-zinc-500 pb-2">tempo de renderização:</p>
                <p className="text-md text-zinc-700 font-semibold break-all">{tempoRenderizacao}</p>
              </div>
            </div>
            <div className="bg-zinc-50 w-full h-37.5 border border-[#E5E7EB] rounded-lg p-2">
              <p className="text-sm text-zinc-500 pb-2">taxa de quadros FPS:</p>
              <p className="text-md text-zinc-700 font-semibold">{fps} fps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 pt-5 px-3 md:px-5">
        <ListaResultado 
          resultados={resultados} 
          totalResultados={totalResultados} 
        />

        <Historico 
          historico={historico}
        />
        
        <div className="lg:col-span-2 bg-white border-none rounded-xl shadow-sm p-5 border border-zinc-100">
          {/* Cabeçalho com ícone e título */}
          <div className="flex flex-row items-center gap-3 pb-4 mb-4 border-b border-zinc-50">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <SquarePercent size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-zinc-800 leading-tight">Análise de Percentis</p>
            </div>
          </div>

          {/* Lista de métricas */}
          <div className="space-y-3">
            {/* P99 - Destaque por ser o cenário crítico */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/50">
              <div className="flex flex-col">
                <span className="font-bold text-[#6366F1]">P99</span>
              </div>
              <p className="text-lg font-bold text-[#6366F1] tracking-tight">
                {estatisticas.p99}
              </p>
            </div>

            {/* P95 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex flex-col">
                <span className="font-bold text-zinc-600">P95</span>
              </div>
              <p className="text-base font-semibold text-zinc-800">
                {estatisticas.p95}
              </p>
            </div>

            {/* P90 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex flex-col">
                <span className="font-bold text-zinc-600">P90</span>
              </div>
              <p className="text-base font-semibold text-zinc-800">
                {estatisticas.p90}
              </p>
            </div>
          </div>

          {/* Nota de rodapé explicativa */}
          <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed italic">
            * Indica que X% das execuções foram concluídas dentro deste tempo.
          </p>
        </div>
      </div>


      {dadosGrafico.length > 0 && (
        <div className="px-3 md:px-5 pt-5">
          <GraficoLatencia 
            dados={dadosGrafico} 
            label={labelGrafico} 
            estatisticas={estatisticas} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-5">
            <div className="bg-white p-4 rounded-xl shadow-sm border-none">
              <p className="text-sm text-zinc-500">Heap utilizado</p>
              <div className="flex items-center gap-2 mt-2">
                <MemoryStick size={18} />
                <p className="font-bold">{memoryHeap}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-none">
              <p className="text-sm text-zinc-500">Heap total/pico</p>
              <div className="flex items-center gap-2 mt-2">
                <MemoryStick size={18} />
                <p className="font-bold">{memoryHeapPeak}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}