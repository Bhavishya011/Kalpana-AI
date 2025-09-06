export function LoadingKolam({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center w-20 h-20 ${className}`}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        className="animate-spin-slow"
      >
        <path
          d="M50 0, 75 25, 50 50, 25 25z M50 100, 75 75, 50 50, 25 75z M0 50, 25 75, 50 50, 25 25z M100 50, 75 25, 50 50, 75 75z"
          className="fill-primary/50"
        />
      </svg>
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        className="absolute animate-spin-slow-reverse"
      >
        <path
          d="M50,10 a 40,40 0 1,0 0,80 a 40,40 0 1,0 0,-80"
          className="stroke-accent"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    </div>
  );
}
