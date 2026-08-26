// Keep in sync with the @media (max-width: 767px) breakpoint in css/main.css.
export function isMobileViewport(width, breakpoint = 768) {
  return width < breakpoint;
}
