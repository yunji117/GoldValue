interface BadgeProps {
  tone?: "gold" | "mint" | "danger";
  children: React.ReactNode;
}

const toneClassMap = {
  gold: "bg-accent/15 text-accent border-accent/30",
  mint: "bg-mint/15 text-mint border-mint/30",
  danger: "bg-danger/15 text-danger border-danger/30"
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
