"use client";
import React from "react";
import { MessageSquare } from "lucide-react";

const Chatbot = () => {
    return (
        <div className="fixed bottom-8 right-8 z-50">
            <button className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-emerald-700 transition-all">
                <MessageSquare className="w-6 h-6" />
            </button>
        </div>
    );
};

export default Chatbot;
