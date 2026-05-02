import { Clock } from "lucide-react";

type ItemHistorico = {
  estrutura: string;
  operacao: string;
  volume: number;
  latencia: string;
  renderizacao: string;
}

type PropsHistorico = {
  historico: ItemHistorico[];
}

export default function Historico({ historico }: PropsHistorico) {
  return(
    <div className="lg:col-span-2 bg-[#ffffff] border-none rounded-md shadow-md p-2">
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
  );
}