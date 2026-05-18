import { ChartNoAxesCombined } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Label } from "recharts";

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
};

type Props = {
  dados: DadoGrafico[];
  estatisticas: Estatisticas;
  label: string;
};

export default function GraficoLatencia({ dados, estatisticas, label }: Props) {

  const mediaNum = parseFloat(estatisticas.media);
  const desvioNum = parseFloat(estatisticas.desvio);

  return (
    <div className="bg-[#ffffff] border-none rounded-xl shadow-sm p-4">
      <div className="flex flex-row flex-wrap items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="p-2 bg-violet-50 rounded-lg">
          <ChartNoAxesCombined size={20} className="text-violet-600" />
        </div>
        <p className="font-bold text-zinc-800 leading-tight">Gráfico de Latência por Execução</p>
        <span className="ml-2 text-[12px] text-zinc-400">{label}</span>
      </div>
      <div className="pt-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dados} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="execucao" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={(v) => `${v}ms`} />
            <Tooltip
              formatter={(value: any) => [`${value} ms`, "latência"]}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <ReferenceLine 
              y={mediaNum} 
              stroke="#6D28D9" 
              strokeDasharray="10 5" 
              strokeWidth={0.6}
            >
              <Label 
                value="Média" 
                position="insideTopRight" 
                fill="#6D28D9" 
                fontSize={9} 
              />
            </ReferenceLine>
            <ReferenceLine 
              y={mediaNum + desvioNum} 
              stroke="#EF4444" 
              strokeDasharray="10 5" 
              strokeOpacity={0.6}
            >
              <Label 
                value="+1 Desvio" 
                position="insideTopRight" 
                fill="#EF4444" 
                fontSize={9} 
              />
            </ReferenceLine>
            <ReferenceLine 
              y={mediaNum - desvioNum} 
              stroke="#EF4444" 
              strokeDasharray="10 5" 
              strokeOpacity={0.6}
            >
              <Label 
                value="-1 Desvio" 
                position="insideTopRight" 
                fill="#EF4444" 
                fontSize={9} 
              />
            </ReferenceLine>
            <Bar dataKey="latencia" fill="#00BC7D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-[10px] text-zinc-400 flex justify-end gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-violet-600 border-dashed border-t"></span> Média: {estatisticas.media}ms
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-red-400 border-dashed border-t"></span> Estabilidade: ±{estatisticas.desvio}ms
          </span>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <div className="bg-zinc-50 flex-1 min-w-30 border-2 border-[#E5E7EB] rounded-md p-2">
          <p className="text-xs text-zinc-500">média</p>
          <p className="text-base text-zinc-700 font-bold">{estatisticas.media}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-30 border-2 border-[#E5E7EB] rounded-md p-2">
          <p className="text-xs text-zinc-500">mediana</p>
          <p className="text-base text-zinc-700 font-bold">{estatisticas.mediana}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-30 border-2 border-[#00afbc] rounded-md p-2">
          <p className="text-xs text-zinc-500">desvio padrão</p>
          <p className="text-base text-[#00afbc] font-bold">{estatisticas.desvio}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-30 border-2 border-[#00BC7D] rounded-md p-2">
          <p className="text-xs text-zinc-500">mínimo</p>
          <p className="text-base text-[#00BC7D] font-bold">{estatisticas.min}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-30 border-2 border-[#FC959A] rounded-md p-2">
          <p className="text-xs text-zinc-500">máximo</p>
          <p className="text-base text-[#FC959A] font-bold">{estatisticas.max}</p>
        </div>
      </div>
    </div>
  );
}