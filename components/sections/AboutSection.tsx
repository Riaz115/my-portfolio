'use client';

import { useGetAboutQuery } from '@/store/api/apiSlice';
import { PageLoader } from '@/components/ui/loader';
import { useEffect, useRef } from 'react';
import { motion } from "framer-motion";

export function AboutSection({ id }: { id?: string }) {
  const { data: aboutData, isLoading } = useGetAboutQuery();


  if (isLoading) return <PageLoader />;

  

 

  return (
    <motion.section
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="pt-10 pb-20 bg-muted/20"
      id={id}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 capitalize text-gradient" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>
            {aboutData?.title || 'About Me'}
          </h2>
          <div className="w-32 h-1 mx-auto text-gradient rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image - Home style, responsive center on small screens */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full flex justify-center lg:justify-start items-center mb-8 lg:mb-0 pl-0 lg:pl-4"
          >
            <div className="relative">
              {/* Background decorations */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl transform -rotate-3"></div>
              {/* Main image container */}
              <div className="relative bg-card rounded-3xl p-7 shadow-xl flex justify-center items-center">
                {/* Animated circle at top-right of outer box */}
                <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-20 h-20 bg-primary/10 rounded-full animate-bounce-gentle pointer-events-none"></div>
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <img
                      src={aboutData?.image}
                      alt="About"
                      className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl border-4 border-primary/30 animate-image-pop"
                      style={{ boxShadow: '0 12px 48px 0 rgba(99,102,241,0.25), 0 1.5px 6px 0 rgba(0,0,0,0.10)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 flex flex-col justify-center h-full text-left"
            style={{ fontWeight: 200, fontFamily: 'Montserrat, Inter, Poppins, sans-serif' }}
          >
            <p className="text-sm text-foreground leading-relaxed capitalize">
              {aboutData?.description}
            </p>
            <p className="text-sm text-foreground leading-relaxed capitalize">
              {aboutData?.details}
            </p>

            {/* Bullet Points */}
            {aboutData?.bulletPoints && aboutData?.bulletPoints?.length > 0 && (
              <ul className="space-y-3 mt-6">
                {aboutData?.bulletPoints?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full text-gradient flex-shrink-0" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></span>
                    <span className="capitalize text-sm text-foreground" style={{ fontWeight: 200, fontFamily: 'Montserrat, Inter, Poppins, sans-serif' }}>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;700&family=Inter:wght@200;400;700&family=Poppins:wght@200;700&display=swap');
        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes image-pop {
          0% { transform: scale(0.8) rotate(-6deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-image-pop { animation: image-pop 1.1s cubic-bezier(.4,0,.2,1) both; }
        .animate-bounce-gentle { animation: bounce-gentle 2.5s ease-in-out infinite; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </motion.section>
  );
}