'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateContactMutation, useGetWebsiteSettingsQuery } from '@/store/api/apiSlice';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SuccessModal from '@/components/ui/SuccessModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Github, Linkedin, Facebook, YoutubeIcon } from 'lucide-react';
import { motion } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactSection({ id }: { id?: string }) {
  const [createContact, { isLoading }] = useCreateContactMutation();
  const { data: settings } = useGetWebsiteSettingsQuery();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Prefill name/email if user is logged in, on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }
  }, [isAuthenticated, user, setValue]);

  const onSubmit = async (data: ContactForm) => {
    try {
      await createContact(data).unwrap();
      setSuccessMessage('Message sent successfully!');
      setSuccessOpen(true);
      reset({
        name: isAuthenticated && user?.name ? user.name : '',
        email: isAuthenticated && user?.email ? user.email : '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <motion.section
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="pb-20 pt-10 bg-white dark:bg-[#0f172a] transition-colors duration-300"
      id={id}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gradient Heading */}
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 capitalize text-gradient" style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', fontWeight: 700 }}>
            Get In Touch
          </h2>
          <div className="w-32 h-1 mx-auto text-gradient rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}></div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col justify-center bg-card/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl border border-border p-8 min-h-[480px]"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-primary">Your Name</label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="John Doe"
                    className={`rounded-lg border border-input px-4 py-3 focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-primary">Your Email</label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className={`rounded-lg border border-input px-4 py-3 focus:ring-2 focus:ring-primary/50 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-primary">Subject</label>
                <Input
                  id="subject"
                  {...register('subject')}
                  placeholder="Project Inquiry"
                  className={`rounded-lg border border-input px-4 py-3 focus:ring-2 focus:ring-primary/50 ${errors.subject ? 'border-red-500' : ''}`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-primary">Your Message</label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="I'd like to discuss a project..."
                  rows={6}
                  className={`rounded-lg border border-input px-4 py-3 focus:ring-2 focus:ring-primary/50 ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full md:w-auto mt-4 font-semibold text-base py-3 rounded-lg bg-gradient-to-r from-primary to-blue-500 shadow-lg hover:from-blue-500 hover:to-primary transition-all duration-200 flex items-center justify-center gap-2" size="lg" disabled={isLoading}>
                <Send className="h-5 w-5" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col justify-center bg-card/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl border border-border p-8 min-h-[480px]"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gradient">Contact Information</h3>
                <div className="flex flex-col gap-10">
                  {settings?.email && (
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-sm font-semibold text-muted-foreground mb-1">Email</span>
                      <div className="flex items-center gap-4">
                        <Mail className="h-7 w-7 text-primary" />
                        <span className="font-semibold text-lg">{settings.email}</span>
                      </div>
                    </div>
                  )}
                  {settings?.contactNumber && (
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-sm font-semibold text-muted-foreground mb-1">Phone</span>
                      <div className="flex items-center gap-4">
                        <Phone className="h-7 w-7 text-primary" />
                        <span className="font-semibold text-lg">{settings.contactNumber}</span>
                      </div>
                    </div>
                  )}
                  {settings?.address && (
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-sm font-semibold text-muted-foreground mb-1">Location</span>
                      <div className="flex items-center gap-4">
                        <MapPin className="h-7 w-7 text-primary" />
                        <span className="font-semibold text-lg">{settings.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-10 flex flex-col items-start">
                <p className="font-semibold mb-3 text-primary">Connect With Me</p>
                <div className="flex gap-4 mt-2">
                  {settings?.socialLinks?.github && (
                    <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full p-2 bg-gradient-to-r from-primary to-blue-500 hover:scale-110 transition-transform">
                      <Github className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {settings?.socialLinks?.linkedin && (
                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full p-2 bg-gradient-to-r from-primary to-blue-500 hover:scale-110 transition-transform">
                      <Linkedin className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {settings?.socialLinks?.facebook && (
                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full p-2 bg-gradient-to-r from-primary to-blue-500 hover:scale-110 transition-transform">
                      <Facebook className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {settings?.socialLinks?.youtube && (
                    <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full p-2 bg-gradient-to-r from-primary to-blue-500 hover:scale-110 transition-transform">
                      <YoutubeIcon className="h-5 w-5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={successMessage}
      />
    </motion.section>
  );
}