import { FaCircle } from "react-icons/fa6";

export default function StatusBadge({ label }: { label: string }) {
  return (
    <span className="text-sm py-2 px-4 bg-chart-1 flex items-center justify-start gap-2 rounded-full">
      <FaCircle className="text-chart-2" size={9} />
      {label}
    </span>
  );
}
