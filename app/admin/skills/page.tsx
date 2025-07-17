"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Award,
  Star,
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

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

export default function SkillsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: skills, isLoading, refetch } = useGetSkillsQuery();
  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
  const [deleteSkillMutation, { isLoading: isDeleting }] =
    useDeleteSkillMutation();

  const [formData, setFormData] = useState({
    name: "",
    level: 5,
    category: "frontend",
    icon: "",
  });

  const categories = [
    "frontend",
    "frontend-libraries",
    "backend",
    "database",
    "tools",
    "deployment",
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level, // or skill.percentage / 10 if you store as 10-100
      category: skill.category,
      icon: skill.icon || "",
    });
    setIsAdding(true); // Open the modal for editing
  };

  const handleDeleteClick = (skill: Skill) => {
    setDeleteSkill(skill); // Open the delete modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendData = {
      name: formData.name,
      percentage: formData.level * 10, // Convert 1-10 to 10-100
      category: formData.category,
      icon: formData.icon,
    };
    try {
      if (editingSkill) {
        await updateSkill({ id: editingSkill._id, data: backendData }).unwrap();
        setSuccessMessage("Skill updated successfully!");
        setSuccessOpen(true);
        setEditingSkill(null);
        setIsAdding(false); // Close the modal after update
      } else {
        await createSkill(backendData).unwrap();
        setSuccessMessage("Skill added successfully!");
        setSuccessOpen(true);
        setIsAdding(false);
      }
      setFormData({ name: "", level: 5, category: "frontend", icon: "" });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to save skill");
    }
  };

  const handleDelete = async () => {
    if (!deleteSkill) return;
    try {
      await deleteSkillMutation(deleteSkill._id).unwrap();
      setDeleteSkill(null);
      setSuccessMessage("Skill deleted successfully!");
      setSuccessOpen(true);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete skill");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", level: 5, category: "frontend", icon: "" });
    setEditingSkill(null);
    setIsAdding(false);
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return "text-green-600";
    if (level >= 6) return "text-yellow-600";
    return "text-red-600";
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
        heading="Skills Managment"
     
      />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills?.map((skill: Skill) => (
            <Card key={skill._id} className="flex flex-col justify-between h-full shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold truncate">{skill.name}</CardTitle>
                <div className="mt-1">
                  <span className="inline-block bg-muted text-xs rounded px-2 py-1 font-medium">
                    {skill.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                    className="flex-1 flex items-center gap-2 border-primary text-primary hover:bg-primary/10 hover:text-primary-dark transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(skill)}
                    className="flex-1 flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Skill Dialog */}
        <Dialog open={isAdding || !!editingSkill} onOpenChange={resetForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., React, Node.js, Python"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full p-2 border border-input rounded-md bg-background"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Skill Level (1-10)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="level"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) =>
                      handleInputChange("level", parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">
                    {formData.level}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="🚀 (optional)"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
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
                      {editingSkill ? "Update" : "Add"} Skill
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteModal
          open={!!deleteSkill}
          onClose={() => setDeleteSkill(null)}
          onConfirm={handleDelete}
          title="Delete Skill"
          confirmLoading={isDeleting}
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
