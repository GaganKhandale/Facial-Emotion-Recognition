// components/QuestionPlayer.tsx -- dont remove this comment
"use client";
import { useEffect } from "react";

export default function QuestionPlayer({ question }: { question: string }) {
  useEffect(() => {
    const utter = new SpeechSynthesisUtterance(question);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }, [question]);

  return (
    <div className="text-center mb-4">
      <h2 className="text-xl font-semibold text-gray-700">Question:</h2>
      <p className="text-lg mt-2 text-gray-800">{question}</p>
    </div>
  );
}
