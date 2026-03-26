interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
}

export const SectionTitle = ({
  eyebrow,
  title,
  description
}: SectionTitleProps) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/90">
        {eyebrow}
      </p>
      <div className="space-y-3">
        <h2 className="font-display text-4xl leading-none text-white md:text-5xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-white/68 md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};
