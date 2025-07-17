"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/store/api/apiSlice";
import { Loader2, X, CheckCircle2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import SuccessModal from "@/components/ui/SuccessModal";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const { data: project, isLoading } = useGetProjectByIdQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    category: "Web Development",
    demoUrl: "",
    codeUrl: "",
    featured: false,
    images: [] as (string | File)[],
    previewImages: [] as string[],
  });
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && project) {
      setFormData({
        name: project.name,
        description: project.description,
        technologies: (project.technologies || []).join(", "),
        category: project.category,
        demoUrl: project.demoUrl || "",
        codeUrl: project.codeUrl || "",
        featured: project.featured,
        images: project.images,
        previewImages: project.images,
      });
    }
  }, [isLoading, project]);

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
    setFormData((prev) => {
      // Only keep string URLs that are still in previewImages
      const keptUrls = prev.previewImages.filter(
        (url) => typeof url === "string"
      );
      return {
        ...prev,
        images: [...keptUrls, ...filesArr],
        previewImages: [
          ...keptUrls,
          ...filesArr.map((file) => URL.createObjectURL(file)),
        ],
      };
    });
  };

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.previewImages];
      newImages.splice(idx, 1);
      newPreviews.splice(idx, 1);
      return { ...prev, images: newImages, previewImages: newPreviews };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", projectId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("technologies", formData.technologies);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("demoUrl", formData.demoUrl);
      formDataToSend.append("codeUrl", formData.codeUrl);
      formDataToSend.append("featured", String(formData.featured));
      formDataToSend.append(
        "oldImages",
        JSON.stringify(formData.images.filter((img) => typeof img === "string"))
      );
      formData.images.forEach((img) => {
        if (img instanceof File) formDataToSend.append("images", img);
      });
      await updateProject({ id: projectId, data: formDataToSend }).unwrap();
      setSuccessOpen(true);
    } catch (error: any) {
      // handle error (optional toast)
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
        heading="Edit Project"
      
      />
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl mt-10 mb-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Edit Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-2 block text-base font-medium">
              Project Images
            </Label>
            <ImageUpload
              value={
                formData.images.filter((img) => img instanceof File) as File[]
              }
              onChange={handleImagesChange}
              label="Upload Images"
              previewUrl={formData.previewImages}
              multiple
              onRemove={handleRemoveImage}
            />
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
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>Update Project</>
            )}
          </Button>
        </form>
        <SuccessModal
          open={successOpen}
          onClose={() => {
            setSuccessOpen(false);
            router.push("/admin/projects");
          }}
          message="Project updated successfully!"
        />
      </div>
    </div>
  );
}
