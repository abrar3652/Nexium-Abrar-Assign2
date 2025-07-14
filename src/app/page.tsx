"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

// ✅ Define the expected structure of API response
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
      const error = err as Error; // ✅ Safe cast
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 font-sans">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8 drop-shadow-md"
      >
        Blog Summarizer Pro
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-200"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter blog URL (e.g., https://example.com)"
              className="w-full p-3 md:p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-center mt-4 bg-red-100 p-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{result.title}</h2>
                <p className="text-gray-600"><strong>Summary:</strong> {result.summary}</p>
                <p className="text-gray-600"><strong>Urdu Summary:</strong> {result.urduSummary}</p>
                <details className="mt-2">
                  <summary className="text-blue-500 cursor-pointer hover:underline">Show Full Text</summary>
                  <p className="text-gray-500 mt-2">{result.fullText}</p>
                </details>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
