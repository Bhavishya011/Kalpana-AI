export const Logo = (props: React.ComponentProps<'svg'>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      {...props}
    >
      <title>KalpanaAI Logo</title>
      <path d="M30 20V80" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 20L30 50L70 80" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="45" strokeWidth="4" />
      <path d="M50 50 m -10 -10 l 20 20 m 0 -20 l -20 20" strokeWidth="2" />
    </svg>
  );
  