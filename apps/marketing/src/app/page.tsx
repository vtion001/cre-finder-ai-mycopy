import CTASection from "@/components/cta-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import NavBar from "@/components/nav-bar";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import { getAssetTypes, getUser } from "@v1/supabase/cached-queries";

export const metadata = {
  title: "CREFinderAI",
};

export default async function Marketing() {
  const { data: assetTypes } = await getAssetTypes();

  return (
    <div className="min-h-screen flex flex-col light">
      <NavBar />
      <main className="flex-grow">
        <HeroSection assetTypes={assetTypes || []} />
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
