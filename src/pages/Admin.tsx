import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Copy, ArrowLeft, RefreshCw, LogOut, Plus, Edit2, X, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

type Credit = { label: string; value: string };
type GalleryItem = { src: string; caption: string };

type DbProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  location: string;
  year: string;
  status: string | null;
  category: string;
  size: string | null;
  image_url: string | null;
  gallery: GalleryItem[];
  credits: Credit[];
  created_at: string;
};

const emptyProject = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  location: "",
  year: "",
  status: "",
  category: "",
  size: "",
  image_url: "",
  gallery: [] as GalleryItem[],
  credits: [] as Credit[],
};

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const Admin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"messages" | "projects">("messages");
  const [editingProject, setEditingProject] = useState<typeof emptyProject | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading messages", variant: "destructive" });
    } else {
      setMessages(data || []);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading projects", variant: "destructive" });
    } else {
      setProjects((data as unknown as DbProject[]) || []);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchMessages(), fetchProjects()]);
    setLoading(false);
  }, [fetchMessages, fetchProjects]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/login");
      else setAuthed(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setAuthed(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const copyMessage = (msg: ContactMessage) => {
    const text = `Name: ${msg.name}\nEmail: ${msg.email}${msg.phone ? `\nPhone: ${msg.phone}` : ""}\nMessage: ${msg.message}\nDate: ${new Date(msg.created_at).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Message deleted" });
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete all messages? This cannot be undone.")) return;
    const { error } = await supabase.from("contact_messages").delete().neq("id", "");
    if (error) {
      toast({ title: "Failed to clear", variant: "destructive" });
    } else {
      setMessages([]);
      toast({ title: "All messages cleared" });
    }
  };

  // Project CRUD
  const startNewProject = () => {
    setEditingProject({ ...emptyProject });
    setEditingId(null);
  };

  const startEditProject = (p: DbProject) => {
    setEditingProject({
      title: p.title,
      slug: p.slug,
      description: p.description,
      long_description: p.long_description || "",
      location: p.location,
      year: p.year,
      status: p.status || "",
      category: p.category,
      size: p.size || "",
      image_url: p.image_url || "",
      gallery: p.gallery || [],
      credits: p.credits || [],
    });
    setEditingId(p.id);
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed: " + error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !editingProject) return;
    setUploading(true);
    const file = e.target.files[0];
    const slug = editingProject.slug || toSlug(editingProject.title) || "temp";
    const ext = file.name.split(".").pop();
    const url = await uploadImage(file, `${slug}/main.${ext}`);
    if (url) setEditingProject({ ...editingProject, image_url: url });
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editingProject) return;
    setUploading(true);
    const slug = editingProject.slug || toSlug(editingProject.title) || "temp";
    const newItems: GalleryItem[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const ext = file.name.split(".").pop();
      const url = await uploadImage(file, `${slug}/gallery-${Date.now()}-${i}.${ext}`);
      if (url) newItems.push({ src: url, caption: "" });
    }
    setEditingProject({ ...editingProject, gallery: [...editingProject.gallery, ...newItems] });
    setUploading(false);
  };

  const saveProject = async () => {
    if (!editingProject) return;
    const slug = editingProject.slug || toSlug(editingProject.title);
    const payload = {
      title: editingProject.title,
      slug,
      description: editingProject.description,
      long_description: editingProject.long_description,
      location: editingProject.location,
      year: editingProject.year,
      status: editingProject.status || null,
      category: editingProject.category,
      size: editingProject.size || null,
      image_url: editingProject.image_url || null,
      gallery: editingProject.gallery as unknown as Record<string, unknown>[],
      credits: editingProject.credits as unknown as Record<string, unknown>[],
    };

    if (editingId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Failed to save", variant: "destructive" }); return; }
      toast({ title: "Project updated" });
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast({ title: "Failed to create: " + error.message, variant: "destructive" }); return; }
      toast({ title: "Project created" });
    }
    setEditingProject(null);
    setEditingId(null);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast({ title: "Failed to delete", variant: "destructive" }); return; }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Project deleted" });
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
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
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setTab("messages")}
            className={`pb-3 text-sm tracking-wider uppercase transition-colors ${tab === "messages" ? "border-b-2 border-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Messages ({messages.length})
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`pb-3 text-sm tracking-wider uppercase transition-colors ${tab === "projects" ? "border-b-2 border-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Projects ({projects.length})
          </button>
        </div>

        {/* Messages Tab */}
        {tab === "messages" && (
          <>
            {messages.length > 0 && (
              <div className="flex justify-end mb-4">
                <button onClick={clearAll} className="px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded hover:bg-destructive/90 transition-colors">
                  Clear All
                </button>
              </div>
            )}
            {loading ? (
              <p className="text-muted-foreground text-center py-16">Loading...</p>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-border rounded-lg p-5 bg-secondary/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{msg.name}</p>
                        <p className="text-sm text-muted-foreground">{msg.email}{msg.phone ? ` • ${msg.phone}` : ""}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => copyMessage(msg)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => deleteMessage(msg.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
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

        {/* Projects Tab */}
        {tab === "projects" && !editingProject && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={startNewProject} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Project
              </button>
            </div>
            {loading ? (
              <p className="text-muted-foreground text-center py-16">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">No projects yet. Add your first project!</p>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-5 bg-secondary/30 flex gap-4">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.title} className="w-24 h-24 object-cover rounded shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.category} • {p.location} • {p.year}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEditProject(p)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteProject(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Project Form */}
        {tab === "projects" && editingProject && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{editingId ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => { setEditingProject(null); setEditingId(null); }} className="p-2 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Title *</label>
                <input
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, slug: toSlug(e.target.value) })}
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Slug</label>
                <input
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Category *</label>
                <input
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="Residential, Cultural, Religious, Interior"
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Location *</label>
                <input
                  value={editingProject.location}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Year *</label>
                <input
                  value={editingProject.year}
                  onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Status</label>
                <input
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                  placeholder="Completed, Ongoing..."
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Size</label>
                <input
                  value={editingProject.size}
                  onChange={(e) => setEditingProject({ ...editingProject, size: e.target.value })}
                  placeholder="e.g. 6300 SFT"
                  className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Short Description *</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Long Description</label>
              <textarea
                value={editingProject.long_description}
                onChange={(e) => setEditingProject({ ...editingProject, long_description: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-accent focus:outline-none resize-none"
              />
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Main Image</label>
              {editingProject.image_url && (
                <img src={editingProject.image_url} alt="Main" className="w-40 h-28 object-cover rounded mb-2" />
              )}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Gallery Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingProject.gallery.map((g, i) => (
                  <div key={i} className="relative group">
                    <img src={g.src} alt={g.caption || `Gallery ${i + 1}`} className="w-24 h-20 object-cover rounded" />
                    <button
                      onClick={() => setEditingProject({ ...editingProject, gallery: editingProject.gallery.filter((_, j) => j !== i) })}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                    <input
                      value={g.caption}
                      onChange={(e) => {
                        const updated = [...editingProject.gallery];
                        updated[i] = { ...updated[i], caption: e.target.value };
                        setEditingProject({ ...editingProject, gallery: updated });
                      }}
                      placeholder="Caption"
                      className="w-24 text-xs mt-1 px-1 py-0.5 bg-transparent border-b border-border focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-secondary transition-colors text-sm">
                <Upload size={14} /> {uploading ? "Uploading..." : "Add Gallery Images"}
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploading} />
              </label>
            </div>

            {/* Credits */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Credits</label>
              {editingProject.credits.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={c.label}
                    onChange={(e) => {
                      const updated = [...editingProject.credits];
                      updated[i] = { ...updated[i], label: e.target.value };
                      setEditingProject({ ...editingProject, credits: updated });
                    }}
                    placeholder="Role (e.g. Designer)"
                    className="flex-1 px-3 py-1.5 bg-transparent border border-border rounded text-sm focus:border-accent focus:outline-none"
                  />
                  <input
                    value={c.value}
                    onChange={(e) => {
                      const updated = [...editingProject.credits];
                      updated[i] = { ...updated[i], value: e.target.value };
                      setEditingProject({ ...editingProject, credits: updated });
                    }}
                    placeholder="Name"
                    className="flex-1 px-3 py-1.5 bg-transparent border border-border rounded text-sm focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => setEditingProject({ ...editingProject, credits: editingProject.credits.filter((_, j) => j !== i) })}
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setEditingProject({ ...editingProject, credits: [...editingProject.credits, { label: "", value: "" }] })}
                className="text-sm text-accent hover:underline"
              >
                + Add Credit
              </button>
            </div>

            {/* Save */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={saveProject}
                disabled={!editingProject.title || !editingProject.category || !editingProject.location || !editingProject.year}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {editingId ? "Update Project" : "Create Project"}
              </button>
              <button
                onClick={() => { setEditingProject(null); setEditingId(null); }}
                className="px-6 py-2.5 border border-border text-sm tracking-widest uppercase hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
