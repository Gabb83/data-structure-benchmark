type ButtonProps = {
  nome: string;
  selecionado?: boolean;
  onClick?: () => void;
}

export default function Button({
  nome, selecionado, onClick
}: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`px-3 py-1 rounded-md border cursor-pointer
        ${selecionado ? "bg-[#222222] text-white" : "bg-zinc-50 text-black"}
      `}
      >
        {nome}
      </button>
    </div>
  );
}