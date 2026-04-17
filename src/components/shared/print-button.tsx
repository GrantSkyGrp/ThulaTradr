"use client";

type PrintButtonProps = {
  label?: string;
};

export function PrintButton({ label = "Print View" }: PrintButtonProps) {
  return (
    <button type="button" className="site-nav__button" onClick={() => window.print()}>
      {label}
    </button>
  );
}
