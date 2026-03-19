import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Copy, ArrowLeft, RefreshCw, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

const Admin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setAuthed(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setAuthed(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!authed) return null;

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading messages", variant: "destructive" });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

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

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-display font-light">Contact Messages</h1>
            <span className="text-sm text-muted-foreground">({messages.length})</span>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchMessages} className="p-2 border border-border rounded hover:bg-secondary transition-colors" title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            {messages.length > 0 && (
              <button onClick={clearAll} className="px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded hover:bg-destructive/90 transition-colors">
                Clear All
              </button>
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Admin;
