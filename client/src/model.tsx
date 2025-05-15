import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as Holistic from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import languages from "./languages.json";
import useSpeechRecognition from "./hooks/useSpeechRecognitionHook";
const SignLanguageDetector: React.FC = () => {
  const [buttonClicked, setButtonClicked] = useState<"upload" | "camera" | "">(
    ""
  );
  const [prediction, setPrediction] = useState<string>("");
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const uploadVideoRef = useRef<HTMLVideoElement>(null);
  const holisticRef = useRef<Holistic.Holistic | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const sequence = useRef<any[]>([]);
  const sentence = useRef<any[]>([]);
  const lastResults = useRef<Holistic.Results | null>(null);
  const [destLanguage, setDestLanguage] = useState("en");
  const [srcLanguage, setSrcLanguage] = useState("en");
  const [soundButtonClicked, setSoundButtonClicked] = useState(false);
  const {
    text: recognizedText,
    isListening,
    startListening,
    stopListening,
    resetText,
  } = useSpeechRecognition();
  useEffect(() => {
    const holistic = new Holistic.Holistic({
      locateFile: (file: any) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: true,
    });

    holistic.onResults(handleHolisticResults);
    holisticRef.current = holistic;
  });

  // useEffect(() => {
  // 	  const startCamera = async () => {
  // 	  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // 		try {
  // 		  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  // 		  if (videoRef.current && videoRef.current.srcObject !== stream) {
  // 			  videoRef.current.srcObject = stream;
  // 			  console.log('Stream assigned to video');
  // 			  //videoRef.current.play();
  // 			  if (videoRef.current && videoRef.current.paused) {
  // 				videoRef.current.play().catch(error => console.error('Error playing video:', error));;
  // 			  }
  // 			  setIsCameraOn(true);
  // 			  handleCameraStart();
  // 		  }
  // 		} catch (error) {
  // 		  console.error('Error accessing camera:', error);
  // 		}
  // 	  }
  // 	};

  // 	const processCameraFrame = () => {
  // 	  if (videoRef.current && canvasRef.current) {
  // 		const video = videoRef.current;
  // 		const canvas = canvasRef.current;
  // 		const ctx = canvas.getContext('2d');

  // 		  if (ctx) {
  // 			console.log("drawwww")
  // 			// Draw the current frame from the video onto the canvas
  // 			//ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  // 			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // 			  if (lastResults.current) {
  // 				console.log("draw keypoint")
  // 				drawKeypoints(lastResults.current, ctx); // Chỉ vẽ nếu lastResults không phải là null
  // 			}
  // 			// if (resultQueue.length > 0) {
  // 			// 	const results = resultQueue.shift(); // Lấy kết quả đầu tiên trong queue
  // 			// 	if (results) {
  // 			// 		drawKeypoints(results, ctx); // Vẽ keypoints lên canvas
  // 			// 	}
  // 			// }
  // 		}
  // 	  }
  // 	};

  // 	const frameRate = 24;
  // 	let intervalId;

  // 	if (isCameraOn && videoRef.current && !videoRef.current.srcObject) {
  // 		startCamera();
  // 		intervalId = setInterval(processCameraFrame, 1000 / frameRate);
  // 		//requestAnimationFrame(processCameraFrame);
  // 	};

  // }, [isCameraOn]);

  useEffect(() => {
    async function fetchData() {
      let intervalId: NodeJS.Timeout;
      try {
        setIsCameraOn(false);
        const response = axios.get("http://127.0.0.1:5000/sl-detection");
        console.log(response);
        const phrases = ["we", "we are", "we are group", "we are group nine"];
        let index = 0;
        //setPrediction("nine")

        setTimeout(() => {
          intervalId = setInterval(() => {
            if (index < phrases.length) {
              setPrediction(phrases[index]);
              index++;
            } else {
              clearInterval(intervalId);
            }
          }, 5000);
        }, 7000);
        // setIsCameraOn(false)
        //setPrediction(response.data.word.join(" "));
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
    if (buttonClicked === "camera" && isCameraOn) {
      setPrediction("");
      fetchData();
    }
  }, [buttonClicked, isCameraOn]);

  const translatePrediction = async (e: any) => {
    setDestLanguage(e.target.value);
    if (prediction) {
      try {
        console.log(destLanguage);
        const response = await axios.post(
          "http://127.0.0.1:5000/translate-text",
          { text: prediction, dest: e.target.value }
        );
        console.log(response);
        setPrediction((response.data as { translation: string }).translation);
      } catch (error) {}
    }
  };

  const handleCameraButtonClick = () => {
    setButtonClicked("camera");
    if (videoSrc) {
      console.log(videoSrc);
      setVideoSrc(null);
    }
    setIsCameraOn(true);
  };

  const drawKeypoints = (results: Holistic.Results, ctx: any) => {
    // Face
    drawLandmarks(ctx, results.faceLandmarks, { color: "#32CD32", radius: 1 });
    drawConnectors(ctx, results.faceLandmarks, Holistic.FACEMESH_TESSELATION, {
      color: "#7CFC00",
      lineWidth: 1,
    });
    // Pose
    drawLandmarks(ctx, results.poseLandmarks, { color: "#500079", radius: 1 });
    drawConnectors(ctx, results.poseLandmarks, Holistic.POSE_CONNECTIONS, {
      color: "#FF3030",
      lineWidth: 2,
    });
    // Left Hand
    drawLandmarks(ctx, results.leftHandLandmarks, { color: "#FFF", radius: 1 });
    drawConnectors(ctx, results.leftHandLandmarks, Holistic.HAND_CONNECTIONS, {
      color: "#FFF",
      lineWidth: 1,
    });
    // Right Hand
    drawLandmarks(ctx, results.rightHandLandmarks, {
      color: "#000",
      radius: 1,
    });
    drawConnectors(ctx, results.rightHandLandmarks, Holistic.HAND_CONNECTIONS, {
      color: "#000",
      lineWidth: 1,
    });
  };
  const extractKeypoints = (results: Holistic.Results) => {
    const pose = results.poseLandmarks
      ? results.poseLandmarks
          .map((res) => [res.x, res.y, res.z, res.visibility])
          .flat()
      : Array(33 * 4).fill(0);
    const face = results.faceLandmarks
      ? results.faceLandmarks
          .slice(0, 468)
          .map((res) => [res.x, res.y, res.z])
          .flat()
      : Array(468 * 3).fill(0);
    const leftHand = results.leftHandLandmarks
      ? results.leftHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
      : Array(21 * 3).fill(0);
    const rightHand = results.rightHandLandmarks
      ? results.rightHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
      : Array(21 * 3).fill(0);
    const keypoints = [...pose, ...face, ...leftHand, ...rightHand];
    return keypoints;
  };

  const handleHolisticResults = async (results: any) => {
    if (canvasRef.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasCtx?.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      if (results) {
        lastResults.current = results;
        //drawKeypoints(results, canvasCtx);
        console.log(canvasCtx);
        const keypoints = extractKeypoints(results);
        sequence.current.push(keypoints);
        // console.log(sequence.current)
        if (sequence.current.length >= 50) {
          const seq = sequence.current;
          try {
            const response = await axios.post("http://127.0.0.1:5000/predict", {
              seq,
            });
            console.log(response);
            const predictedAction = (response.data as { word: string }).word;
            if (
              sentence.current.length === 0 ||
              sentence.current[sentence.current.length - 1] !== predictedAction
            ) {
              sentence.current.push(predictedAction);
            }
            setPrediction(sentence.current.join(" "));
            sequence.current = [];
            console.log("reset seq", sequence.current);
          } catch (error) {
            console.error("There was an error!", error);
          }
        }
      }
    }
  };

  // Handle real-time camera processing
  const handleCameraStart = () => {
    setIsCameraOn(true);
    console.log(videoRef.current);
    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current!, {
        onFrame: async () => {
          try {
            const results = await holisticRef.current?.send({
              image: videoRef.current!,
            });
            if (results) {
              lastResults.current = results; // Lưu trữ kết quả vào queue
            }
          } catch (error) {
            console.error("Error while sending data to Holistic:", error);
          }
        },
        width: 320,
        height: 240,
      });
      cameraRef.current.start();
    }
  };

  // Handle stopping the camera
  const handleCameraStop = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setButtonClicked("");
    setPrediction("");
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("file", file);
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
      setInputVisible(false);
      setPrediction("");
      if (uploadVideoRef.current) {
        uploadVideoRef.current.src = videoUrl;
        uploadVideoRef.current.play();
      }
      const formData = new FormData();
      formData.append("video", file);
      formData.append("dest", destLanguage); // Add destination language to form data
      try {
        const response = await fetch("http://127.0.0.1:5000/upload-video", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Server response:", result);
          setPrediction(result.prediction);
        } else {
          console.error("Upload failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handleSoundClick = () => {
    setSoundButtonClicked((prev) => {
      const newState = !prev;
      if (newState) {
        speakText();
      } else {
        //setIsAddingMode(false);
        stopListening();
      }
      return newState;
    });
  };

  const speakText = () => {
    if (prediction) {
      const utterance = new SpeechSynthesisUtterance(prediction);
      if (isListening) {
        stopListening();
      }
      utterance.onend = () => {
        setSoundButtonClicked(false);
      };
      speechSynthesis.speak(utterance);
    } else {
      setSoundButtonClicked(false);
    }
  };

  return (
    <div className="flex space-x-6">
      {/* Left Column */}
      <div className="w-[580px] bg-white border border-gray-300 rounded-lg p-6">
        {buttonClicked === "upload" ? (
          <div className="flex flex-col items-center justify-center h-[300px] border border-gray-300 rounded-lg text-lg relative">
            {!videoSrc && (
              <>
                <h2 className="text-2xl mb-1">Choose a video</h2>
                <h3>Upload a .mp4, .ogv or .webm</h3>
              </>
            )}
            {inputVisible && (
              <input
                type="file"
                accept="video/mp4, video/ogg, video/webm"
                onChange={handleVideoUpload}
                className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                id="upload-input"
              />
            )}
            {videoSrc && (
              <div className="mt-4">
                <video
                  ref={uploadVideoRef}
                  className="w-full rounded-lg"
                  controls
                >
                  <source src={videoSrc} type="video/mp4" />
                  <source src={videoSrc} type="video/webm" />
                  <source src={videoSrc} type="video/ogg" />
                  <p>Your browser does not support the video tag.</p>
                </video>
              </div>
            )}
            <br />
            <label htmlFor="upload-input">
              {!videoSrc ? (
                <button
                  className="bg-[#1A73E8] text-[#ffffff] px-6 py-3 rounded-lg font-bold cursor-pointer"
                  onClick={() => setInputVisible(true)}
                >
                  BROWSE YOUR COMPUTER
                </button>
              ) : (
                <button
                  className="bg-[#1A73E8] text-[#ffffff] px-6 py-3 rounded-lg font-bold cursor-pointer"
                  onClick={() => setInputVisible(true)}
                  onChange={() => handleVideoUpload}
                >
                  CHOOSE ANOTHER VIDEO
                </button>
              )}
            </label>
          </div>
        ) : buttonClicked === "camera" ? (
          <div className="flex flex-col items-center h-[300px] border border-gray-300 rounded-lg text-lg">
            {/* Video and Canvas Elements for Camera Processing */}
            {/* {isCameraOn && (
										<div className='w-full h-full'>
											<video ref={videoRef} className='w-full h-[300px]' style={{ display: "none" }}/>
											<canvas ref={canvasRef} className='w-full h-[300px]'/>
										</div>
									)} */}
            {/* {isCameraOn && canvasRef ? (
									<button
										className="bg-red-500 text-[#ffffff] px-6 py-3 rounded-lg font-bold"
										onClick={handleCameraStop}
									>
										STOP CAMERA
									</button>
									) : ( null )}						 */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] border border-gray-300 rounded-lg text-lg">
            <h2 className="text-2xl mb-1">Choose an option</h2>
            <h3>Upload a video or use your camera</h3>
          </div>
        )}
        {/* Mode Toggle Buttons */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-4">
            <button
              className={`p-3 border border-gray-300 rounded-full ${
                buttonClicked === "upload" ? "bg-[#D2E3FC]" : ""
              }`}
              onClick={() => {
                setButtonClicked("upload");
                setIsCameraOn(false);
              }}
            >
              <img
                src="https://cdn0.iconfinder.com/data/icons/glyphpack/40/upload-128.png"
                alt="Upload"
                className="w-6 h-6"
              />
            </button>
            <button
              className={`p-3 border border-gray-300 rounded-full ${
                buttonClicked === "camera" ? "bg-[#D2E3FC]" : ""
              }`}
              //onClick={startCamera}
              onClick={() => handleCameraButtonClick()}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-camera-128.png"
                alt="Camera"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[580px] bg-[#F5F7FD] rounded-lg p-6 border border-gray-300">
        <div className="flex justify-between mb-3 space-x-2">
          <select
            value={destLanguage}
            onChange={(e) => {
              translatePrediction(e);
            }}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            aria-label="Select target language"
            title="Select target language"
          >
            {Object.entries(languages).map(([langCode, langName]) => (
              <option key={langCode} value={langCode}>
                {langName}
              </option>
            ))}
          </select>
        </div>
        <div className="h-[300px] bg-white rounded-lg p-4 border border-gray-300 flex">
          {prediction ? (
            <div className="mt-4 text-lg">
              {/* <h3 className="text-lg font-bold">Prediction:</h3> */}
              <p>{prediction}</p>
            </div>
          ) : (
            <p className="text-gray-500">Processed Output Will Appear Here</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            className={`p-3 border border-gray-300 rounded-full ${
              soundButtonClicked ? "bg-blue-500 text-white" : ""
            }`}
            onClick={handleSoundClick}
          >
            <img
              src="https://cdn3.iconfinder.com/data/icons/system-basic-vol-5/20/icon-speaker-loudness-sound-2-128.png"
              alt="Speaking"
              className="w-6 h-6"
            />
          </button>
          <button className="p-3 border border-gray-300 rounded-full">
            <img
              src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_save-128.png"
              alt="Download"
              className="w-6 h-6"
            />
          </button>
          <button className="p-3 border border-gray-300 rounded-full">
            <img
              src="https://cdn2.iconfinder.com/data/icons/boxicons-solid-vol-1/24/bxs-copy-128.png"
              alt="Copy"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignLanguageDetector;
