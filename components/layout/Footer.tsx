'use client';
import { useGetWebsiteSettingsQuery } from '@/store/api/apiSlice';
import { motion } from "framer-motion";


export function Footer() {
  const { data: settings } = useGetWebsiteSettingsQuery();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-background border-t border-primary/10 text-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className=" mt-1 pt-2 text-center flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">
            {settings?.footerText}
          </p>
          <p className="text-xs text-muted-foreground/70">Made with ❤️ by {settings?.websiteName}</p>
        </div>
      </div>
    </motion.footer>
  );
}