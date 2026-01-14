"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Copy, Linkedin, FileText, Loader2, Check } from "lucide-react";

export default function Home() {
    const [idea, setIdea] = useState("");
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ linkedin: string; blog: string } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea) return;
        setLoading(true);
        try {
            const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || "https://n8n.tu-instancia.com/webhook/content-creator";
            const response = await fetch(n8nUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea, contexto: context }),
            });
            const data = await response.json();
            setResults({
                linkedin: data.linkedin_post,
                blog: data.blog_post,
            });
        } catch (error) {
            console.error("Error:", error);
            // Simulación para demo si falla la conexión
            /*
            setResults({
              linkedin: "Este es un post de ejemplo para LinkedIn generado por Cerebro...",
              blog: "Este es un artículo de blog estructurado con SEO y profundidad..."
            });
            */
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <main className="min-h-screen p-6 md:p-24 flex flex-col items-center bg-black">
            <div className="w-full max-w-4xl space-y-8 flex flex-col">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Cerebro <span className="gradient-text">Creator</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Transforma tus ideas en contenido profesional con la potencia de Gemini 3 Flash y tu ADN de marca.
                    </p>
                </div>

                {/* Form Section */}
                <div className="glass-card rounded-3xl p-8 space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300 ml-1">Tu idea central</label>
                        <textarea
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="¿Sobre qué quieres escribir hoy?"
                            className="w-full h-32 glass-input rounded-2xl p-4 text-white resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300 ml-1">Contexto adicional (Opcional)</label>
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Ej: Tono profesional, enfocado en tecnología..."
                            className="w-full h-12 glass-input rounded-xl px-4 text-white"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !idea}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            <>
                                Generar Magia <Sparkles className="group-hover:rotate-12 transition-transform h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <AnimatePresence>
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {/* LinkedIn Post */}
                            <div className="glass-card rounded-3xl p-6 space-y-4 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Linkedin className="h-5 w-5" />
                                        <span className="font-semibold uppercase tracking-wider text-xs">LinkedIn Post</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(results.linkedin, 'linkedin')}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {copied === 'linkedin' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                                <div className="text-gray-200 text-sm whitespace-pre-wrap selection:bg-brand-primary/30 h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {results.linkedin}
                                </div>
                            </div>

                            {/* Blog Article */}
                            <div className="glass-card rounded-3xl p-6 space-y-4 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <FileText className="h-5 w-5" />
                                        <span className="font-semibold uppercase tracking-wider text-xs">Blog Article</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(results.blog, 'blog')}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {copied === 'blog' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                                <div className="text-gray-200 text-sm whitespace-pre-wrap selection:bg-brand-secondary/30 h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {results.blog}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
