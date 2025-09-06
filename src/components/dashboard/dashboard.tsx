"use client";

import { useState } from "react";
import { ArtisanCircle } from "./artisan-circle";
import { DashboardHeader } from "./header";
import { DashboardLayout } from "./layout";
import { MarketPulse } from "./market-pulse";
import { StoryStudio } from "./story-studio";
import { TheMuse } from "./the-muse";

export function Dashboard() {
  const [language, setLanguage] = useState("en-US");

  return (
    <DashboardLayout>
      <DashboardHeader language={language} setLanguage={setLanguage} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
          <div className="flex flex-col gap-6 xl:gap-8">
            <MarketPulse />
            <ArtisanCircle />
          </div>
          <div className="flex flex-col gap-6 xl:gap-8">
            <StoryStudio language={language} />
            <TheMuse />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
