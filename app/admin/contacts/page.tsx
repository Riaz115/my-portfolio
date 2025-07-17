"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useReplyToContactMutation,
} from "@/store/api/apiSlice";
import { toast } from "react-toastify";
import {
  Trash2,
  Check,
  X,
  Loader2,
  MessageSquare,
  Mail,
  Calendar,
  User,
  Eye,
  Reply,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminHeader } from "@/components/layout/AdminHeader";
import SuccessModal from "@/components/ui/SuccessModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [successOpen, setSuccessOpen] = useState(false);

  const { data: contacts, isLoading, refetch } = useGetContactsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContactStatusMutation();
  const [deleteContactMutation, { isLoading: isDeleting }] =
    useDeleteContactMutation();
  const [sendReply, { isLoading: isReplying }] = useReplyToContactMutation();

  const handleStatusUpdate = async (contactId: string, status: string) => {
    try {
      await updateStatus({ id: contactId, status }).unwrap();
      toast.success("Status updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteContact) return;

    try {
      await deleteContactMutation(deleteContact._id).unwrap();
      toast.success("Contact deleted successfully!");
      setDeleteContact(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete contact");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount =
    contacts?.filter((contact: Contact) => contact.status === "unread")
      .length || 0;

  // Filter contacts based on selected tab
  const filteredContacts = contacts?.filter((contact: Contact) => {
    if (filter === 'all') return true;
    return contact.status === filter;
  }) || [];

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
        heading="Contact Section Management"

      />
      <div className="p-6 space-y-6">
       
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Messages
                  </p>
                  <p className="text-2xl font-bold">{contacts?.length || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-red-600">
                    {unreadCount}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Read</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {contacts?.filter((c: Contact) => c.status === "read")
                      .length || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Replied</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contacts?.filter((c: Contact) => c.status === "replied")
                      .length || 0}
                  </p>
                </div>
                <Reply className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

         {/* Filter Tabs (below stats cards) */}
         <Tabs value={filter} onValueChange={value => setFilter(value as "unread" | "read" | "replied" | "all")} className="mb-4 w-full">
          <TabsList className="w-full flex gap-2">
            <TabsTrigger value="all" className="flex-1 w-full">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 w-full">Unread</TabsTrigger>
            <TabsTrigger value="read" className="flex-1 w-full">Read</TabsTrigger>
            <TabsTrigger value="replied" className="flex-1 w-full">Replied</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.map((contact: Contact) => (
            <Card key={contact._id} className="relative group pb-10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 w-full">
                    {/* <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div> */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>
                      {/* Responsive email/date row */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(contact.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2">
                        {contact.subject}
                      </p>
                      {/* Message preview */}
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {contact.message.length > 100 ? contact.message.slice(0, 100) + '...' : contact.message}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {/* Eye icon bottom right, always visible */}
              <div className="absolute bottom-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedContact(contact)}
                  className="bg-primary/10 hover:bg-primary/20 rounded-full shadow-md"
                  aria-label="View Message"
                >
                  <Eye className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredContacts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
                <p className="text-muted-foreground">
                  When people contact you through your portfolio, their messages
                  will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* View Message Dialog */}
        <Dialog
          open={!!selectedContact}
          onOpenChange={() => { setSelectedContact(null); setShowReply(false); setReplyMessage(''); }}
        >
          <DialogContent className="sm:max-w-lg w-full rounded-xl shadow-2xl border-0 p-0 overflow-hidden bg-white dark:bg-zinc-900 ">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-blue-500 px-6 py-5 flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide">{showReply ? 'Reply to Message' : `Message from ${selectedContact?.name}`}</h2>
                {!showReply && (
                  <span className="text-xs text-white/80">{selectedContact?.email}</span>
                )}
              </div>
            </div>
            {/* Modal Body (scrollable) */}
            <div className="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">From:</span>
                  <span className="text-sm text-muted-foreground">{selectedContact?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm text-muted-foreground">{selectedContact ? formatDate(selectedContact.createdAt) : ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={selectedContact ? getStatusColor(selectedContact.status) : ""}>{selectedContact?.status}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Subject:</span>
                <p className="text-sm font-semibold text-primary/90">{selectedContact?.subject}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Message:</span>
                <p className="text-base whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 border-l-4 border-primary pl-4 bg-zinc-50 dark:bg-zinc-800 py-2 rounded">{selectedContact?.message}</p>
              </div>
              {/* Action Buttons - right aligned */}
              <div className="flex justify-end gap-2 pt-6">
                {selectedContact?.status === "unread" && !showReply && (
                  <Button
                    onClick={async () => {
                      try {
                        await handleStatusUpdate(selectedContact._id, "read");
                        setSelectedContact({ ...selectedContact, status: 'read' });
                        toast.success("Marked as read!");
                      } catch (error: any) {
                        toast.error(error?.data?.error || "Failed to mark as read");
                      }
                    }}
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow-lg hover:from-yellow-500 hover:to-yellow-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
                {!showReply && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowReply(true)}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-blue-700"
                  >
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => { setSelectedContact(null); setShowReply(false); setReplyMessage(''); }}
                  className="border-gray-300"
                >
                  Close
                </Button>
              </div>
              {/* Reply Form */}
              {showReply && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedContact) return;
                    try {
                      await sendReply({
                        id: selectedContact._id,
                        email: selectedContact.email,
                        message: replyMessage,
                      }).unwrap();
                      await handleStatusUpdate(selectedContact._id, 'replied');
                      setShowReply(false);
                      setReplyMessage('');
                      setSuccessOpen(true);
                    } catch (error: any) {
                      toast.error(error?.data?.error || "Failed to send reply");
                    }
                  }}
                  className="space-y-2"
                >
                  <textarea
                    className="w-full border-2 border-primary rounded-lg p-2 min-h-[80px] focus:ring-2 focus:ring-primary/50"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isReplying || !replyMessage} className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-lg hover:from-green-500 hover:to-green-700">
                      {isReplying ? 'Sending...' : 'Send Reply'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowReply(false)} className="border-gray-300">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {/* Success Modal for Reply */}
        <SuccessModal
          open={successOpen}
          onClose={() => {
            setSuccessOpen(false);
            setSelectedContact(null);
            refetch();
          }}
          message="Reply sent successfully!"
        />
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteContact}
          onOpenChange={() => setDeleteContact(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete the message from "
                {deleteContact?.name}"?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteContact(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
