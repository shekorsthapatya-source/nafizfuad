import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Copy, ArrowLeft, RefreshCw, LogOut, Plus, Edit2, X, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

type ContactMessage = {
  id: string; name: string; email: string; phone: string | null; message: string; created_at: string;
};
type Credit = { label: string; value: string };
type GalleryItem = { src: string; caption: string };

type DbProject = {
  id: string; title: string; slug: string; description: string; long_description: string | null;
  location: string; year: string; status: string | null; category: string; size: string | null;
  image_url: string | null; gallery: GalleryItem[]; credits: Credit[]; created_at: string;
};
type DbAward = {
  id: string; title: string; slug: string; organization: string; year: string;
  description: string; image_url: string | null; gallery: GalleryItem[]; created_at: string;
};
type DbPhoto = {
  id: string; title: string; slug: string; location: string; year: string;
  camera: string; image_url: string | null; description: string; created_at: string;
};

const emptyProject = {
  title: "", slug: "", description: "", long_description: "", location: "", year: "",
  status: "", category: "", size: "", image_url: "", gallery: [] as GalleryItem[], credits: [] as Credit[],
};
const emptyAward = {
  title: "", slug: "", organization: "", year: "", description: "", image_url: "", gallery: [] as GalleryItem[],
};
const emptyPhoto = {
  title: "", slug: "", location: "", year: "", camera: "", image_url: "", description: "",
};

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type TabType = "messages" | "projects" | "awards" | "photography";

