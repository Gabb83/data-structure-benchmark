"use client";

import { useState } from "react";
import Button from "@/src/components/Button";

export default function Home() {
  const [estrutura, setEstrutura] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [operacao, setOperacao] = useState<string | null>(null);

  const estruturas = ["array", "hashmap", "árvore binária", "árvore avl", "map", "set"];
  const volumes = ["Pequeno | 10k", "Médio | 50k", "Grande | 100k"];
  const operacoes = ["Busca", "Ordenação", "Filtrar"];

  return (
    <div>
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
            <button className="border rounded-sm cursor-pointer p-1 ml-20">Executar</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p>Métricas — Última execução:</p>
            <div className="flex flex-row gap-2">
              <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p>tempo de resposta:</p>
              </div>
               <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p>tempo de renderização:</p>
              </div>
               <div className="bg-zinc-50 w-[250px] h-[150px] border rounded-md p-1">
                <p>taxa de quadros FPS:</p>
              </div>
            </div>
          </div>
        </div>
      </div>   

      <div className="grid grid-cols-2 pt-10 px-5">
        <div>
          <p>Lista de Resultado</p>
        </div>
        <div>
          <p>Logs de Execução</p>
           <div className="bg-zinc-100 w-full h-[120px] border rounded-md p-3">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pulvinar arcu eget purus viverra pellentesque. Sed et consequat risus, eget gravida lectus. Nulla mattis pellentesque aliquet.</p>
          </div>
          <div className="flex flex-row gap-10 py-4">
            <p>Estrutura: </p>
            <p>Volume: </p>
            <p>Repetições: </p>
          </div>
        </div>
      </div>   
    </div>
  );
}
