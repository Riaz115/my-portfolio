'use client';

import { useGetExperienceQuery } from '@/store/api/apiSlice';
import { PageLoader } from '@/components/ui/loader';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { motion } from "framer-motion";

export function ExperienceSection() {
  const { data: experiences = [], isLoading } = useGetExperienceQuery();

  if (isLoading) return <PageLoader />;

  return (
    <motion.section
      initial={{ rotateY: -90, opacity: 0 }}
      whileInView={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      style={{ perspective: 1000 }}
      className="your-section-classes"
    >
      <div className="max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>
            Work Experience
          </h2>
          <div className="w-32 h-1 mx-auto text-gradient rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></div>
          
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col lg:flex-row">
          {/* Vertical timeline line (only on large screens) */}
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-primary/30 via-accent/30 to-secondary/30 rounded-full z-0" style={{ transform: 'translateX(-50%)' }}></div>
            {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline line (only on md and up) */}
          <div className="hidden md:block absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-px"></div>

          <div className="space-y-12">
            {experiences?.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } animate-fade-in`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Timeline marker (only on md and up) */}
                <div className="hidden md:block absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-2 md:-translate-x-2 z-10"></div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ml-0 md:ml-0`}>
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-heading font-semibold text-card-foreground">
                            {experience?.title}
                          </h3>
                          <h4 className="text-lg font-body font-medium text-primary">
                            {experience?.company}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                         
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-body">{experience?.location}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground font-body leading-relaxed">
                          {experience?.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {experience?.technologies?.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience data available.</p>
          </div>
        )}
      </div>
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </motion.section>
  );
}