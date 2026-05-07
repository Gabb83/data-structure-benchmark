export default function Header() {
  return(
    <header className="bg-[#ffffff] px-5 py-3.25 flex items-center gap-3.5 shadow-sm mb-5">
      <div className="flex items-center gap-1.75">
        <span className="w-2.75 h-2.75 rounded-full bg-[#e24b4a] inline-block" />
        <span className="w-2.75 h-2.75 rounded-full bg-[#ef9f27] inline-block" />
        <span className="w-2.75 h-2.75 rounded-full bg-[#41a4c2] inline-block" />
      </div>

      <div className="w-px h-5.5 bg-[#333330] shrink-0" />

      <div className="flex flex-col gap-0.5">
        <p className="m-0 text-[13px] font-mono text-[#c0dd97] tracking-[0.01em]">
          ~/<span className="text-[#419c7e]">data-structure-benchmark</span>
        </p>
        <p className="m-0 text-[11px] font-mono text-[#5f5e5a] tracking-[0.01em]">
          <span className="text-[#888780]">next.js</span>
          {" · "}
          <span className="text-[#888780]">typescript</span>
          {" · ambiente de teste"}
        </p>
      </div>
 
      <div className="ml-auto hidden md:flex items-center gap-2">
        <span className="text-[11px] font-mono font-medium px-2.5 py-0.75 rounded bg-[rgba(29,158,117,0.15)] text-[#549982] border border-[rgba(93,202,165,0.3)]">
          ● live
        </span>
        <span className="text-[11px] font-mono font-medium px-2.5 py-0.75 rounded bg-[rgba(131,124,221,0.15)] text-[#706c9c] border border-[rgba(131,124,221,0.3)]">
          MVP
        </span>
      </div>
    </header>
  );
}