"use client";
import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import Providers from "@/components/providers/Providers";
import { useGetHomeDataQuery, useGetAboutQuery, useGetSkillsQuery, useGetProjectsQuery, useGetExperienceQuery } from "@/store/api/apiSlice";

function SplashLoader({ children }: { children: React.ReactNode }) {
  const { isLoading: homeLoading } = useGetHomeDataQuery();
  const { isLoading: aboutLoading } = useGetAboutQuery();
  const { isLoading: skillsLoading } = useGetSkillsQuery();
  const { isLoading: projectsLoading } = useGetProjectsQuery({});
  const { isLoading: experienceLoading } = useGetExperienceQuery();

  const total = 5;
  const loaded =
    (!homeLoading ? 1 : 0) +
    (!aboutLoading ? 1 : 0) +
    (!skillsLoading ? 1 : 0) +
    (!projectsLoading ? 1 : 0) +
    (!experienceLoading ? 1 : 0);
  const progress = Math.round((loaded / total) * 100);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setShowSplash(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return showSplash ? (
    <SplashScreen progress={progress} onFinish={() => setShowSplash(false)} />
  ) : (
    <LayoutWrapper>{children}</LayoutWrapper>
  );
}

export default function SplashLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SplashLoader>{children}</SplashLoader>
    </Providers>
  );
} 