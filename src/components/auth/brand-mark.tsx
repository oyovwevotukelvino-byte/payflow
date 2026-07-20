// components/auth/brand-mark.tsx

/**
 * The one signature element for the auth experience — a compact
 * bubble-with-checkmark lockup, standing in for illustration/gradient
 * decoration that the brief explicitly rules out. Appears identically
 * on all three auth pages via AuthHeader.
 */
export function BrandMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H11l-4.5 4V21H8a4 4 0 0 1-4-4V8Z"
        fill="var(--pf-brand)"
      />
      <path
        d="M9.5 13.2 12.3 16l6.2-6.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}