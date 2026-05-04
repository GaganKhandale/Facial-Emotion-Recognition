// components/Summary.tsx -- updated
"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface SummaryProps {
  questions: string[];
  results: {
    questionIndex: number;
    summary: Record<string, number>;
    transcript: string;
  }[];
}

export default function Summary({ questions, results }: SummaryProps) {
  const overall = { Angry: 0, Happy: 0, Neutral: 0, Sad: 0, Surprise: 0 };

  results.forEach((r) => {
    for (const emo in r.summary) {
      overall[emo as keyof typeof overall] += r.summary[emo];
    }
  });

  for (const emo in overall) {
    overall[emo as keyof typeof overall] = +(
      overall[emo as keyof typeof overall] / results.length
    ).toFixed(2);
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-400">
        🎯 Interview Summary
      </h1>

      {/* Overall Emotion Distribution */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-10 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-gray-200">
          Overall Emotion Distribution
        </h2>
        <Bar
          data={{
            labels: Object.keys(overall),
            datasets: [
              {
                label: "Emotion %",
                data: Object.values(overall),
                backgroundColor: "rgba(0, 162, 255, 0.6)",
                borderColor: "rgba(0, 162, 255, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "white" },
                grid: { color: "#333" },
              },
              x: {
                ticks: { color: "white" },
                grid: { color: "#333" },
              },
            },
          }}
        />
      </div>

      {/* Question-wise summary */}
      {results.map((res, idx) => (
        <div
          key={idx}
          className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-300">
            Q{idx + 1}: {questions[res.questionIndex]}
          </h3>

          <Bar
            data={{
              labels: Object.keys(res.summary),
              datasets: [
                {
                  label: "Emotion %",
                  data: Object.values(res.summary),
                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                  borderColor: "rgba(255, 159, 64, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: "white" },
                  grid: { color: "#333" },
                },
                x: {
                  ticks: { color: "white" },
                  grid: { color: "#333" },
                },
              },
            }}
          />

          {/* Transcript */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-gray-300 mb-2">🗣 Transcript</h4>
            <p className="text-gray-200 leading-relaxed">
              {res.transcript || "No speech detected."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
