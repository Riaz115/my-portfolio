"use client";
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin } from 'lucide-react';
import { useGetHomeDataQuery } from '@/store/api/apiSlice';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

export function HeroSection() {
  const { data: homeData, isLoading } = useGetHomeDataQuery();
  const data = homeData || {
    name: 'John Doe',
    title: 'Full Stack Developer',
    description: 'Passionate about building modern web apps.',
    cvUrl: '#',
    githubUrl: 'https://github.com/',
    linkedinUrl: 'https://linkedin.com/',
    profileImage: '',
  };

  const handleButton = (type: 'cv' | 'github' | 'linkedin') => {
    if (type === 'cv') {
      if (!data.cvUrl || data.cvUrl === '#') {
        toast.error('CV not provided');
      } else {
        window.open(data.cvUrl, '_blank');
      }
    } else if (type === 'github') {
      if (!data.githubUrl || data.githubUrl === '#') {
        toast.error('GitHub link not provided');
      } else {
        window.open(data.githubUrl, '_blank');
      }
    } else if (type === 'linkedin') {
      if (!data.linkedinUrl || data.linkedinUrl === '#') {
        toast.error('LinkedIn link not provided');
      } else {
        window.open(data.linkedinUrl, '_blank');
      }
    }
  };

  if (isLoading) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 pt-20 pb-10"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row gap-12 items-center">
        <div className="flex flex-col items-center lg:items-start gap-6 animate-fade-in-left w-full lg:w-3/5">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium font-body">
              👋 Welcome to my portfolio
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-center lg:text-left">
            Hi, I'm{' '}
            <span className="text-gradient">
              {data?.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-body text-center lg:text-left">
            {data?.title}
          </p>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-lg text-center lg:text-left">
            {data?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start w-full">
            <Button
              size="lg"
              className="group font-bold text-base px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              onClick={() => handleButton('cv')}
              type="button"
            >
              <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              View Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-base px-8 py-3 border-indigo-400 text-indigo-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 hover:text-white"
              style={{ fontFamily: 'Roboto Mono, monospace' }}
              onClick={() => handleButton('github')}
              type="button"
            >
              <span className="mr-2"> <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg></span>
              GitHub
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-base px-8 py-3 border-blue-400 text-blue-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 hover:text-white"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              onClick={() => handleButton('linkedin')}
              type="button"
            >
              <span className="mr-2"> <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg></span>
              LinkedIn
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-in animation-delay-300 w-full lg:w-2/5 flex justify-center items-center mb-8 lg:mb-0">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl transform -rotate-3"></div>
            {/* Main image container */}
            <div className="relative bg-card rounded-3xl p-7 shadow-xl flex justify-center items-center">
              {/* Animated circle at top-right of outer box */}
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-20 h-20 bg-primary/10 rounded-full animate-bounce-gentle pointer-events-none"></div>
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <img
                    src={data?.profileImage}
                    alt={data?.name}
                    className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl border-4 border-primary/30 animate-image-pop"
                    style={{ boxShadow: '0 12px 48px 0 rgba(99,102,241,0.25), 0 1.5px 6px 0 rgba(0,0,0,0.10)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <style jsx global>{`
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes image-pop {
          0% { transform: scale(0.8) rotate(-6deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-right { animation: fade-in-right 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-image-pop { animation: image-pop 1.1s cubic-bezier(.4,0,.2,1) both; }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
      `}</style>
    </motion.section>
  );
}