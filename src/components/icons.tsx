export const Logo = (props: React.ComponentProps<'svg'>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
        <title>KalpanaAI Logo</title>
        <path d="M42,50 C42,40 50,32 60,32 C70,32 78,40 78,50 C78,60 70,68 60,68 C55,68 51,65 48,62" stroke="none" fill="currentColor" />
        <path d="M60,32 C58,32 56,33 54,35" strokeWidth="3" strokeLinecap="round" />
        <path d="M50,38 C48,38 46,39 44,41" strokeWidth="3" strokeLinecap="round" />
        <path d="M46,46 C44,46 43,47 42,48" strokeWidth="3" strokeLinecap="round" />

        <path d="M25,90 C15,80 15,65 25,55 C35,45 50,45 60,55" strokeWidth="4" strokeLinecap="round" />
        <path d="M75,90 C85,80 85,65 75,55 C65,45 50,45 40,55" strokeWidth="4" strokeLinecap="round" />

        <path d="M68,25 L70,20 L75,22 L72,27 L77,30 L70,30 L68,35 L65,30 L60,30 L65,27 L62,22 z" fill="currentColor" />
    </svg>
  );