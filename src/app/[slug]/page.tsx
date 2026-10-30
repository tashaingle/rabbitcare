import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LivePage } from "@/components/LivePage";
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
  const page = getLivePage(slug);
  if (!page) return {};
  const title = decodeEntities(page.title);
  const description = decodeEntities(page.description) || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}/` },
    openGraph: { title, description, url: `/${slug}/` },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const page = getLivePage(slug);
  if (!page) notFound();
  return <LivePage page={page} />;
}
