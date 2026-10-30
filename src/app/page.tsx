import type { Metadata } from "next";
import { Binky } from "@/components/home/Binky";
import { DayCycle } from "@/components/home/DayCycle";
import { FoodStamp, type Food } from "@/components/home/FoodStamp";
import { Hero } from "@/components/home/Hero";
import { Lineup } from "@/components/home/Lineup";
import { Thump } from "@/components/home/Thump";
import s from "@/components/home/home.module.css";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import { getFoods } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "RabbitCare.co.uk | Practical Rabbit Care Advice for UK Owners" },
  description:
    "Practical rabbit care advice for UK owners: feeding, housing, behaviour, safe foods, health warning signs and when to call a vet.",
};

export default function HomePage() {
  const foods: Food[] = getFoods();
  return (
    <div className={`home ${s.home}`}>
      <SiteNav />
      <main>
        <Hero />
        <Binky />
        <DayCycle />
        <FoodStamp foods={foods} />
        <Thump />
        <Lineup />
      </main>
      <Footer />
    </div>
  );
}
