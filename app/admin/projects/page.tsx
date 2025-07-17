"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  FolderOpen,
  ExternalLink,
  Github,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";
import DeleteModal from "@/components/ui/DeleteModal";
import SuccessModal from "@/components/ui/SuccessModal";
import { AdminHeader } from "@/components/layout/AdminHeader";

interface Project {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  // category: string; // Remove category
}

export default function ProjectsPage() {
  const router = useRouter();
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const { data, isLoading, error, refetch } = useGetProjectsQuery({ limit: 10000 });
  const projects = data?.projects || [];
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProjectMutation, { isLoading: isDeleting }] =
    useDeleteProjectMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    images: [] as (string | File)[],
    previewImages: [] as string[],
  });
  const [successOpen, setSuccessOpen] = useState(false);

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/${project._id}/edit`);
  };

  const handleImagesChange = (files: File[] | File | null) => {
    let filesArr: File[] = [];
    if (Array.isArray(files)) {
      filesArr = files;
    } else if (files) {
      filesArr = [files];
    }
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images.filter((img) => typeof img === "string"),
        ...filesArr,
      ],
      previewImages: [
        ...(prev.images.filter((img) => typeof img === "string") as string[]),
        ...filesArr.map((file) => URL.createObjectURL(file)),
      ],
    }));
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    try {
      await deleteProjectMutation(deleteProject._id).unwrap();
      setDeleteProject(null);
      setSuccessOpen(true);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete project");
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">Error loading projects</div>;
  }
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
        heading="Projects Managment"
      
      />{" "}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => router.push("/admin/projects/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
        {/* Projects List - one per row, scrollable images, admin controls */}
        <div className="flex flex-col gap-8">
          {projects.map((project: Project) => (
            <Card
              key={project._id}
              className="relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl shadow-xl border border-primary/10 bg-white dark:bg-zinc-900/80"
            >
              {/* Images Scroll */}
              <div
                className="w-full md:w-1/2 flex-shrink-0 flex items-center overflow-x-auto gap-2 bg-card p-3 md:p-4"
                style={{ minHeight: "180px" }}
              >
                {Array.isArray(project.images) && project.images.length > 0 ? (
                  project.images.map((img, idx) => {
                    const key =
                      typeof img === "string"
                        ? img
                        : (img as File).name + (img as File).lastModified;
                    return (
                      <img
                        key={key}
                        src={img}
                        alt={project.name}
                        className="h-32 w-auto object-cover rounded-xl border border-primary/10 shadow-sm"
                        style={{ minWidth: "120px" }}
                      />
                    );
                  })
                ) : (
                  <div className="h-32 w-full flex items-center justify-center text-muted-foreground bg-muted rounded-xl">
                    No Image
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-between p-5 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg font-bold text-primary line-clamp-1">
                      {project.name}
                    </CardTitle>
                    {project.featured && (
                      <Badge variant="secondary" className="ml-2">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(project.technologies || []).map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/projects/${project._id}/edit`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteProject(project)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <DeleteModal
          open={!!deleteProject}
          onClose={() => setDeleteProject(null)}
          onConfirm={handleDelete}
          title="Delete"
          confirmLoading={isDeleting}
        />
        <SuccessModal
          open={successOpen}
          onClose={() => {
            setSuccessOpen(false);
            refetch();
          }}
          message="Project updated successfully!"
        />
      </div>
    </div>
  );
}
