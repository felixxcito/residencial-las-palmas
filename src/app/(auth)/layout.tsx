export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--primary)_0%,_transparent_45%)] opacity-[0.08]" />
      {children}
    </div>
  );
}
