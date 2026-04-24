import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type DadoGrafico = {
  execucao: string;
  latencia: number;
};

type Estatisticas = {
  media: string;
  mediana: string;
  min: string;
  max: string;
};

type Props = {
  dados: DadoGrafico[];
  estatisticas: Estatisticas;
  label: string;
};

export default function GraficoLatencia({ dados, estatisticas, label }: Props) {
  return (
    <div className="bg-[#ffffff] border-none rounded-md shadow-md p-4">
      <div className="flex flex-row flex-wrap items-center gap-3 pb-4 border-b border-zinc-100">
        <p className="font-bold">Latência por execução</p>
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
            <Bar dataKey="latencia" fill="#00BC7D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <div className="bg-zinc-50 flex-1 min-w-[120px] border border-[2px] border-[#E5E7EB] rounded-md p-2">
          <p className="text-xs text-zinc-500">média</p>
          <p className="text-base text-zinc-700 font-bold">{estatisticas.media}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-[120px] border border-[2px] border-[#E5E7EB] rounded-md p-2">
          <p className="text-xs text-zinc-500">mediana</p>
          <p className="text-base text-zinc-700 font-bold">{estatisticas.mediana}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-[120px] border border-[2px] border-[#00BC7D] rounded-md p-2">
          <p className="text-xs text-zinc-500">mínimo</p>
          <p className="text-base text-[#00BC7D] font-bold">{estatisticas.min}</p>
        </div>
        <div className="bg-zinc-50 flex-1 min-w-[120px] border border-[2px] border-[#FC959A] rounded-md p-2">
          <p className="text-xs text-zinc-500">máximo</p>
          <p className="text-base text-[#FC959A] font-bold">{estatisticas.max}</p>
        </div>
      </div>
    </div>
  );
}