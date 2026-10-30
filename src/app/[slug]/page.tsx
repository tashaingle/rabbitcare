import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/guides/Article";
import { LivePage } from "@/components/LivePage";
import { NewOwner, newOwnerMetadata } from "@/components/guides/NewOwner";
import { getArticle, isBoilerplate } from "@/lib/article";
import { decodeEntities, getLivePage, getLiveSlugs } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLiveSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new-rabbit-owner-information") return newOwnerMetadata;
  const page = getLivePage(slug);
  if (!page) return {};
  const title = decodeEntities(page.title);
  const article = getArticle(slug);
  const stored = decodeEntities(page.description);
  const description =
    article && (!stored || isBoilerplate(stored))
      ? article.summary || article.lede || undefined
      : stored || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}/` },
    openGraph: { title, description, url: `/${slug}/` },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "new-rabbit-owner-information") return <NewOwner />;
  const page = getLivePage(slug);
  if (!page) notFound();
  const article = getArticle(slug);
  if (!article) return <LivePage page={page} />;
  return <Article article={article} />;
}