const Admin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [awards, setAwards] = useState<DbAward[]>([]);
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabType>("messages");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Project editing
  const [editingProject, setEditingProject] = useState<typeof emptyProject | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  // Award editing
  const [editingAward, setEditingAward] = useState<typeof emptyAward | null>(null);
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null);
  // Photo editing
  const [editingPhoto, setEditingPhoto] = useState<typeof emptyPhoto | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; name: string; onConfirm: () => void }>({
    open: false, name: "", onConfirm: () => {},
  });

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
  }, []);
  const fetchProjects = useCallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects((data as unknown as DbProject[]) || []);
  }, []);
  const fetchAwards = useCallback(async () => {
    const { data } = await supabase.from("awards").select("*").order("created_at", { ascending: false });
    setAwards((data as unknown as DbAward[]) || []);
  }, []);
  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase.from("photography").select("*").order("created_at", { ascending: false });
    setPhotos((data as unknown as DbPhoto[]) || []);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchMessages(), fetchProjects(), fetchAwards(), fetchPhotos()]);
    setLoading(false);
  }, [fetchMessages, fetchProjects, fetchAwards, fetchPhotos]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/login"); else setAuthed(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login"); else setAuthed(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => { if (authed) fetchAll(); }, [authed, fetchAll]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/login"); };

  // Shared upload helper
  const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed: " + error.message, variant: "destructive" }); return null; }
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  // ===== MESSAGES =====
  const copyMessage = (msg: ContactMessage) => {
    const text = `Name: ${msg.name}\nEmail: ${msg.email}${msg.phone ? `\nPhone: ${msg.phone}` : ""}\nMessage: ${msg.message}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };
  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Message deleted" });
  };

  // ===== PROJECTS =====
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery") => {
    if (!e.target.files || !editingProject) return;
    setUploading(true);
    const slug = editingProject.slug || toSlug(editingProject.title) || "temp";
    if (type === "main") {
      const file = e.target.files[0];
      const url = await uploadImage(file, "project-images", `${slug}/main.${file.name.split(".").pop()}`);
      if (url) setEditingProject({ ...editingProject, image_url: url });
    } else {
      const newItems: GalleryItem[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = await uploadImage(file, "project-images", `${slug}/gallery-${Date.now()}-${i}.${file.name.split(".").pop()}`);
        if (url) newItems.push({ src: url, caption: "" });
      }
      setEditingProject({ ...editingProject, gallery: [...editingProject.gallery, ...newItems] });
    }
    setUploading(false);
  };

  const saveProject = async () => {
    if (!editingProject) return;
    const slug = editingProject.slug || toSlug(editingProject.title);
    const payload = {
      title: editingProject.title, slug, description: editingProject.description,
      long_description: editingProject.long_description, location: editingProject.location,
      year: editingProject.year, status: editingProject.status || null, category: editingProject.category,
      size: editingProject.size || null, image_url: editingProject.image_url || null,
      gallery: JSON.parse(JSON.stringify(editingProject.gallery)),
      credits: JSON.parse(JSON.stringify(editingProject.credits)),
    };
    if (editingProjectId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingProjectId);
      if (error) { toast({ title: "Failed to save", variant: "destructive" }); return; }
      toast({ title: "Project updated" });
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) { toast({ title: "Failed to create: " + error.message, variant: "destructive" }); return; }
      toast({ title: "Project created" });
    }
    setEditingProject(null); setEditingProjectId(null); fetchProjects();
  };

  const confirmDeleteProject = (p: DbProject) => {
    setDeleteDialog({
      open: true, name: p.title,
      onConfirm: async () => {
        await supabase.from("projects").delete().eq("id", p.id);
        setProjects((prev) => prev.filter((x) => x.id !== p.id));
        toast({ title: "Project deleted" });
        setDeleteDialog({ open: false, name: "", onConfirm: () => {} });
      },
    });
  };

  // ===== AWARDS =====
  const handleAwardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery") => {
    if (!e.target.files || !editingAward) return;
    setUploading(true);
    const slug = editingAward.slug || toSlug(editingAward.title) || "temp";
    if (type === "main") {
      const file = e.target.files[0];
      const url = await uploadImage(file, "award-images", `${slug}/main.${file.name.split(".").pop()}`);
      if (url) setEditingAward({ ...editingAward, image_url: url });
    } else {
      const newItems: GalleryItem[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = await uploadImage(file, "award-images", `${slug}/gallery-${Date.now()}-${i}.${file.name.split(".").pop()}`);
        if (url) newItems.push({ src: url, caption: "" });
      }
      setEditingAward({ ...editingAward, gallery: [...editingAward.gallery, ...newItems] });
    }
    setUploading(false);
  };

  const saveAward = async () => {
    if (!editingAward) return;
    const slug = editingAward.slug || toSlug(editingAward.title);
    const payload = {
      title: editingAward.title, slug, organization: editingAward.organization,
      year: editingAward.year, description: editingAward.description,
      image_url: editingAward.image_url || null,
      gallery: JSON.parse(JSON.stringify(editingAward.gallery)),
    };
    if (editingAwardId) {
      const { error } = await supabase.from("awards").update(payload).eq("id", editingAwardId);
      if (error) { toast({ title: "Failed to save", variant: "destructive" }); return; }
      toast({ title: "Award updated" });
    } else {
      const { error } = await supabase.from("awards").insert([payload]);
      if (error) { toast({ title: "Failed to create: " + error.message, variant: "destructive" }); return; }
      toast({ title: "Award created" });
    }
    setEditingAward(null); setEditingAwardId(null); fetchAwards();
  };

  const confirmDeleteAward = (a: DbAward) => {
    setDeleteDialog({
      open: true, name: a.title,
      onConfirm: async () => {
        await supabase.from("awards").delete().eq("id", a.id);
        setAwards((prev) => prev.filter((x) => x.id !== a.id));
        toast({ title: "Award deleted" });
        setDeleteDialog({ open: false, name: "", onConfirm: () => {} });
      },
    });
  };

  // ===== PHOTOGRAPHY =====
  const handlePhotoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !editingPhoto) return;
    setUploading(true);
    const slug = editingPhoto.slug || toSlug(editingPhoto.title) || "temp";
    const file = e.target.files[0];
    const url = await uploadImage(file, "photo-images", `${slug}/main.${file.name.split(".").pop()}`);
    if (url) setEditingPhoto({ ...editingPhoto, image_url: url });
    setUploading(false);
  };

  const savePhoto = async () => {
    if (!editingPhoto) return;
    const slug = editingPhoto.slug || toSlug(editingPhoto.title);
    const payload = {
      title: editingPhoto.title, slug, location: editingPhoto.location,
      year: editingPhoto.year, camera: editingPhoto.camera,
      image_url: editingPhoto.image_url || null, description: editingPhoto.description,
    };
    if (editingPhotoId) {
      const { error } = await supabase.from("photography").update(payload).eq("id", editingPhotoId);
      if (error) { toast({ title: "Failed to save", variant: "destructive" }); return; }
      toast({ title: "Photo updated" });
    } else {
      const { error } = await supabase.from("photography").insert([payload]);
      if (error) { toast({ title: "Failed to create: " + error.message, variant: "destructive" }); return; }
      toast({ title: "Photo created" });
    }
    setEditingPhoto(null); setEditingPhotoId(null); fetchPhotos();
  };

  const confirmDeletePhoto = (p: DbPhoto) => {
    setDeleteDialog({
      open: true, name: p.title,
      onConfirm: async () => {
        await supabase.from("photography").delete().eq("id", p.id);
        setPhotos((prev) => prev.filter((x) => x.id !== p.id));
        toast({ title: "Photo deleted" });
        setDeleteDialog({ open: false, name: "", onConfirm: () => {} });
      },
    });
  };

  if (!authed) return null;

  const inputClass = "w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none";
  const labelClass = "block text-xs text-muted-foreground mb-1 uppercase tracking-wider";

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "messages", label: "Messages", count: messages.length },
    { key: "projects", label: "Projects", count: projects.length },
    { key: "awards", label: "Awards", count: awards.length },
    { key: "photography", label: "Photography", count: photos.length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-display font-light">Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchAll} className="p-2 border border-border rounded hover:bg-secondary transition-colors" title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={handleLogout} className="p-2 border border-border rounded hover:bg-secondary transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 text-sm tracking-wider uppercase whitespace-nowrap transition-colors ${tab === t.key ? "border-b-2 border-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* ===== MESSAGES TAB ===== */}
        {tab === "messages" && (
          <>
            {loading ? <p className="text-muted-foreground text-center py-16">Loading...</p>
            : messages.length === 0 ? <p className="text-muted-foreground text-center py-16">No messages yet.</p>
            : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-border rounded-lg p-5 bg-secondary/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{msg.name}</p>
                        <p className="text-sm text-muted-foreground">{msg.email}{msg.phone ? ` • ${msg.phone}` : ""}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => copyMessage(msg)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Copy size={14} /></button>
                        <button onClick={() => deleteMessage(msg.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-3">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== PROJECTS TAB ===== */}
        {tab === "projects" && !editingProject && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditingProject({ ...emptyProject }); setEditingProjectId(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Project
              </button>
            </div>
            {loading ? <p className="text-muted-foreground text-center py-16">Loading...</p>
            : projects.length === 0 ? <p className="text-muted-foreground text-center py-16">No projects yet.</p>
            : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-5 bg-secondary/30 flex gap-4">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-24 h-24 object-cover rounded shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.category} • {p.location} • {p.year}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditingProject({ ...p, long_description: p.long_description || "", status: p.status || "", size: p.size || "", image_url: p.image_url || "", gallery: p.gallery || [], credits: p.credits || [] }); setEditingProjectId(p.id); }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => confirmDeleteProject(p)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "projects" && editingProject && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{editingProjectId ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => { setEditingProject(null); setEditingProjectId(null); }} className="p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Title *</label><input value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, slug: toSlug(e.target.value) })} className={inputClass} /></div>
              <div><label className={labelClass}>Slug</label><input value={editingProject.slug} onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Category *</label><input value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} placeholder="Residential, Cultural..." className={inputClass} /></div>
              <div><label className={labelClass}>Location *</label><input value={editingProject.location} onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Year *</label><input value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Status</label><input value={editingProject.status} onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })} placeholder="Completed, Ongoing..." className={inputClass} /></div>
              <div><label className={labelClass}>Size</label><input value={editingProject.size} onChange={(e) => setEditingProject({ ...editingProject, size: e.target.value })} placeholder="e.g. 6300 SFT" className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Short Description *</label><textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} rows={2} className={inputClass + " resize-none"} /></div>
            <div><label className={labelClass}>Long Description</label><textarea value={editingProject.long_description} onChange={(e) => setEditingProject({ ...editingProject, long_description: e.target.value })} rows={5} className={inputClass + " resize-none"} /></div>
            <div>
              <label className={labelClass}>Main Image</label>
              {editingProject.image_url && <img src={editingProject.image_url} alt="Main" className="w-40 h-28 object-cover rounded mb-2" />}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(e, "main")} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div>
              <label className={labelClass}>Gallery Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingProject.gallery.map((g, i) => (
                  <div key={i} className="relative group">
                    <img src={g.src} alt={g.caption || `Gallery ${i + 1}`} className="w-24 h-20 object-cover rounded" />
                    <button onClick={() => setEditingProject({ ...editingProject, gallery: editingProject.gallery.filter((_, j) => j !== i) })}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    <input value={g.caption} onChange={(e) => { const u = [...editingProject.gallery]; u[i] = { ...u[i], caption: e.target.value }; setEditingProject({ ...editingProject, gallery: u }); }}
                      placeholder="Caption" className="w-24 text-xs mt-1 px-1 py-0.5 bg-transparent border-b border-border focus:outline-none" />
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Add Gallery Images"}
                <input type="file" accept="image/*" multiple onChange={(e) => handleProjectImageUpload(e, "gallery")} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div>
              <label className={labelClass}>Credits</label>
              {editingProject.credits.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={c.label} onChange={(e) => { const u = [...editingProject.credits]; u[i] = { ...u[i], label: e.target.value }; setEditingProject({ ...editingProject, credits: u }); }}
                    placeholder="Role" className="flex-1 px-3 py-1.5 bg-transparent border border-border rounded text-sm focus:border-accent focus:outline-none" />
                  <input value={c.value} onChange={(e) => { const u = [...editingProject.credits]; u[i] = { ...u[i], value: e.target.value }; setEditingProject({ ...editingProject, credits: u }); }}
                    placeholder="Name" className="flex-1 px-3 py-1.5 bg-transparent border border-border rounded text-sm focus:border-accent focus:outline-none" />
                  <button onClick={() => setEditingProject({ ...editingProject, credits: editingProject.credits.filter((_, j) => j !== i) })}
                    className="p-1.5 text-muted-foreground hover:text-destructive"><X size={14} /></button>
                </div>
              ))}
              <button onClick={() => setEditingProject({ ...editingProject, credits: [...editingProject.credits, { label: "", value: "" }] })}
                className="text-sm text-accent hover:underline">+ Add Credit</button>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={saveProject} disabled={!editingProject.title || !editingProject.category || !editingProject.location || !editingProject.year}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {editingProjectId ? "Update" : "Create"} Project
              </button>
              <button onClick={() => { setEditingProject(null); setEditingProjectId(null); }}
                className="px-6 py-2.5 border border-border text-sm tracking-widest uppercase hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* ===== AWARDS TAB ===== */}
        {tab === "awards" && !editingAward && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditingAward({ ...emptyAward }); setEditingAwardId(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Award
              </button>
            </div>
            {loading ? <p className="text-muted-foreground text-center py-16">Loading...</p>
            : awards.length === 0 ? <p className="text-muted-foreground text-center py-16">No awards yet.</p>
            : (
              <div className="space-y-4">
                {awards.map((a) => (
                  <div key={a.id} className="border border-border rounded-lg p-5 bg-secondary/30 flex gap-4">
                    {a.image_url && <img src={a.image_url} alt={a.title} className="w-24 h-24 object-cover rounded shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.organization} • {a.year}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditingAward({ ...a, image_url: a.image_url || "", gallery: a.gallery || [] }); setEditingAwardId(a.id); }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => confirmDeleteAward(a)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "awards" && editingAward && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{editingAwardId ? "Edit Award" : "New Award"}</h2>
              <button onClick={() => { setEditingAward(null); setEditingAwardId(null); }} className="p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Title *</label><input value={editingAward.title} onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value, slug: toSlug(e.target.value) })} className={inputClass} /></div>
              <div><label className={labelClass}>Slug</label><input value={editingAward.slug} onChange={(e) => setEditingAward({ ...editingAward, slug: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Organization *</label><input value={editingAward.organization} onChange={(e) => setEditingAward({ ...editingAward, organization: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Year *</label><input value={editingAward.year} onChange={(e) => setEditingAward({ ...editingAward, year: e.target.value })} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Description *</label><textarea value={editingAward.description} onChange={(e) => setEditingAward({ ...editingAward, description: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
            <div>
              <label className={labelClass}>Main Image</label>
              {editingAward.image_url && <img src={editingAward.image_url} alt="Main" className="w-40 h-28 object-cover rounded mb-2" />}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={(e) => handleAwardImageUpload(e, "main")} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div>
              <label className={labelClass}>Gallery Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingAward.gallery.map((g, i) => (
                  <div key={i} className="relative group">
                    <img src={g.src} alt={g.caption || `Gallery ${i + 1}`} className="w-24 h-20 object-cover rounded" />
                    <button onClick={() => setEditingAward({ ...editingAward, gallery: editingAward.gallery.filter((_, j) => j !== i) })}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    <input value={g.caption} onChange={(e) => { const u = [...editingAward.gallery]; u[i] = { ...u[i], caption: e.target.value }; setEditingAward({ ...editingAward, gallery: u }); }}
                      placeholder="Caption" className="w-24 text-xs mt-1 px-1 py-0.5 bg-transparent border-b border-border focus:outline-none" />
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Add Gallery Images"}
                <input type="file" accept="image/*" multiple onChange={(e) => handleAwardImageUpload(e, "gallery")} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={saveAward} disabled={!editingAward.title || !editingAward.organization || !editingAward.year}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {editingAwardId ? "Update" : "Create"} Award
              </button>
              <button onClick={() => { setEditingAward(null); setEditingAwardId(null); }}
                className="px-6 py-2.5 border border-border text-sm tracking-widest uppercase hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* ===== PHOTOGRAPHY TAB ===== */}
        {tab === "photography" && !editingPhoto && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditingPhoto({ ...emptyPhoto }); setEditingPhotoId(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Photo
              </button>
            </div>
            {loading ? <p className="text-muted-foreground text-center py-16">Loading...</p>
            : photos.length === 0 ? <p className="text-muted-foreground text-center py-16">No photos yet.</p>
            : (
              <div className="space-y-4">
                {photos.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-5 bg-secondary/30 flex gap-4">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-24 h-24 object-cover rounded shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.location} • {p.year} • {p.camera}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditingPhoto({ ...p, image_url: p.image_url || "" }); setEditingPhotoId(p.id); }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => confirmDeletePhoto(p)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "photography" && editingPhoto && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{editingPhotoId ? "Edit Photo" : "New Photo"}</h2>
              <button onClick={() => { setEditingPhoto(null); setEditingPhotoId(null); }} className="p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Title *</label><input value={editingPhoto.title} onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value, slug: toSlug(e.target.value) })} className={inputClass} /></div>
              <div><label className={labelClass}>Slug</label><input value={editingPhoto.slug} onChange={(e) => setEditingPhoto({ ...editingPhoto, slug: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Location *</label><input value={editingPhoto.location} onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Year *</label><input value={editingPhoto.year} onChange={(e) => setEditingPhoto({ ...editingPhoto, year: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Camera *</label><input value={editingPhoto.camera} onChange={(e) => setEditingPhoto({ ...editingPhoto, camera: e.target.value })} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Description *</label><textarea value={editingPhoto.description} onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
            <div>
              <label className={labelClass}>Photo Image</label>
              {editingPhoto.image_url && <img src={editingPhoto.image_url} alt="Photo" className="w-40 h-28 object-cover rounded mb-2" />}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handlePhotoImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={savePhoto} disabled={!editingPhoto.title || !editingPhoto.location || !editingPhoto.year || !editingPhoto.camera}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {editingPhotoId ? "Update" : "Create"} Photo
              </button>
              <button onClick={() => { setEditingPhoto(null); setEditingPhotoId(null); }}
                className="px-6 py-2.5 border border-border text-sm tracking-widest uppercase hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, name: "", onConfirm: () => {} })}
        onConfirm={deleteDialog.onConfirm}
        itemName={deleteDialog.name}
      />
    </div>
  );
};

export default Admin;
