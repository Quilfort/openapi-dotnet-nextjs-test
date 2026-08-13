import Link from "next/link";

type EditButtonProps = {
  href: string;
};

export default function EditButton({
  href,
}: EditButtonProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
    >
      Bewerken
    </Link>
  );
}