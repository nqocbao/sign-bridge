import { useState, useEffect } from "react";

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition is not supported in this browser");
      return;
    }
  }, []);

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const stopListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.stop();
      setIsListening(false);
    }
  };

  const resetText = () => {
    setText("");
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
  };
};

export default useSpeechRecognition;
