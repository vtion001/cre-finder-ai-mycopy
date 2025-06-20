import CTASection from "@/components/marketing/cta-section";
import FeaturesSection from "@/components/marketing/features-section";
import Footer from "@/components/marketing/footer";
import HeroSection from "@/components/marketing/hero-section";
import HowItWorksSection from "@/components/marketing/how-it-works-section";
import NavBar from "@/components/marketing/nav-bar";
import PricingSection from "@/components/marketing/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import { getUser } from "@v1/supabase/cached-queries";
import { redirect } from "next/navigation";

export const metadata = {
  title: "CREFinderAI",
};

export default async function Marketing() {
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col light">
      <NavBar user={user?.data} />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
