"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetHomeDataQuery,
  useUpdateHomeDataMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import { Loader2, User, Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function HomeDataPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: homeData, isLoading, refetch } = useGetHomeDataQuery();
  const [updateHomeData, { isLoading: isUpdating }] =
    useUpdateHomeDataMutation();
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    cvUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    profileImage: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (homeData) {
      setFormData({
        name: homeData.name || "",
        title: homeData.title || "",
        description: homeData.description || "",
        cvUrl: homeData.cvUrl || "",
        githubUrl: homeData.githubUrl || "",
        linkedinUrl: homeData.linkedinUrl || "",
        profileImage: null,
      });
      setPreviewImage(homeData.profileImage || null);
    } else {
      setFormData({
        name: "",
        title: "",
        description: "",
        cvUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        profileImage: null,
      });
      setPreviewImage(null);
    }
  }, [homeData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    const input = document.getElementById("profileImageInput");
    if (input) (input as HTMLInputElement).click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData.profileImage) {
          formDataToSend.append("profileImage", formData.profileImage);
        } else if (key !== "profileImage") {
          formDataToSend.append(
            key,
            formData[key as keyof typeof formData] as string
          );
        }
      });
      // Always send the old image URL if it exists
      if (homeData?.profileImage) {
        formDataToSend.append("oldProfileImage", homeData.profileImage);
      }
      await updateHomeData(formDataToSend).unwrap();
      toast.success("Home data updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update home data");
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
        heading="Home Data Managment"
    
      />
      <div className="p-6 max-w-2xl mx-auto">
       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Home Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Replace the custom image upload UI with the shared ImageUpload component */}
              <ImageUpload
                value={formData.profileImage}
                onChange={(file) => {
                  let selectedFile: File | null = null;
                  if (Array.isArray(file)) {
                    selectedFile = file[0] || null;
                  } else {
                    selectedFile = file;
                  }
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: selectedFile,
                  }));
                  if (selectedFile) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setPreviewImage(ev.target?.result as string);
                    };
                    reader.readAsDataURL(selectedFile);
                  } else {
                    setPreviewImage(homeData?.profileImage || null);
                  }
                }}
                label="Profile Image"
                previewUrl={previewImage}
              />
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Short description about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvUrl">CV URL</Label>
                <Input
                  id="cvUrl"
                  value={formData.cvUrl}
                  onChange={(e) => handleInputChange("cvUrl", e.target.value)}
                  placeholder="Link to your CV (Google Drive, etc.)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
