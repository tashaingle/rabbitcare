import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoodChecker } from "@/components/FoodChecker";
import { WpContent } from "@/components/WpContent";
import { getAllPages, getFoods, getPage } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  // Interactive React rebuild for the food checker (cleaner + works without WP scripts)
  if (slug === "can-rabbits-eat-this") {
    return <FoodChecker foods={getFoods()} />;
  }

  return <WpContent html={page.body} />;
}
