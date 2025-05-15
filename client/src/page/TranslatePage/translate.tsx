import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Volume2, Download, Copy } from "lucide-react";
import axios from "axios";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SignLanguageDetector from "@/model";

// Danh sách ngôn ngữ
const languages = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  vi: "Vietnamese",
};

const TranslatePage: React.FC = () => {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("textToASL");
  const [isListening, setIsListening] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  // const [spokenLanguage, setSpokenLanguage] = useState("en");
  const [signedLanguage] = useState("ase");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [srcLanguage, setSrcLanguage] = useState("en");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/translate") {
      setMode("textToASL");
      setIsListening(false);
      setSoundPlaying(false);
      setText("");
      setVideoSrc(null);
      setError(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setText("");
    setIsListening(false);
    setSoundPlaying(false);
    setVideoSrc(null);
    setError(null);
  }, [mode]);

  const handleVoiceInputClick = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Giả lập nhận diện giọng nói
      setTimeout(() => {
        setText("Hello, how are you?");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSoundClick = () => {
    setSoundPlaying((prev) => !prev);
    if (!soundPlaying && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = srcLanguage;
      utterance.onend = () => setSoundPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  const spokenToSigned = (
    text: string,
    spokenLanguage: string,
    signedLanguage: string
  ) => {
    const api =
      "https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose";
    return `${api}?text=${encodeURIComponent(
      text
    )}&spoken=${spokenLanguage}&signed=${signedLanguage}`;
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    setError(null);

    if (newText.trim()) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/translate-text",
          {
            text: newText,
            dest: "en",
          }
        );
        const data = response.data as { langCode: string; translation: string };
        console.log("API response:", data);

        if (data.langCode !== srcLanguage) {
          setDetectedLanguage(data.langCode);
          setVideoSrc(null);
        } else {
          setDetectedLanguage(null);
          // Gọi API để lấy pose data
          const url = spokenToSigned(data.translation, "en", signedLanguage);
          console.log("URL:", url);
          try {
            const poseResponse = await axios.get(url);
            // console.log("Pose response:", poseResponse.data);
            if (poseResponse.data) {
              setVideoSrc(url);
              // console.log("Video source:", videoSrc);
            }
          } catch (error) {
            console.error("Error fetching pose data:", error);
            setError("Failed to generate sign language animation.");
          }
        }
      } catch (error) {
        console.error("Translation error:", error);
        setError("Failed to translate text. Please check the backend server.");
        setVideoSrc(null);
      }
    } else {
      setVideoSrc(null);
      setDetectedLanguage(null);
    }
  };

  const handleSuggestion = () => {
    if (detectedLanguage) {
      setSrcLanguage(detectedLanguage);
      setDetectedLanguage(null);
      // Kích hoạt lại dịch với ngôn ngữ mới
      handleTextChange({
        target: { value: text },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDownloadPose = async () => {
    if (videoSrc) {
      try {
        const response = await axios.get(videoSrc, { responseType: "blob" });
        const poseFile = new File([response.data], "pose.pose", {
          type: "application/octet-stream",
        });
        const formData = new FormData();
        formData.append("pose", poseFile);
        const drawResponse = await axios.post(
          "http://127.0.0.1:5000/draw_pose",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob",
          }
        );
        const videoBlob = drawResponse.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        const fileName = `${text.trim() || "translated"}.mp4`;
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(videoUrl);
      } catch (error) {
        console.error("Error downloading pose file:", error);
        setError("Failed to download video. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://i.pinimg.com/736x/8b/b4/33/8bb433233a9176ea6cb01298f18a0035.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="sticky top-0 z-50 flex items-center justify-between bg-transparent backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 shadow-none">
          <SidebarTrigger className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 rounded-full p-2 shadow-md size-10" />
          <h1 className="text-2xl font-bold text-white">Translate</h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <div className="flex space-x-4 mb-6">
            <Button
              className={`flex items-center space-x-2 ${
                mode === "textToASL"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setMode("textToASL")}
            >
              <span>Translate Text to ASL</span>
            </Button>
            <Button
              className={`flex items-center space-x-2 ${
                mode === "ASLToText"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setMode("ASLToText")}
            >
              <span>Translate ASL to Text</span>
            </Button>
          </div>

          {mode === "textToASL" ? (
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <div className="flex justify-between mb-3 space-x-2">
                  <select
                    value={srcLanguage}
                    onChange={(e) => {
                      setSrcLanguage(e.target.value);
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    title="Select source language"
                    aria-label="Select source language"
                  >
                    {Object.entries(languages).map(([langCode, langName]) => (
                      <option key={langCode} value={langCode}>
                        {langName}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  placeholder="Enter text here..."
                  value={text}
                  onChange={handleTextChange}
                />
                {detectedLanguage && (
                  <div
                    className="mt-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={handleSuggestion}
                  >
                    Translate from:{" "}
                    {languages[detectedLanguage as keyof typeof languages]}
                  </div>
                )}
                <div className="flex space-x-4 mt-4">
                  <Button
                    className={`p-3 ${
                      isListening
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={handleVoiceInputClick}
                  >
                    <Mic className="w-6 h-6" />
                  </Button>
                  <Button
                    className={`p-3 ${
                      soundPlaying
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={handleSoundClick}
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-gray-100 rounded-lg p-6 border border-gray-300">
                <div className="flex justify-between mb-3">
                  <span className="flex-1 p-2 border bg-white border-gray-300 rounded-md text-center text-gray-800">
                    Sign Language
                  </span>
                </div>
                <div className="h-[320px] bg-white rounded-lg p-4 border border-gray-300 flex justify-center items-center">
                  {videoSrc ? (
                    <pose-viewer
                      src={videoSrc}
                      width="100%"
                      loop={true}
                      autoplay={true}
                    />
                  ) : (
                    <p className="text-gray-500">
                      Translated output will appear here.
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    className="p-3 bg-gray-200 text-gray-800"
                    onClick={handleDownloadPose}
                  >
                    <Download className="w-6 h-6" />
                  </Button>
                  <Button className="p-3 bg-gray-200 text-gray-800">
                    <Copy className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-300 text-center">
              <p className="text-gray-500">
                <SignLanguageDetector />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
