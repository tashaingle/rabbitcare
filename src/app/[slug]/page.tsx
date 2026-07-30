import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
  if (slug === "learn-more") {
    return {
      title: "All rabbit care guides & tools",
      description:
        "Browse every RabbitCare.co.uk guide, food article, tool and info page in one place.",
    };
  }
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

  // Interactive React rebuild for the food checker
  if (slug === "can-rabbits-eat-this") {
    return <FoodChecker foods={getFoods()} />;
  }

  // Old WP "Learn More" only linked a handful of pages — replace with full index
  if (slug === "learn-more") {
    redirect("/guides");
  }

  return <WpContent html={page.body} />;
}
