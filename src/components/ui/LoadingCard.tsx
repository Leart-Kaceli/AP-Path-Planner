type LoadingCardProps = {
  heightClassName?: string;
};

export default function LoadingCard({
  heightClassName = "h-64",
}: LoadingCardProps) {
  return (
    <div
      className={`${heightClassName} animate-pulse rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800`}
      aria-hidden="true"
    />
  );
}