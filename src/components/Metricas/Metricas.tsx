import { Layers } from "lucide-react";

type MetricasProps = {
  tempoDeResposta: string;
  tempoDeRenderizacao: string;
  fps: number;
}

export default function Metricas({
  tempoDeResposta, tempoDeRenderizacao, fps
}: MetricasProps) {
  return(
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
            <p className="text-md text-zinc-700 font-semibold break-all">{tempoDeRenderizacao}</p>
          </div>
        </div>
        <div className="bg-zinc-50 w-full h-37.5 border border-[#E5E7EB] rounded-lg p-2">
          <p className="text-sm text-zinc-500 pb-2">taxa de quadros FPS:</p>
          <p className="text-md text-zinc-700 font-semibold">{fps} fps</p>
        </div>
      </div>
    </div>
  );
}