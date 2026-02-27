import React from "react";

export function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        className
      )}
      {...props}
    />
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base =
    "h-11 px-4 rounded-[12px] text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-[rgb(var(--text))] text-[rgb(var(--bg))] hover:opacity-90"
      : variant === "danger"
      ? "bg-[rgb(var(--danger))] text-white hover:opacity-90"
      : "bg-transparent text-[rgb(var(--text))] hover:bg-white/5 border border-[rgb(var(--border))]";
  return <button className={cn(base, styles, className)} {...props} />;
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[14px] border border-[rgb(var(--border))] bg-black/20 px-4 text-[rgb(var(--text))] placeholder:text-white/35 outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-xs text-white/45", className)} {...props} />;
}