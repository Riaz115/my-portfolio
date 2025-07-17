"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetAboutQuery, useUpdateAboutMutation } from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Save,
  Loader2,
  User,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { BulletPointsInput } from "@/components/ui/BulletPointsInput";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function AboutPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: aboutData, isLoading, refetch } = useGetAboutQuery();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    bulletPoints: [""],
    imageFile: null as File | null,
    imagePreview: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (aboutData) {
      setFormData({
        title: aboutData.title || "",
        description: aboutData.description || "",
        details: aboutData.details || "",
        bulletPoints: aboutData.bulletPoints?.length
          ? aboutData.bulletPoints
          : [""],
        imageFile: null,
        imagePreview: aboutData.image || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        details: "",
        bulletPoints: [""],
        imageFile: null,
        imagePreview: "",
      });
    }
  }, [aboutData]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | File[] | null) => {
    let selectedFile: File | null = null;
    if (Array.isArray(file)) {
      selectedFile = file[0] || null;
    } else {
      selectedFile = file;
    }
    setFormData((prev) => ({ ...prev, imageFile: selectedFile }));
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFormData((prev) => ({
        ...prev,
        imagePreview: aboutData?.image || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("details", formData.details);
      formData.bulletPoints.forEach((point) =>
        formDataToSend.append("bulletPoints", point)
      );
      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      } else if (aboutData?.image) {
        formDataToSend.append("image", aboutData.image);
      }
      await updateAbout(formDataToSend).unwrap();
      toast.success("About data updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update about data");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        heading="About Data Managment"
    
      />
      <div className="p-6 max-w-2xl mx-auto">
        <FormWrapper
          onSubmit={handleSubmit}
          loading={isUpdating}
          title="Edit About Data"
        >
          <ImageUpload
            value={formData.imageFile}
            onChange={handleImageChange}
            label="Profile Image"
            previewUrl={formData.imagePreview}
          />
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium text-sm">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Your title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="font-medium text-sm">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Short description about yourself"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="details" className="font-medium text-sm">
              Details
            </label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              placeholder="More about you"
              rows={3}
            />
          </div>
          <BulletPointsInput
            value={formData.bulletPoints}
            onChange={(points) => handleInputChange("bulletPoints", points)}
            label="Bullet Points"
          />
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>Save Changes</>
            )}
          </Button>
        </FormWrapper>
      </div>
    </div>
  );
}
