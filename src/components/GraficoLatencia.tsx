import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type DadoGrafico = {
  execucao: string;
  latencia: number;
};

type Props = {
  dados: DadoGrafico[];
  label: string;
};

export default function GraficoLatencia({ dados, label }: Props) {
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
    </div>
  );
}