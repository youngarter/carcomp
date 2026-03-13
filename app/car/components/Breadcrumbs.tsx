import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
    }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span>Accueil</span>
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <Link
                        href={item.href}
                        className={`hover:text-zinc-900 transition-colors ${index === items.length - 1 ? "text-zinc-900 font-semibold" : ""}`}
                    >
                        {item.label}
                    </Link>
                </React.Fragment>
            ))}
        </nav>
    );
}
