'use client';

import { useGetSkillsQuery } from '@/store/api/apiSlice';
import { PageLoader } from '@/components/ui/loader';
import { Progress } from '@/components/ui/progress';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const SkillBar = ({ percent }: { percent: number }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ width: `${percent}%` });
    }
  }, [controls, inView, percent]);

  return (
    <div ref={ref} className="bg-[#1a1a1a] h-2 rounded-full w-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={controls}
        transition={{ duration: 1.2 }}
        className="h-2 rounded-full"
        style={{ background: '#64FFDA' }}
      />
    </div>
  );
};

export function SkillsSection({ id }: { id?: string }){
  const { data: skills = [], isLoading } = useGetSkillsQuery();

  if (isLoading) return (
    <section className="min-h-[80vh] flex items-center justify-center bg-muted/20" id={id}>
      <PageLoader />
    </section>
  );

  const categories = [
    'frontend', 'frontend-libraries', 'backend', 'database', 'tools', 'deployment', 'designing', 'social-media-marketing'
  ];
  
  const getCategorySkills = (category: string) => 
    skills.filter((skill: any) => skill.category === category);

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      frontend: 'Frontend',
      'frontend-libraries': 'Front End Libraries',
      backend: 'Backend',
      database: 'Database',
      tools: 'Tools',
      deployment: 'Deployment',
      designing: 'Designing',
      'social-media-marketing': 'Social Media Marketing',
    };
    return titles[category] || category;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-10"
      id={id}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>Skills & Expertise</h2>
          <div className="w-32 h-1 mx-auto text-gradient rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></div>
         
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {categories.map((category, idx) => {
              const categorySkills = getCategorySkills(category);
              if (categorySkills.length === 0) return null;

              // Unique gradient for each category circle
              const gradients = [
                'from-primary via-accent to-secondary', // Frontend
                'from-green-400 via-emerald-500 to-teal-400', // Backend
                'from-pink-500 via-fuchsia-500 to-purple-500', // Database
                'from-yellow-400 via-orange-400 to-red-400', // Tools
                'from-blue-400 via-cyan-400 to-sky-400', // Deployment
              ];
              const gradient = gradients[idx % gradients.length];
              const firstLetter = getCategoryTitle(category).charAt(0).toUpperCase();

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl border border-zinc-800/40 shadow-xl p-8 flex flex-col items-center"
                >
                  {/* Gradient Circle and Category Title */}
                  <div className="flex flex-col items-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                      {firstLetter}
                    </div>
                    <h3 className="text-2xl font-bold text-gradient mb-1" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>{getCategoryTitle(category)}</h3>
                  </div>
                  {/* Skills List */}
                  <div className="w-full space-y-5">
                    {categorySkills.map((skill: any) => (
                      <div key={skill._id}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white text-base">{skill.name}</h4>
                          <span className="text-sm text-muted-foreground font-medium">{skill.percentage}%</span>
                        </div>
                        <SkillBar percent={skill.percentage} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .progress-bar-fill {
          background: #64FFDA;
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </motion.section>
  );
}