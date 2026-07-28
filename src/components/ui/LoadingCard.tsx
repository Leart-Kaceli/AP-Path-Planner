type LoadingCardProps = {
  heightClassName?: string;
};

export default function LoadingCard({
  heightClassName = "h-64",
}: LoadingCardProps) {
  return (
    <div
  role="status"
  aria-label="Loading"
  className={`${heightClassName} animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800`}
/>
  );
}