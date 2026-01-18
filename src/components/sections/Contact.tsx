'use client';

import { useState } from 'react';
import { Mail, Send, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { databases, isAppwriteConfigured } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAppwriteConfigured()) {
        setStatus('error');
        setErrorMessage("Appwrite is not configured in environment variables.");
        return;
    }

    setStatus('sending');

    try {
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'portfolio';
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'messages';

        await databases.createDocument(
            dbId,
            collectionId,
            ID.unique(),
            {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                created_at: new Date().toISOString()
            }
        );
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
    } catch (error) {
        console.error("Submission error:", error);
        setStatus('error');
        setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none pt-20">
      <div className="max-w-4xl w-full pointer-events-auto glass-panel p-8 md:p-12 rounded-3xl shadow-2xl">
         <div className="flex flex-col md:flex-row gap-12">

            {/* Contact Info */}
            <div className="flex-1 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Get in touch</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Have a project in mind? Let&apos;s build something extraordinary together.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</div>
                            <div className="text-slate-900 dark:text-white font-medium">hello@nexus.dev</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-500">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</div>
                            <div className="text-slate-900 dark:text-white font-medium">San Francisco, CA</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-500">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Availability</div>
                            <div className="text-emerald-600 dark:text-emerald-500 font-medium">Open for opportunities</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Name</label>
                     <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
                        placeholder="John Doe"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                     <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
                        placeholder="john@example.com"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Message</label>
                     <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
                        placeholder="Tell me about your project..."
                     />
                   </div>

                   {status === 'error' && (
                       <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-2 rounded">
                           <AlertCircle className="w-4 h-4" />
                           {errorMessage}
                       </div>
                   )}

                   {status === 'success' ? (
                        <div className="w-full bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                            Message Sent <CheckCircle className="w-4 h-4" />
                        </div>
                   ) : (
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                            {status === 'sending' ? (
                                <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                            ) : (
                                <>Send Message <Send className="w-4 h-4" /></>
                            )}
                        </button>
                   )}
                </form>
            </div>

         </div>
      </div>
    </section>
  );
}
