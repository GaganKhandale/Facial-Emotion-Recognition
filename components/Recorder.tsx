// components/Recorder.tsx -- dont remove this comment

"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface RecorderProps {
  questionIndex: number;
  questionText: string;
  onComplete: (questionIndex: number, summary: any) => void;
}

export default function Recorder({ questionIndex, questionText, onComplete }: RecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);

  // Setup camera + mic
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        toast.error("Camera/microphone access denied");
      }
    }
    setupCamera();
  }, []);

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (!stream) return toast.error("Camera not ready");

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunksArray: Blob[] = [];
    recorder.ondataavailable = (e) => chunksArray.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunksArray, { type: "video/webm" });
      const file = new File([blob], `q${questionIndex + 1}.mp4`, { type: "video/mp4" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question_index", String(questionIndex + 1));

      toast.loading("Uploading & analyzing...", { id: "upload" });
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload_video/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Analysis complete!", { id: "upload" });
        onComplete(questionIndex, {
          summary: res.data.summary,
          transcript: res.data.transcript,
        });

      } catch (err) {
        toast.error("Upload failed", { id: "upload" });
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setChunks([]);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-80 h-60 rounded-lg border mb-4 bg-black"
      />
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          🎥 Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          ⏹ Stop Recording
        </button>
      )}
    </div>
  );
}
