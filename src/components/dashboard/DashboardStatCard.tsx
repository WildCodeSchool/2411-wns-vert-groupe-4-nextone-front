export default function DashboardStatCard({
  title,
  value,
  fullWidth = false,
}: {
  title: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <h3 className="text-1xl font-light text-muted-foreground flex flex-col items-start justify-start">
        {title}
      </h3>
      <p className="text-4xl font-light text-balance">{value}</p>
    </div>
  );
}
