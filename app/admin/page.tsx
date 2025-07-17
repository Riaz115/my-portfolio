'use client';

import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, MessageSquare, FolderOpen, Briefcase } from 'lucide-react';
import { useGetSkillsQuery, useGetContactsQuery, useGetProjectsQuery, useGetExperienceQuery } from '@/store/api/apiSlice';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: skills } = useGetSkillsQuery();
  const { data: contacts } = useGetContactsQuery();
  const { data: projects } = useGetProjectsQuery({ page: 1, limit: 1000 });
  const { data: experiences } = useGetExperienceQuery();

  const stats = [
    {
      title: 'Skills',
      value: skills?.length ?? 0,
      icon: Award,
      link: '/admin/skills',
      linkLabel: 'View Skills',
    },
    {
      title: 'Contacts',
      value: contacts?.length ?? 0,
      icon: MessageSquare,
      link: '/admin/contacts',
      linkLabel: 'View Contacts',
    },
    {
      title: 'Projects',
      value: projects?.projects?.length ?? 0,
      icon: FolderOpen,
      link: '/admin/projects',
      linkLabel: 'View Projects',
    },
    {
      title: 'Experiences',
      value: experiences?.length ?? 0,
      icon: Briefcase,
      link: '/admin/experience',
      linkLabel: 'View Experiences',
    },
  ];

  return (
    <div>
      <AdminHeader heading="Admin Dashboard"  />
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
              <Card
                key={index}
                className="w-full h-40 flex flex-col justify-between rounded-xl border shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-semibold mb-1">{stat.title}</CardTitle>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Link
                    href={stat.link}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    {stat.linkLabel}
                  </Link>
                </div>
              </Card>
            );
          })}
            </div>
      </div>
    </div>
  );
}