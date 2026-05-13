import type { SVGProps } from 'react'

export function EmptyRadarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
