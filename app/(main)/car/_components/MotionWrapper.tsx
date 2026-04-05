"use client";

import { motion } from "framer-motion";
import React from "react";

interface MotionWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export default function MotionWrapper({ children, className }: MotionWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
