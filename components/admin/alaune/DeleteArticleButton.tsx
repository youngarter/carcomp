"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/lib/actions/alaune.actions";

interface DeleteArticleButtonProps {
    articleId: string;
}

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
    const handleDelete = async () => {
        if (!confirm("Voulez-vous vraiment supprimer cet article ?")) {
            return;
        }

        try {
            const result = await deleteArticle(articleId);
            if (result.success) {
                // Since this might not trigger a revalidatePath from client directly 
                // easily without extra steps, we can rely on the server action's 
                // revalidatePath OR use router.refresh()
                window.location.reload(); // Simple and effective for admin panel
            } else {
                alert(result.error || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Une erreur est survenue lors de la suppression");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Supprimer"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
