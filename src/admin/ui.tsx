import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const cls = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-[#b8956e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a6845d] disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50",
  input:
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-[#b8956e] focus:ring-2 focus:ring-[#b8956e]/20",
  label: "block text-xs font-medium uppercase tracking-wide text-neutral-500 mb-1.5",
  card: "rounded-lg border border-neutral-200 bg-white shadow-sm",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return <button className={`${cls[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${cls.input} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${cls.input} ${className}`} {...props} />;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={cls.label}>{label}</span>
      {children}
    </label>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
