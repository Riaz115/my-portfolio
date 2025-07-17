'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import { RootState } from '@/store/store';
import { toast } from '@/hooks/use-toast';
import { useUpdateProfileMutation, useGetProfileQuery } from '@/store/api/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import SuccessModal from '@/components/ui/SuccessModal';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const { data: profile, refetch } = useGetProfileQuery();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email });
      // Update Redux user state with latest profile
      if (token) {
        dispatch(setCredentials({ user: profile, token }));
      }
    }
  }, [profile, dispatch, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      await updateProfile(formData).unwrap();
      await refetch(); // Refetch profile after update
      setShowSuccess(true);
      // toast('Profile updated successfully!');
    } catch (err: any) {
      toast(err?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSuccess && (
        <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} message="Profile updated successfully!" />
      )}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 w-full max-w-md space-y-6 border border-zinc-200 dark:border-zinc-800"
        >
          <h1 className="text-2xl font-bold text-center mb-2">Update Profile</h1>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </>
  );
} 