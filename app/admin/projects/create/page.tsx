"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateProjectMutation } from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import SuccessModal from "@/components/ui/SuccessModal";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function CreateProjectPage() {
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    category: "Web Development",
    demoUrl: "",
    codeUrl: "",
    featured: false,
    images: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);

  const categories = [
    "Web Development",
    "Mobile Development",
    "Desktop Application",
    "API Development",
    "UI/UX Design",
    "Other",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (files: File[] | File | null) => {
    let filesArr: File[] = [];
    if (Array.isArray(files)) {
      filesArr = files;
    } else if (files) {
      filesArr = [files];
    }
    setFormData((prev) => ({ ...prev, images: filesArr }));
    // Preview
    const previews = filesArr.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(idx, 1);
      return { ...prev, images: newImages };
    });
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(idx, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("technologies", formData.technologies); // must be comma-separated string
      formDataToSend.append("category", formData.category);
      formDataToSend.append("demoUrl", formData.demoUrl);
      formDataToSend.append("codeUrl", formData.codeUrl);
      formDataToSend.append("featured", String(formData.featured));
      formData.images.forEach((img) => formDataToSend.append("images", img));
      await createProject(formDataToSend).unwrap();
      setSuccessOpen(true);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create project");
    }
  };

  return (
    <div>
      <AdminHeader
        heading="Create New Project"
      
      />
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl mt-10 mb-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Create New Project
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-2 block text-base font-medium">
              Project Images
            </Label>
            <ImageUpload
              value={formData.images}
              onChange={handleImagesChange}
              label="Upload Images"
              previewUrl={previewImages}
              multiple
              onRemove={handleRemoveImage}
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can upload multiple images.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) =>
                handleInputChange("technologies", e.target.value)
              }
              required
            />
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              value={formData.demoUrl}
              onChange={(e) => handleInputChange("demoUrl", e.target.value)}
              placeholder="https://yourproject.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeUrl">Code URL</Label>
            <Input
              id="codeUrl"
              value={formData.codeUrl}
              onChange={(e) => handleInputChange("codeUrl", e.target.value)}
              placeholder="https://github.com/yourrepo"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange("featured", e.target.checked)}
              className="rounded border border-input focus:ring-2 focus:ring-primary/50"
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>
          <Button
            type="submit"
            className="w-full text-base py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Project</>
            )}
          </Button>
        </form>
        <SuccessModal
          open={successOpen}
          onClose={() => {
            setSuccessOpen(false);
            router.push("/admin/projects");
          }}
          message="Project created successfully!"
        />
      </div>
    </div>
  );
}
