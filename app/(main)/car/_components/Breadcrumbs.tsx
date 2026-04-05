import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    // JSON-LD BreadcrumbList for SEO
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://autoadvisor.ma/",
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.label,
                ...(item.href !== "#" && { item: `https://autoadvisor.ma${item.href}` }),
            })),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <nav
                aria-label="Fil d'ariane"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide"
            >
                <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1 flex-shrink-0">
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Accueil</span>
                </Link>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <React.Fragment key={index}>
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-zinc-300" />
                            {isLast ? (
                                <span
                                    aria-current="page"
                                    className="text-zinc-900 font-semibold truncate max-w-[120px] sm:max-w-none"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-zinc-900 transition-colors truncate max-w-[100px] sm:max-w-none"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>
        </>
    );
}
