"use client";

import React, { useState, useEffect } from "react";
import {
    Image as ImageIcon,
    Trash2,
    Copy,
    Check,
    Search,
    Filter,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    RefreshCw
} from "lucide-react";

interface MediaFile {
    url: string;
    name: string;
    size: number;
    mtime: string;
}

export default function MediaLibrary() {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                const data = await res.json();
                setMedia(data);
            } else {
                setMessage({ text: "Erreur lors du chargement de la bibliothèque", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Impossible de contacter le serveur", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

        try {
            const res = await fetch("/api/admin/media", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });

            if (res.ok) {
                setMessage({ text: "Image supprimée avec succès", type: "success" });
                setMedia(media.filter(m => m.url !== url));
            } else {
                const data = await res.json();
                setMessage({ text: data.error || "Erreur lors de la suppression", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Erreur de connexion", type: "error" });
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const filteredMedia = media.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.url.toLowerCase().includes(search.toLowerCase())
    );

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="p-12">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Contenus Multimédia</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
                        Bibliothèque Media
                    </h1>
                    <p className="text-zinc-500 font-medium italic">Gérez les visuels et ressources de la plateforme.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchMedia}
                        disabled={loading}
                        className="p-4 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-emerald-600 hover:border-emerald-100 transition-all group"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
                    </button>
                    <div className="relative group max-w-xs">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>
            </header>

            {message && (
                <div className={`mb-8 p-6 rounded-3xl flex items-center justify-between border animate-in fade-in slide-in-from-top-4 ${message.type === "success" ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" : "bg-red-50/50 border-red-100 text-red-800"}`}>
                    <div className="flex items-center gap-4">
                        {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm tracking-tight">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)} className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100">Fermer</button>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                        <div key={i} className="aspect-square bg-white border border-zinc-50 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="bg-white border border-dashed border-zinc-200 rounded-[40px] p-24 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-8 h-8 text-zinc-200" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-2">Aucun média trouvé</h3>
                    <p className="text-zinc-400 font-medium">Les fichiers téléchargés apparaîtront ici.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredMedia.map((file, i) => (
                        <div key={i} className="group bg-white rounded-[32px] border border-zinc-100 p-3 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 relative mb-4">
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto">
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors"
                                        title="Copier l'URL"
                                    >
                                        {copiedUrl === file.url ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                                        title="Voir l'image"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-xs font-black text-zinc-900 truncate leading-tight flex-1" title={file.name}>{file.name}</p>
                                    <button
                                        onClick={() => handleDelete(file.url)}
                                        className="text-zinc-200 hover:text-red-600 transition-colors p-1"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{formatSize(file.size)}</span>
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{new Date(file.mtime).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
