import { cn } from "@/lib/utils";

export const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M72.5833 2.08331C66.8249 8.15681 64.931 17.513 67.5749 25.8333C70.2188 34.1536 77.108 40.5401 85.4167 43.1666C86.5364 43.5284 87.6837 43.8344 88.8541 44.0833L55.9167 77.0208C49.8432 71.2624 40.487 69.3685 32.1667 71.9949C23.8463 74.6214 17.4599 81.5106 14.8333 89.8333C14.4715 90.953 14.1655 92.0948 13.9167 93.25L13.8125 93.75L6.25 93.75L6.25 86.1666L22.9792 69.4375L27.0208 73.4791L30.5625 70L27.9792 67.4166L32.5833 62.8125L36.8125 67.0416L40.0208 63.8333L36.1875 60L40.7917 55.3958L44.5833 59.1875L47.7917 55.9791L43.75 51.9375L50 45.6875L54.3125 50L57.5208 46.7916L53.2083 42.4791L60.0833 35.6041L63.875 39.3958L67.0833 36.1875L62.8542 31.9583L72.5833 22.2083L72.5833 2.08331Z" fill="url(#paint0_linear_801_3)"/>
    <defs>
      <linearGradient id="paint0_linear_801_3" x1="13.8125" y1="93.75" x2="88.8541" y2="44.0833" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24"/>
        <stop offset="1" stopColor="#F97316"/>
      </linearGradient>
    </defs>
  </svg>
);

export const Instagram = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("w-4 h-4", className)}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Twitter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Youtube = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
    <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 6.2,18.84 5.17,18.56C4.27,18.31 3.69,17.73 3.44,16.83C3.31,16.36 3.22,15.73 3.16,14.93C3.09,14.13 3.06,13.44 3.06,12.84L3,12C3,9.81 3.16,8.2 3.44,7.17C3.69,6.27 4.27,5.69 5.17,5.44C5.64,5.31 6.5,5.22 7.82,5.16C9.12,5.09 10.31,5.06 11.41,5.06L12,5C16.19,5 17.8,5.16 18.83,5.44C19.73,5.69 20.31,6.27 20.56,7.17Z"></path>
  </svg>
);

export const Tiktok = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
    <path d="M16.6 5.82s.08.02.12.02c.04 0 .08-.02.12-.02V8.4l-1.84.44s-.06.02-.09.02c-1.3.02-2.58-1.03-2.58-2.28V1.34s-.02-.02-.02-.02c-.05 0-.09.02-.13.02s-.08-.02-.12-.02v11.52s.06.02.09.02c2.18.02 3.96-1.74 3.96-3.9v-2.2c0-.04.02-.08.02-.12z"></path>
    <path d="M12.55 1.05V14.5c0 2.89-2.35 5.24-5.24 5.24s-5.24-2.35-5.24-5.24c0-2.53 1.8-4.62 4.15-5.11V1.05c-3.86.53-6.94 3.83-6.94 7.74 0 4.34 3.53 7.87 7.87 7.87s7.87-3.53 7.87-7.87V1.05s-.02-.02-.02-.02z"></path>
  </svg>
);

export const Facebook = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.64 10 6.7v2.8H7v4h3V22h4z" />
  </svg>
);

export const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
    <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.5 1.5 4S2.5 1.5 4 1.5 6.5 2.5 6.5 4 5.5 6.5 4 6.5zm11.5 6c-1.2 0-2 .7-2.3 1.3V12h-5v9.5h5V16c0-1.7.9-3.5 3-3.5s2.5 1.8 2.5 3.5V21.5h5V15c0-4-2.5-6.5-6.2-6.5z" />
  </svg>
);
