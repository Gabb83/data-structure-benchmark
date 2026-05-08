import { SquarePercent } from "lucide-react";

type EstatisticasProps = {
  p99: string;
  p95: string;
  p90: string;
};

type Props = {
  estatisticas: EstatisticasProps;
};

export default function AnalisePercentis({estatisticas} : Props) {
  return (
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
  );
}
