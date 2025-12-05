import { FaCircle } from "react-icons/fa6";

export default function StatusBadge({ label }: { label: string }) {
  const spanCSSClass =
    label === "Fluide"
      ? "bg-[#EAF6EB]"
      : label === "Chargé"
      ? "bg-[#FFFAE7]"
      : "bg-[#FBEBEC]";

  const circleCSSClass =
    label === "Fluide"
      ? "text-[#5AB06D]"
      : label === "Chargé"
      ? "text-[#FAD972]"
      : "text-[#DE6A77]";

  return (
    <span
      className={`text-sm py-2 px-4 flex items-center justify-start gap-2 rounded-full ${spanCSSClass}`}
    >
      <FaCircle className={circleCSSClass} size={9} />
      {label}
    </span>
  );
}
