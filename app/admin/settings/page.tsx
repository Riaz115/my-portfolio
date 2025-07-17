"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Save,
  Loader2,
  Settings,
  Globe,
  Palette,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: settings, isLoading, refetch } = useGetWebsiteSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateWebsiteSettingsMutation();

  const [formData, setFormData] = useState({
    websiteName: "",
    websiteDescription: "",
    logo: null as File | null,
    favicon: null as File | null,
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    email: "",
    contactNumber: "",
    address: "",
    footerText: "",
    socialLinks: {
      github: "",
      linkedin: "",
      facebook: "",
      youtube: "",
    },
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  // Initialize form data when settings loads
  useState(() => {
    if (settings) {
      setFormData({
        websiteName: settings.websiteName || "",
        websiteDescription: settings.websiteDescription || "",
        logo: null,
        favicon: null,
        primaryColor: settings.primaryColor || "#3b82f6",
        secondaryColor: settings.secondaryColor || "#1e40af",
        email: settings.email || "",
        contactNumber: settings.contactNumber || "",
        address: settings.address || "",
        footerText: settings.footerText || "",
        socialLinks: {
          github: settings.socialLinks?.github || "",
          linkedin: settings.socialLinks?.linkedin || "",
          facebook: settings.socialLinks?.facebook || "",
          youtube: settings.socialLinks?.youtube || "",
        },
        seo: {
          title: settings.seo?.title || "",
          description: settings.seo?.description || "",
          keywords: settings.seo?.keywords || "",
        },
      });
    }
  });

  const getImagePreviewUrl = (field: "logo" | "favicon") => {
    if (formData[field]) {
      return URL.createObjectURL(formData[field] as File);
    }
    if (settings && settings[field]) {
      return settings[field];
    }
    return undefined;
  };

  const handleImageUpload = (field: "logo" | "favicon", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSEOChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Basic settings
      formDataToSend.append("websiteName", formData.websiteName);
      formDataToSend.append("websiteDescription", formData.websiteDescription);
      formDataToSend.append("primaryColor", formData.primaryColor);
      formDataToSend.append("secondaryColor", formData.secondaryColor);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.contactNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("footerText", formData.footerText);

      // Images
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }
      if (formData.favicon) {
        formDataToSend.append("favicon", formData.favicon);
      }

      // Social links
      formDataToSend.append(
        "socialLinks",
        JSON.stringify(formData.socialLinks)
      );

      // SEO
      formDataToSend.append("seo", JSON.stringify(formData.seo));

      await updateSettings(formDataToSend).unwrap();
      toast.success("Settings updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update settings");
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
        heading="Website Setting"
    
      />
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="bg-primary/5 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="h-6 w-6 text-primary" />
              Edit Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Basic Info
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="websiteName">Website Name</Label>
                    <Input
                      id="websiteName"
                      value={formData.websiteName}
                      onChange={(e) =>
                        handleInputChange("websiteName", e.target.value)
                      }
                      placeholder="Your Portfolio"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteDescription">
                      Website Description
                    </Label>
                    <Textarea
                      id="websiteDescription"
                      value={formData.websiteDescription}
                      onChange={(e) =>
                        handleInputChange("websiteDescription", e.target.value)
                      }
                      placeholder="Brief description of your portfolio"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              {/* Footer Text */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Footer
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Input
                      id="footerText"
                      value={formData.footerText}
                      onChange={(e) =>
                        handleInputChange("footerText", e.target.value)
                      }
                      placeholder="© 2024 All rights reserved"
                    />
                  </div>
                </div>
              </div>
              {/* Logo & Favicon */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Branding
                </h2>
                <div className="space-y-2 flex flex-col items-center">
                
                    <ImageUpload
                      value={formData.favicon}
                      onChange={(file) =>
                        handleImageUpload("favicon", file as File)
                      }
                      previewUrl={getImagePreviewUrl("favicon")}
                      label="Upload Favicon"
                      className="w-20 h-20"
                    />
                  </div>
              </div>
             
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Contact Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Your address"
                    rows={2}
                  />
                </div>
              </div>
              {/* Social Links */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Social Links
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        handleSocialLinkChange("github", e.target.value)
                      }
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.socialLinks.facebook}
                      onChange={(e) =>
                        handleSocialLinkChange("facebook", e.target.value)
                      }
                      placeholder="Facebook profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.socialLinks.youtube}
                      onChange={(e) =>
                        handleSocialLinkChange("youtube", e.target.value)
                      }
                      placeholder="YouTube channel URL"
                    />
                  </div>
                </div>
              </div>
              {/* SEO Settings */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  SEO Settings
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seo.title}
                      onChange={(e) => handleSEOChange("title", e.target.value)}
                      placeholder="Your Name - Portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seo.description}
                      onChange={(e) =>
                        handleSEOChange("description", e.target.value)
                      }
                      placeholder="Professional portfolio description for search engines"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                      id="seoKeywords"
                      value={formData.seo.keywords}
                      onChange={(e) =>
                        handleSEOChange("keywords", e.target.value)
                      }
                      placeholder="portfolio, developer, web design, react, nodejs"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
