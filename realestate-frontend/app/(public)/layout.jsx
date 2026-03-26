import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
