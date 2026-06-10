"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BackgroundBlobs } from "@/components/ui/BackgroundBlobs";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBlobs />
      <Navbar />
      <HeroSection />
    </div>
  );
}
