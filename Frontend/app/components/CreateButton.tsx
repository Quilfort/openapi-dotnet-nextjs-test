import Link from "next/link";

type CreateButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function CreateButton({
  href,
  children,
}: CreateButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-slate-300 hover:bg-background dark:hover:border-slate-700"
    >
      <span className="text-lg leading-none">+</span>
      <span>{children}</span>
    </Link>
  );
}