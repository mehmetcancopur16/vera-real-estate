import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-grow items-center justify-center pt-24">{children}</main>
      <Footer />
    </div>
  );
}
