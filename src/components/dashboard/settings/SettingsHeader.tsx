export default function SettingsHeader({
  title,
  description,
  smaller = false,
  noDescription = false,
}: {
  title: string;
  description: string;
  smaller?: boolean;
  noDescription?: boolean;
}) {
  return (
    <div>
      <h2
        className={` font-light tracking-tight text-balance text-muted-foreground mb-2 text-start ${
          smaller ? "text-2xl" : "text-3xl"
        }`}
      >
        {title}
      </h2>
      {!noDescription && (
        <p className="text-[0.9rem] text-start mb-2">{description}</p>
      )}
    </div>
  );
}
