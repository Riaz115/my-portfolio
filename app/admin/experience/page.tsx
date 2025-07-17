"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  Building,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SuccessModal from "@/components/ui/SuccessModal";
import DeleteModal from "@/components/ui/DeleteModal";
import { AdminHeader } from "@/components/layout/AdminHeader";

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  logo?: string;
  technologies?: string[];
}

export default function ExperiencePage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteExperience, setDeleteExperience] = useState<Experience | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: experiences, isLoading, refetch } = useGetExperienceQuery();
  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();
  const [deleteExperienceMutation] = useDeleteExperienceMutation();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    logo: null as File | null,
    technologies: "", // comma separated string for input
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        current: formData.current,
        description: formData.description,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingExperience) {
        await updateExperience({
          id: editingExperience._id,
          data: dataToSend,
        }).unwrap();
        setSuccessMessage("Experience updated successfully!");
        setSuccessOpen(true);
        setEditingExperience(null);
      } else {
        await createExperience(dataToSend).unwrap();
        setSuccessMessage("Experience added successfully!");
        setSuccessOpen(true);
        setIsAdding(false);
      }

      setFormData({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        logo: null,
        technologies: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to save experience");
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      logo: null,
      technologies: experience.technologies
        ? experience.technologies.join(", ")
        : "",
    });
  };

  const handleDelete = async () => {
    if (!deleteExperience) return;
    setIsDeleting(true);
    try {
      await deleteExperienceMutation(deleteExperience._id).unwrap();
      setDeleteExperience(null);
      setSuccessMessage("Experience deleted successfully!");
      setSuccessOpen(true);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete experience");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      logo: null,
      technologies: "",
    });
    setEditingExperience(null);
    setIsAdding(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Sort experiences by createdAt descending (most recent first)
  const sortedExperiences = (experiences || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div>
      <AdminHeader
        heading="Experience Managment"
    
      />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Experience List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedExperiences.map((experience: Experience) => (
            <div
              key={experience._id}
              className="flex flex-col bg-card rounded-lg border shadow-sm px-6 py-6 hover:shadow-md transition-shadow h-full min-h-[320px]"
            >
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-lg mb-2 truncate">
                  {experience.title}
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {experience.company}
                  </span>
                  {experience.current && (
                    <Badge variant="secondary">Current Position</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {experience.location}
                </span>
                <p className="text-sm text-muted-foreground mb-2">
                  {experience.description}
                </p>
                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
              <div className="flex gap-2 justify-center mt-auto pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(experience)}
                  className="flex items-center gap-2 px-4 py-2 border-primary text-primary hover:bg-primary/10 hover:text-primary-dark transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteExperience(experience)}
                  className="flex items-center gap-2 px-4 py-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  disabled={
                    isDeleting && deleteExperience?._id === experience._id
                  }
                >
                  {isDeleting && deleteExperience?._id === experience._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Experience Dialog */}
        <Dialog open={isAdding || !!editingExperience} onOpenChange={resetForm}>
          <DialogContent className="max-w-lg my-6 rounded-2xl shadow-2xl border-0 bg-white dark:bg-zinc-900 p-0">
            <DialogHeader className="px-8 pt-8">
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                <Briefcase className="h-6 w-6" />
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <div className="px-8 pb-8 pt-2 max-h-[70vh] overflow-y-auto hide-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-base font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Senior Developer"
                    required
                    className="rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company" className="text-base font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="e.g., Google Inc."
                    required
                    className="rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-base font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., San Francisco, CA"
                    required
                    className="rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="current"
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) =>
                      handleInputChange("current", e.target.checked)
                    }
                    className="rounded border border-input focus:ring-2 focus:ring-primary/50"
                  />
                  <Label htmlFor="current" className="text-base">
                    Current Working There
                  </Label>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your role and achievements..."
                    rows={4}
                    required
                    className="rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="technologies"
                    className="text-base font-medium"
                  >
                    Technologies (comma separated)
                  </Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      handleInputChange("technologies", e.target.value)
                    }
                    placeholder="e.g., React, Node.js, AWS"
                    className="rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 text-base py-2 rounded-lg"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingExperience ? "Update" : "Add"} Experience
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-base py-2 rounded-lg"
                    onClick={resetForm}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <DeleteModal
          open={!!deleteExperience}
          onClose={() => setDeleteExperience(null)}
          onConfirm={handleDelete}
          confirmLoading={isDeleting}
          title="Delete Experience"
        />
        <SuccessModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          message={successMessage}
        />
      </div>
    </div>
  );
}
