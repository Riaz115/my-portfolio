'use client';

import { useState, useEffect } from 'react';
import { useGetProjectsQuery } from '@/store/api/apiSlice';
import { PageLoader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { motion } from "framer-motion";

function ProjectCard({ project, reverse = false }: { project: any; reverse?: boolean }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = project.images || [];
  const techs = project.technologies || project.techStack || [];

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Responsive: always column on small, alternate row/reverse on md+
  const flexDirection = reverse ? 'md:flex-row-reverse' : 'md:flex-row';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`relative flex flex-col ${flexDirection} items-stretch gap-6 md:gap-8 py-6 md:py-10`}
      style={{ minHeight: '300px' }}
    >
      {/* Card background with glassmorphism and gradient border */}
      <div className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-transparent group-hover:border-primary/40 transition-all duration-300" style={{ filter: 'blur(2px)' }} />
      {/* Main Card Content */}
      <div className={`relative z-10 flex flex-col w-full rounded-3xl overflow-hidden shadow-2xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border border-primary/10 group hover:scale-[1.015] hover:shadow-3xl transition-all duration-300 ${flexDirection}`}>
            {/* Image Section */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          whileInView={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-full md:w-1/2 aspect-[16/11] flex items-center justify-center bg-card overflow-hidden"
          style={{ minHeight: '220px' }}
        >
              {images.length > 0 ? (
                <img
                  src={images[currentImage]}
                  alt={project.name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 rounded-3xl ${reverse ? 'md:rounded-none md:rounded-r-3xl' : 'md:rounded-none md:rounded-l-3xl'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-3xl font-bold text-primary">
                    {project.name.charAt(0)}
                  </span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow-lg transition-colors z-10"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow-lg transition-colors z-10"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_: any, idx: number) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full border-2 ${idx === currentImage ? 'bg-primary border-primary' : 'bg-white/70 border-primary/40'} transition-all`}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Featured badge */}
              {project.featured && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 animate-fade-in">
                  Featured
                </span>
              )}
        </motion.div>
            {/* Divider for desktop */}
            <div className="hidden md:block w-1 bg-gradient-to-b from-primary/10 to-accent/10 my-8 rounded-full" />
            {/* Text Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col justify-center items-start h-full px-5 py-6 md:py-0"
          style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}
        >
              <h3
                className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1"
                style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '0.01em' }}
              >
                {project.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 leading-relaxed max-w-2xl" style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
                {project.description}
              </p>
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 animate-fade-in-up">
                  {techs.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-medium rounded text-xs border border-primary/10 animate-fade-in-up"
                      style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', animationDelay: `${0.05 * idx}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-1">
                {project.demoUrl && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold shadow hover:from-accent hover:to-primary transition-colors px-4 py-1 text-xs"
                    onClick={() => window.open(project.demoUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Demo
                  </Button>
                )}
                {project.codeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors shadow px-4 py-1 text-xs"
                    onClick={() => window.open(project.codeUrl, '_blank')}
                  >
                    <Github className="h-4 w-4 mr-1" /> Code
                  </Button>
                )}
              </div>
        </motion.div>
      </div>
      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading } = useGetProjectsQuery({ page, limit: 10 });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (data) {
      setProjects(prev => {
        const newProjects = (data.projects || []).filter(
          (p: any) => !prev.some((old: any) => old._id === p._id)
        );
        return [...prev, ...newProjects];
      });
      setHasMore(data.hasMore);
      setLoadingMore(false);
    }
  }, [data]);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  if (isLoading) return (
    <section className="min-h-[80vh] flex items-center justify-center bg-muted/20" id="projects">
      <PageLoader />
    </section>
  );
  return (
    <section id="projects" className="py-10 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 capitalize text-gradient" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>
            Featured Projects
          </h2>
          <div className="w-32 h-1 mx-auto text-gradient rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></div>
        </div>
        <div className="flex flex-col gap-6">
          {projects.map((project: any, idx: number) => (
            <ProjectCard key={project._id} project={project} reverse={idx % 2 === 1} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              disabled={loadingMore}
              className={
                'relative font-semibold px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ' +
                'hover:from-accent hover:to-primary ' +
                (loadingMore ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105')
              }
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}
            >
              {loadingMore ? (
                <>
                  <Loader size="sm" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                'Show More'
              )}
            </Button>
          </div>
        )}
        {projects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available.</p>
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
    </section>
  );
}