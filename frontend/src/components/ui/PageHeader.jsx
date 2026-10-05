export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">{title}</h1>
        {description && <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
