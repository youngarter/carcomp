"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading2, List, ListOrdered, Link as LinkIcon, ImageIcon, Check } from "lucide-react";

interface TipTapEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: "Rédigez votre article ici...",
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-4 text-zinc-900",
            },
        },
    });

    if (!editor) {
        return <div className="min-h-[300px] border border-zinc-200 rounded-xl bg-zinc-50 animate-pulse" />;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt("URL de l'image");

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 bg-zinc-50">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button
                    type="button"
                    onClick={setLink}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive("link") ? "bg-emerald-100 text-emerald-700" : "text-zinc-600 hover:bg-zinc-200"}`}
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="p-2 text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>
            <EditorContent editor={editor} className="border-none" />
        </div>
    );
}
