export default function SettingsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
        {title}
      </h2>
      <p className="text-[0.9rem] text-start mb-2">{description}</p>
    </div>
  );
}
