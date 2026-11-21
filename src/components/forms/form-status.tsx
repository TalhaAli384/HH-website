"use client";


import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function FormStatus({ status, message }: { status: "idle" | "success" | "error"; message?: string }) {
  return (
    <AnimatePresence>
      {status !== "idle" && message && (
        <motion.div
          role={status === "error" ? "alert" : "status"}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={
            status === "success"
              ? "flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
              : "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          }
        >
          {status === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <p className="text-sm leading-relaxed">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

// Off-screen honeypot; humans never see or fill it.
export function Honeypot({ register }: { register: object }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}
