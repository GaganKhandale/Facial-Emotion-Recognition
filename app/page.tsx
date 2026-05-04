// page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Recorder from "@/components/Recorder";
import Summary from "@/components/Summary";
import QuestionPlayer from "@/components/QuestionPlayer";

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?"
  ]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [started, setStarted] = useState(false);

  // Optional: fetch questions dynamically
  // useEffect(() => {
  //   axios.get(`${process.env.NEXT_PUBLIC_API_URL}/questions`)
  //     .then(res => setQuestions(res.data.questions))
  //     .catch(() => toast.error("Failed to load questions"));
  // }, []);

  const handleUploadResult = (questionIndex: number, result: any) => {
  setResults((prev) => [...prev, { questionIndex, ...result }]);
  if (current < questions.length - 1) {
    setCurrent((prev) => prev + 1);
  } else {
    toast.success("✅ Interview completed!");
  }
};


  // --- Summary view ---
  if (results.length === questions.length) {
    return <Summary questions={questions} results={results} />;
  }

  // --- Start screen ---
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Toaster />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Facial Emotion Analysis for AI-Driven Interviews
        </h1>
        <p className="mb-6 text-gray-600 max-w-lg text-center">
          Click below to start the AI interview. The system will ask each question aloud, record your video and analyze your emotions.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
        >
          🚀 Start Interview
        </button>
      </div>
    );
  }

  // --- Interview in progress ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        AI-Driven Interview
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl">
        <QuestionPlayer question={questions[current]} />
        <Recorder
          questionIndex={current}
          questionText={questions[current]}
          onComplete={handleUploadResult}
        />
      </div>
    </div>
  );
}
