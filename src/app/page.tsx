"use client";

import { useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

type ResultType = {
  title: string;
  summary: string;
  urduSummary: string;
  fullText: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 p-4 md:p-6 font-sans text-gray-800">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 drop-shadow-lg"
      >
        Blog Summarizer Elite
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border-l-4 border-gradient-to-r from-teal-400 to-indigo-400"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter blog URL (e.g., https://example.com)"
              className="w-full p-4 border-2 border-teal-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all duration-300 placeholder-teal-300 text-lg"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(45, 212, 191, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-5 py-3 rounded-lg hover:from-teal-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <FaSpinner className="animate-spin text-xl" /> : <FaCheckCircle className="text-xl" />}
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 bg-red-100 p-3 rounded-xl mt-6 text-center font-medium"
            >
              {error}
            </motion.p>
          )}
          {result && (
            <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="mt-8 space-y-6">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl p-6 border-l-4 border-gradient-to-r from-teal-300 to-indigo-300 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-indigo-700">
                  {result.title}
                </h2>
                <p className="text-gray-700 mb-3">
                  <strong>Summary:</strong> {result.summary}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Urdu Summary:</strong> {result.urduSummary}
                </p>
                <details className="mt-3">
                  <summary className="text-indigo-500 font-semibold cursor-pointer hover:text-indigo-700 transition-colors duration-300">
                    Expand Full Text
                  </summary>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-gray-600 mt-2 overflow-auto max-h-40 p-2 bg-gray-50 rounded">
                    {result.fullText}
                  </motion.p>
                </details>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
