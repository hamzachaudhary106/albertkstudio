import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, FolderOpen, Trash2, Upload } from "lucide-react";
import { supabase, uploadImage } from "./adminClient";
import { Button, Card, EmptyState, Modal, PageHeader, SearchInput, Spinner } from "./ui";
import { useToast } from "./store";
import { logActivity } from "./lib";

const FOLDERS = ["uploads", "services", "gallery_items", "team_members", "reviews", "faqs"];

export type MediaItem = { name: string; path: string; url: string; folder: string; size: number; updatedAt: string };

function publicUrl(path: string): string {
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export async function listAllMedia(): Promise<MediaItem[]> {
  const out: MediaItem[] = [];
  const seen = new Set<string>();
  const folders = ["", ...FOLDERS];
  await Promise.all(
    folders.map(async (folder) => {
      try {
        const { data } = await supabase.storage.from("media").list(folder || undefined, {
          limit: 200,
          sortBy: { column: "created_at", order: "desc" },
        });
        for (const f of data ?? []) {
          // Skip folder placeholders (no metadata) and non-images.
          if (!f.id || !f.metadata) continue;
          const path = folder ? `${folder}/${f.name}` : f.name;
          if (seen.has(path)) continue;
          seen.add(path);
          out.push({
            name: f.name,
            path,
            url: publicUrl(path),
            folder: folder || "root",
            size: (f.metadata?.size as number) ?? 0,
            updatedAt: (f.updated_at as string) ?? (f.created_at as string) ?? "",
          });
        }
      } catch {
        /* folder may not exist */
      }
    }),
  );
  return out.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
}

function fmtSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function MediaGrid({
  items,
  onSelect,
  selectedUrl,
  onDelete,
}: {
  items: MediaItem[];
  onSelect?: (item: MediaItem) => void;
  selectedUrl?: string;
  onDelete?: (item: MediaItem) => void;
}) {
  const { notify } = useToast();
  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    notify("Image URL copied to clipboard");
  };
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.path}
          className={`group relative overflow-hidden rounded-xl border bg-white transition ${
            selectedUrl === item.url ? "border-[#2271b1] ring-2 ring-[#2271b1]/30" : "border-neutral-200"
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className={`block aspect-square w-full overflow-hidden bg-neutral-100 ${onSelect ? "cursor-pointer" : "cursor-default"}`}
          >
            <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
          </button>
          {selectedUrl === item.url && (
            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#2271b1] text-white">
              <Check size={14} />
            </span>
          )}
          <div className="flex items-center gap-1 px-2.5 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-neutral-700">{item.name}</p>
              <p className="text-[10px] text-neutral-400">
                {item.folder} · {fmtSize(item.size)}
              </p>
            </div>
            <button
              onClick={() => copy(item.url)}
              className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              title="Copy URL"
            >
              <Copy size={14} />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable picker (used by content forms)                             */
/* ------------------------------------------------------------------ */

export function MediaPicker({
  open,
  onClose,
  onSelect,
  folder = "uploads",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
}) {
  const { notify } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await listAllMedia());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      notify("Image uploaded");
      await load();
      setSel(url);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Media Library"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!sel}
            onClick={() => {
              onSelect(sel);
              onClose();
            }}
          >
            Use selected image
          </Button>
        </>
      }
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search images…" className="flex-1" />
        <Button variant="secondary" loading={uploading} onClick={() => fileRef.current?.click()}>
          <Upload size={15} /> Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen size={20} />} title="No images found" description="Upload an image to get started." />
      ) : (
        <MediaGrid items={filtered} selectedUrl={sel} onSelect={(it) => setSel(it.url)} />
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Full page                                                           */
/* ------------------------------------------------------------------ */

export default function MediaLibrary() {
  const { notify } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await listAllMedia());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) await uploadImage(file, "uploads");
      notify(`${files.length} image${files.length > 1 ? "s" : ""} uploaded`);
      await logActivity({ action: "uploaded", entity: "media", label: `${files.length} file(s)` });
      await load();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    const { error } = await supabase.storage.from("media").remove([item.path]);
    if (error) {
      notify(error.message, "error");
      return;
    }
    setItems((cur) => cur.filter((i) => i.path !== item.path));
    notify("Image deleted");
    await logActivity({ action: "deleted", entity: "media", label: item.name });
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="All images uploaded across your website"
        action={
          <Button loading={uploading} onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Upload
          </Button>
        }
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />

      <Card className="mb-4 p-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search by file name…" />
      </Card>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={22} />}
          title={q ? "No matching images" : "Your library is empty"}
          description={q ? "Try a different search term." : "Upload images to use across services, gallery, team, and more."}
          action={!q && <Button onClick={() => fileRef.current?.click()}><Upload size={15} /> Upload image</Button>}
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-neutral-400">{filtered.length} images</p>
          <MediaGrid items={filtered} onDelete={remove} />
        </>
      )}
    </div>
  );
}
