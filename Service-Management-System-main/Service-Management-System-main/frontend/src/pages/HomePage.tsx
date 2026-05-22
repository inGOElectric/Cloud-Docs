import { useEffect } from "react";
import ResponsiveHeader from "../components/home/ResponsiveHeader";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import Footer from "../components/home/Footer";

export default function HomePage() {

  useEffect(() => {
    // Clear staff/customer login when returning to home
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <ResponsiveHeader />

      {/* Main content */}
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}