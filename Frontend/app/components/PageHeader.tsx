type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      <p className="mb-3 text-sm font-medium text-muted">
        {eyebrow}
      </p>

      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
        {description}
      </p>
    </header>
  );
}