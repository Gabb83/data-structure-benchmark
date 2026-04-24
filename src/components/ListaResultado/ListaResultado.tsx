import { ChartBar } from "lucide-react";
import { Registro } from "@/src/utils/generateData";

type PropsLista = {
  resultados: Registro[];
  totalResultados: number
}

export default function ListaResultado({resultados, totalResultados}: PropsLista) {
  return(
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
  );
}