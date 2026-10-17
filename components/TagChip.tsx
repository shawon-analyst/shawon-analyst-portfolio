export default function TagChip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={
        tone === "accent"
          ? "inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]"
          : "chip"
      }
    >
      {children}
    </span>
  );
}
