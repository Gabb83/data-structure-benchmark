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
        className={`w-full px-4 py-1.5 rounded-md border cursor-pointer 
        ${selecionado ? "bg-[#353535] text-white" : "bg-zinc-50 text-black hover:bg-zinc-200 transition ease-in-out duration-300"}
      `}
      >
        {nome}
      </button>
    </div>
  );
}