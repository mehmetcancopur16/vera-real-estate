export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">Dashboard Header</header>
      <div className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border border-border p-4">Sidebar</aside>
        <main className="rounded-lg border border-border p-4">{children}</main>
      </div>
    </div>
  );
}
