"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Calendar, Image, Settings, Moon, Sun, LogIn, LogOut, Megaphone, Church, Users } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
// import NextImage from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Add additional icons and hooks needed
import { Plus, Pencil, Trash2, Save, Loader2, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link as LinkIcon, Bold, Italic, Underline } from "lucide-react";
import { insertFormatting } from "@/lib/textUtils";

function AdminTopBar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    // Navigate to dedicated sign-out page for goodbye UX
    window.location.href = "/auth/sign-out";
  };

  const handleSignIn = async () => {
    // Navigate to dedicated sign-in page for welcome UX
    window.location.href = "/auth/sign-in";
  };

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Church Name */}
        <Link href="/" className="flex items-center gap-3">
          <NextImage
            src="/logo.png"
            alt="KGIC logo"
            width={48}
            height={48}
            className="rounded-sm"
          />
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg text-foreground">KGIC</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </Link>

        {/* Right: Theme Toggle and Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2 h-9 w-9"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Auth Button */}
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleSignIn}
              className="gap-2"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Admin Prayers CRUD component
function AdminPrayers() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  type Prayer = {
    id: string;
    title: string;
    content: string;
    author: string | null;
    excerpt: string | null;
    is_featured: boolean;
    status: string;
    scheduled_for: string | null;
    created_at: string;
    updated_at: string;
  };

  const [prayers, setPrayers] = React.useState<Prayer[]>([]);

  // Form state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [scheduledFor, setScheduledFor] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("draft");
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);
  const [content, setContent] = React.useState("");
  // Formatting toolbar state/handlers
  const contentRef = React.useRef<HTMLTextAreaElement | null>(null);
  const applyFormat = (type: 'bold' | 'italic' | 'underline' | 'link') => {
    const el = contentRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;

    if (type === 'link') {
      const selectedText = content.slice(start, end);
      const defaultUrl = selectedText.startsWith('http://') || selectedText.startsWith('https://') ? selectedText : 'https://';
      const input = window.prompt('Enter URL (http(s)://, mailto:, /path, or #anchor):', defaultUrl);
      if (input === null) return; // user cancelled
      const url = input.trim();
      const isSafe = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('/') || url.startsWith('#');
      if (!isSafe) {
        window.alert('Please enter a URL starting with http://, https://, mailto:, /, or #');
        return;
      }
      const linkText = selectedText || 'link text';
      const formattedText = `[${linkText}](${url})`;
      const newTextManual = content.slice(0, start) + formattedText + content.slice(end);
      const newCursorPosManual = start + formattedText.length;
      setContent(newTextManual);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(newCursorPosManual, newCursorPosManual);
      });
      return;
    }

    const { newText, newCursorPos } = insertFormatting(content, start, end, type);
    setContent(newText);
    // Move cursor to end of insertion for good UX
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setScheduledFor("");
    setStatus("draft");
    setIsFeatured(false);
    setContent("");
  };

  const fetchPrayers = async () => {
    if (!supabase) {
      setError("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("prayers")
      .select("*")
      .order("scheduled_for", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setPrayers((data as Prayer[]) || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPrayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeExcerpt = (text: string) => {
    const t = text.replace(/\s+/g, " ").trim();
    return t.slice(0, 180);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: Partial<Prayer> = {
      title,
      content,
      author: author || null,
      excerpt: computeExcerpt(content),
      is_featured: isFeatured,
      status,
      scheduled_for: scheduledFor || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("prayers").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Prayer updated.");
      } else {
        const { error } = await supabase.from("prayers").insert(payload);
        if (error) throw error;
        setSuccess("Prayer created.");
      }
      resetForm();
      await fetchPrayers();
    } catch (err: any) {
      setError(err.message || "Failed to save prayer.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Prayer) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setAuthor(p.author || "");
    setScheduledFor(p.scheduled_for ? p.scheduled_for.substring(0, 10) : "");
    setStatus(p.status || "draft");
    setIsFeatured(!!p.is_featured);
    setContent(p.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this prayer? This cannot be undone.");
    if (!ok) return;
    setError(null);
    try {
      const { error } = await supabase.from("prayers").delete().eq("id", id);
      if (error) throw error;
      setSuccess("Prayer deleted.");
      await fetchPrayers();
    } catch (err: any) {
      setError(err.message || "Failed to delete prayer.");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Prayers Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="title">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="author">Author</label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="date">Date (Scheduled)</label>
              <Input id="date" type="date" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="status">Status</label>
              <select
                id="status"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="is_featured" type="checkbox" className="h-4 w-4" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <label htmlFor="is_featured" className="text-sm text-muted-foreground">Feature as Today’s Prayer</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="content">Content</label>
            {/* Formatting toolbar */}
            <div className="flex items-center gap-2 mb-1 text-sm">
              <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted" onClick={() => applyFormat('bold')}>
                <Bold className="h-4 w-4" />
                <span className="hidden sm:inline">Bold</span>
              </button>
              <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted" onClick={() => applyFormat('italic')}>
                <Italic className="h-4 w-4" />
                <span className="hidden sm:inline">Italic</span>
              </button>
              <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted" onClick={() => applyFormat('underline')}>
                <Underline className="h-4 w-4" />
                <span className="hidden sm:inline">Underline</span>
              </button>
              <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted" onClick={() => applyFormat('link')}>
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Link</span>
              </button>
              <span className="text-xs text-muted-foreground ml-2">Tip: **bold**, *italic*, __underline__, [link](https://example.com) and emojis 😊</span>
            </div>

            <Textarea id="content" rows={10} value={content} onChange={(e) => setContent(e.target.value)} required ref={contentRef} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Prayer"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing Prayers</h3>
            <Button variant="outline" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading prayers…</p>
          ) : prayers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prayers found.</p>
          ) : (
            <div className="space-y-3">
              {prayers.map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-4 bg-card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {p.is_featured && <span className="text-xs font-medium text-accent">Featured</span>}
                      <span className="text-xs text-muted-foreground">{p.status}</span>
                      {p.scheduled_for && <span className="text-xs text-muted-foreground">• {p.scheduled_for?.substring(0,10)}</span>}
                    </div>
                    <p className="font-medium">{p.title}</p>
                    {p.excerpt && <p className="text-sm text-muted-foreground mt-1">{p.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Podcasts CRUD component
function AdminPodcasts() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  // Upload state
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = React.useState("");
  const [artist, setArtist] = React.useState("");
  const [audioUrl, setAudioUrl] = React.useState("");
  const [duration, setDuration] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("draft");
  const [publishedAt, setPublishedAt] = React.useState<string>("");
  const [description, setDescription] = React.useState("");
  
  // Define Podcast type and missing state
  type Podcast = {
    id: string;
    title: string;
    description: string | null;
    artist: string | null;
    audio_url: string;
    duration_seconds: number | null;
    status: string;
    published_at: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
  const [podcasts, setPodcasts] = React.useState<Podcast[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setAudioUrl("");
    setDuration("");
    setStatus("draft");
    setPublishedAt("");
    setDescription("");
  };
  
  const fetchPodcasts = async () => {
    if (!supabase) {
      setError("Supabase not configured. Set env vars.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setPodcasts((data as Podcast[]) || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toIntOrNull = (val: string) => {
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: Partial<Podcast> = {
      title,
      description: description || null,
      artist: artist || null,
      audio_url: audioUrl,
      duration_seconds: toIntOrNull(duration),
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    } as any;

    try {
      if (editingId) {
        const { error } = await supabase.from("podcasts").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Podcast updated.");
      } else {
        const { error } = await supabase.from("podcasts").insert(payload);
        if (error) throw error;
        setSuccess("Podcast created.");
      }
      resetForm();
      await fetchPodcasts();
    } catch (err: any) {
      setError(err.message || "Failed to save podcast.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Podcast) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setArtist(p.artist || "");
    setAudioUrl(p.audio_url || "");
    setDuration(p.duration_seconds != null ? String(p.duration_seconds) : "");
    setStatus(p.status || "draft");
    setPublishedAt(p.published_at ? p.published_at.substring(0, 16) : "");
    setDescription(p.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this podcast? This cannot be undone.");
    if (!ok) return;
    setError(null);
    try {
      const { error } = await supabase.from("podcasts").delete().eq("id", id);
      if (error) throw error;
      setSuccess("Podcast deleted.");
      await fetchPodcasts();
    } catch (err: any) {
      setError(err.message || "Failed to delete podcast.");
    }
  };

  // Moved upload handler inside the component so it can access state
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      // Upload via server route to use service role and centralized policy handling
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/podcasts/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Upload failed with status ${res.status}`);
      }
      const data: { publicUrl?: string; path?: string; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.publicUrl) {
        setAudioUrl(data.publicUrl);
        setSuccess("Audio uploaded successfully. URL set.");
      }

      // Try to read duration from the local file
      try {
        const objectUrl = URL.createObjectURL(file);
        const audioEl = new Audio();
        audioEl.src = objectUrl;
        audioEl.addEventListener(
          "loadedmetadata",
          () => {
            const secs = Math.round(audioEl.duration || 0);
            if (Number.isFinite(secs) && secs > 0) {
              setDuration(String(secs));
            }
            URL.revokeObjectURL(objectUrl);
          },
          { once: true }
        );
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload audio.";
      setUploadError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Podcasts Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_title">Title</label>
              <Input id="p_title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_artist">Artist/Speaker</label>
              <Input id="p_artist" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_audio">Audio URL</label>
              <div className="flex items-center gap-2">
                <Input id="p_audio" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} required placeholder="https://... .mp3" />
                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
                <Button type="button" variant="outline" className="gap-2 shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">You can paste a URL or upload an audio file (uploads to Supabase Storage).</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_duration">Duration (seconds)</label>
              <Input id="p_duration" type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 1458" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_status">Status</label>
              <select
                id="p_status"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="p_published_at">Publish At</label>
              <Input id="p_published_at" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="p_desc">Description</label>
            <Textarea id="p_desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description/notes" />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Podcast"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing Podcasts</h3>
            <Button variant="outline" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading podcasts…</p>
          ) : podcasts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No podcasts found.</p>
          ) : (
            <div className="space-y-3">
              {podcasts.map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-4 bg-card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{p.status}</span>
                      {p.published_at && <span className="text-xs text-muted-foreground">• {p.published_at.substring(0,16).replace('T',' ')}</span>}
                    </div>
                    <p className="font-medium">{p.title}</p>
                    {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{p.artist || 'KGIC'} • {p.duration_seconds ? `${Math.floor(p.duration_seconds/60)}:${String(p.duration_seconds%60).padStart(2,'0')}` : '—:—'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Announcements CRUD component
function AdminAnnouncements() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  type Announcement = {
    id: string;
    title: string;
    body: string | null;
    link_url: string | null;
    pinned: boolean;
    status: string; // draft, published, archived
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
  };

  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [pinned, setPinned] = React.useState(false);
  const [status, setStatus] = React.useState("draft");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setLinkUrl("");
    setPinned(false);
    setStatus("draft");
    setStartsAt("");
    setEndsAt("");
  };

  const fetchAnnouncements = async () => {
    if (!supabase) {
      setError("Supabase not configured. Set env vars.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("starts_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setAnnouncements((data as Announcement[]) || []);
    setLoading(false);
  };

  React.useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload: Partial<Announcement> = {
      title,
      body: body || null,
      link_url: linkUrl || null,
      pinned,
      status,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    } as any;
    try {
      if (editingId) {
        const { error } = await supabase.from("announcements").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Announcement updated.");
      } else {
        const { error } = await supabase.from("announcements").insert(payload);
        if (error) throw error;
        setSuccess("Announcement created.");
      }
      resetForm();
      await fetchAnnouncements();
    } catch (err: any) {
      setError(err.message || "Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title || "");
    setBody(a.body || "");
    setLinkUrl(a.link_url || "");
    setPinned(!!a.pinned);
    setStatus(a.status || "draft");
    setStartsAt(a.starts_at ? a.starts_at.substring(0, 10) : "");
    setEndsAt(a.ends_at ? a.ends_at.substring(0, 10) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this announcement? This cannot be undone.");
    if (!ok) return;
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
      setSuccess("Announcement deleted.");
      await fetchAnnouncements();
    } catch (err: any) {
      setError(err.message || "Failed to delete announcement.");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="a_title">Title</label>
              <Input id="a_title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="a_status">Status</label>
              <select id="a_status" className="w-full rounded-md border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="a_link">Link URL</label>
              <Input id="a_link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/contact or https://…" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="a_starts">Starts</label>
              <Input id="a_starts" type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="a_pinned" type="checkbox" className="h-4 w-4" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
              <label htmlFor="a_pinned" className="text-sm text-muted-foreground">Pin to top</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="a_ends">Ends</label>
              <Input id="a_ends" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="a_body">Details</label>
            <Textarea id="a_body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Announcement"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing Announcements</h3>
            <Button variant="outline" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements found.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-border p-4 bg-card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {a.pinned && <span className="text-xs font-medium text-accent">Pinned</span>}
                      <span className="text-xs text-muted-foreground">{a.status}</span>
                      {a.starts_at && <span className="text-xs text-muted-foreground">• {a.starts_at.substring(0,10)}</span>}
                    </div>
                    <p className="font-medium">{a.title}</p>
                    {a.body && <p className="text-sm text-muted-foreground mt-1">{a.body.slice(0,120)}{a.body.length > 120 ? '…' : ''}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(a)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Ministries CRUD component
function AdminMinistries() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  type Ministry = {
    id: string;
    name: string;
    short_desc: string | null;
    contact_link: string | null;
    status: string; // active, hidden
    created_at: string;
    updated_at: string;
  };

  const [ministries, setMinistries] = React.useState<Ministry[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [shortDesc, setShortDesc] = React.useState("");
  const [contactLink, setContactLink] = React.useState("");
  const [status, setStatus] = React.useState("active");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setShortDesc("");
    setContactLink("");
    setStatus("active");
  };

  const fetchMinistries = async () => {
    if (!supabase) { setLoading(false); return; }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("ministries")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setMinistries((data as Ministry[]) || []);
    setLoading(false);
  };

  React.useEffect(() => { fetchMinistries(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload: Partial<Ministry> = {
      name,
      short_desc: shortDesc || null,
      contact_link: contactLink || null,
      status,
    } as any;
    try {
      if (editingId) {
        const { error } = await supabase.from("ministries").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Ministry updated.");
      } else {
        const { error } = await supabase.from("ministries").insert(payload);
        if (error) throw error;
        setSuccess("Ministry created.");
      }
      resetForm();
      await fetchMinistries();
    } catch (err: any) {
      setError(err.message || "Failed to save ministry.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m: Ministry) => {
    setEditingId(m.id);
    setName(m.name || "");
    setShortDesc(m.short_desc || "");
    setContactLink(m.contact_link || "");
    setStatus(m.status || "active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this ministry? This cannot be undone.");
    if (!ok) return;
    try {
      const { error } = await supabase.from("ministries").delete().eq("id", id);
      if (error) throw error;
      setSuccess("Ministry deleted.");
      await fetchMinistries();
    } catch (err: any) {
      setError(err.message || "Failed to delete ministry.");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Ministries</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="m_name">Name</label>
              <Input id="m_name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="m_status">Status</label>
              <select id="m_status" className="w-full rounded-md border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">active</option>
                <option value="hidden">hidden</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="m_desc">Short Description</label>
            <Textarea id="m_desc" rows={4} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="m_link">Contact Link</label>
            <Input id="m_link" value={contactLink} onChange={(e) => setContactLink(e.target.value)} placeholder="/contact or https://…" />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Ministry"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing Ministries</h3>
            <Button variant="outline" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : ministries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ministries found.</p>
          ) : (
            <div className="space-y-3">
              {ministries.map((m) => (
                <div key={m.id} className="rounded-lg border border-border p-4 bg-card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{m.status}</span>
                    </div>
                    <p className="font-medium">{m.name}</p>
                    {m.short_desc && <p className="text-sm text-muted-foreground mt-1">{m.short_desc}</p>}
                    {m.contact_link && <p className="text-xs text-muted-foreground mt-1">{m.contact_link}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(m)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Groups CRUD component
function AdminGroups() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  type Group = {
    id: string;
    name: string;
    schedule: string | null;
    contact_link: string | null;
    location: string | null;
    status: string; // active, hidden
    created_at: string;
    updated_at: string;
  };

  const [groups, setGroups] = React.useState<Group[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [schedule, setSchedule] = React.useState("");
  const [contactLink, setContactLink] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [status, setStatus] = React.useState("active");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSchedule("");
    setContactLink("");
    setLocation("");
    setStatus("active");
  };

  const fetchGroups = async () => {
    if (!supabase) { setLoading(false); return; }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("small_groups")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setGroups((data as Group[]) || []);
    setLoading(false);
  };

  React.useEffect(() => { fetchGroups(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload: Partial<Group> = {
      name,
      schedule: schedule || null,
      contact_link: contactLink || null,
      location: location || null,
      status,
    } as any;
    try {
      if (editingId) {
        const { error } = await supabase.from("small_groups").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Group updated.");
      } else {
        const { error } = await supabase.from("small_groups").insert(payload);
        if (error) throw error;
        setSuccess("Group created.");
      }
      resetForm();
      await fetchGroups();
    } catch (err: any) {
      setError(err.message || "Failed to save group.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (g: Group) => {
    setEditingId(g.id);
    setName(g.name || "");
    setSchedule(g.schedule || "");
    setContactLink(g.contact_link || "");
    setLocation(g.location || "");
    setStatus(g.status || "active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this group? This cannot be undone.");
    if (!ok) return;
    try {
      const { error } = await supabase.from("small_groups").delete().eq("id", id);
      if (error) throw error;
      setSuccess("Group deleted.");
      await fetchGroups();
    } catch (err: any) {
      setError(err.message || "Failed to delete group.");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Small Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="g_name">Name</label>
              <Input id="g_name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="g_status">Status</label>
              <select id="g_status" className="w-full rounded-md border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">active</option>
                <option value="hidden">hidden</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="g_schedule">Schedule</label>
              <Input id="g_schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Thursdays 7pm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="g_location">Location</label>
              <Input id="g_location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="KGIC Campus" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="g_link">Contact Link</label>
            <Input id="g_link" value={contactLink} onChange={(e) => setContactLink(e.target.value)} placeholder="/contact or https://…" />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Group"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing Groups</h3>
            <Button variant="outline" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No groups found.</p>
          ) : (
            <div className="space-y-3">
              {groups.map((g) => (
                <div key={g.id} className="rounded-lg border border-border p-4 bg-card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{g.status}</span>
                    </div>
                    <p className="font-medium">{g.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{g.schedule || ''}{g.location ? ` • ${g.location}` : ''}</p>
                    {g.contact_link && <p className="text-xs text-muted-foreground mt-1">{g.contact_link}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(g)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(g.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // If auth is not configured, treat as not signed in and redirect
      router.replace("/auth/sign-in");
      setAuthChecked(true);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthed(true);
      } else {
        router.replace("/auth/sign-in");
      }
      setAuthChecked(true);
    });

    // Keep guarding on auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthed(true);
      } else {
        setAuthed(false);
        router.replace("/auth/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!authChecked || !authed) {
    return (
      <div className="min-h-[100svh] bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <AdminTopBar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage content for Morning Prayers, Podcasts, Announcements, Ministries, Small Groups, Events, and the homepage hero.
          </p>
        </div>

        <Tabs defaultValue="prayers">
          <TabsList>
            <TabsTrigger value="prayers" className="gap-2"><FileText className="h-4 w-4" /> Prayers</TabsTrigger>
            <TabsTrigger value="podcasts" className="gap-2"><Mic className="h-4 w-4" /> Podcasts</TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
            <TabsTrigger value="ministries" className="gap-2"><Church className="h-4 w-4" /> Ministries</TabsTrigger>
            <TabsTrigger value="groups" className="gap-2"><Users className="h-4 w-4" /> Groups</TabsTrigger>
            <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
            <TabsTrigger value="hero" className="gap-2"><Image className="h-4 w-4" /> Hero</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="prayers" className="mt-6">
            <AdminPrayers />
          </TabsContent>

          <TabsContent value="podcasts" className="mt-6">
            <AdminPodcasts />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AdminAnnouncements />
          </TabsContent>

          <TabsContent value="ministries" className="mt-6">
            <AdminMinistries />
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <AdminGroups />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Coming soon…
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="mt-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Homepage Hero</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Coming soon…
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                More settings coming soon…
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}