import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Binky } from "@/components/home/Binky";
import { DayCycle } from "@/components/home/DayCycle";
import { FoodStamp, type Food } from "@/components/home/FoodStamp";
import { Hero } from "@/components/home/Hero";
import { Lineup } from "@/components/home/Lineup";
import { Thump } from "@/components/home/Thump";
import s from "@/components/home/home.module.css";
import { getFoods } from "@/lib/content";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "RabbitCare.co.uk | Practical Rabbit Care Advice for UK Owners" },
  description:
    "Practical rabbit care advice for UK owners: feeding, housing, behaviour, safe foods, health warning signs and when to call a vet.",
};

export default function HomePage() {
  const foods: Food[] = getFoods();
  return (
    <div className={`home wp-site-blocks ${display.variable} ${serif.variable} ${s.home}`}>
      <div className={s.headerOverlay}>
        <SiteHeader />
      </div>
      <main>
        <Hero />
        <Binky />
        <DayCycle />
        <FoodStamp foods={foods} />
        <Thump />
        <Lineup />
      </main>
      <SiteFooter />
    </div>
  );
}
