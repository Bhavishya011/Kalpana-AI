import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HeritagePageContent } from "@/components/heritage/heritage-page-content";

interface PageProps {
  params: {
    heritage_id: string;
  };
}

// This would typically fetch from Firestore
async function getHeritageData(heritage_id: string) {
  try {
    // TODO: Implement Firestore fetching
    // For now, return placeholder
    return {
      heritage_id,
      exists: false
    };
  } catch (error) {
    return null;
  }
}

export default async function HeritagePage({ params }: PageProps) {
  const heritage_id = params.heritage_id;
  
  if (!heritage_id || !heritage_id.startsWith("CDN-")) {
    notFound();
  }

  const heritageData = await getHeritageData(heritage_id);

  if (!heritageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading heritage...</div>}>
        <HeritagePageContent heritage_id={heritage_id} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const heritage_id = params.heritage_id;
  
  return {
    title: `Craft Heritage - ${heritage_id} | KalpanaAI`,
    description: "Discover the cultural authenticity, origin story, and sustainability impact of this artisan craft",
    openGraph: {
      title: `Craft Heritage - ${heritage_id}`,
      description: "Discover the story behind this handcrafted treasure",
      images: ["/og-heritage.png"],
    },
  };
}
