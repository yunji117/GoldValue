interface BadgeProps {
  tone?: "gold" | "mint" | "danger";
  children: React.ReactNode;
}

const toneClassMap = {
  gold: "border-accent/30 bg-accent/10 text-accent",
  mint: "border-mint/30 bg-mint/10 text-mint",
  danger: "border-danger/30 bg-danger/10 text-danger"
};

export const Badge = ({ tone = "gold", children }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${toneClassMap[tone]}`}
    >
      {children}
    </span>
  );
};
