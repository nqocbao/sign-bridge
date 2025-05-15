import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Định nghĩa interface GlossEntry
interface GlossEntry {
  gloss: string;
  instances: { instance_id: string; url: string }[];
}

const YOUTUBE_API_KEY = "AIzaSyCTXMbVAAFr8muCvl77GUjIdzRB7f8qdBE";

const DictionaryPage: React.FC = () => {
  const [glossary, setGlossary] = useState<{ [key: string]: number }>({});
  const [data, setData] = useState<GlossEntry[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedGloss, setSelectedGloss] = useState<GlossEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [videoErrors, setVideoErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    loadData(
      "/data/WLASL_v0.3.json",
      setData,
      "Không thể tải dữ liệu từ điển. Vui lòng kiểm tra đường dẫn file và thử lại."
    );
  }, []);

  useEffect(() => {
    loadGlossary(
      "/data/wlasl_class_list.txt",
      setGlossary,
      "Không thể tải dữ liệu danh sách từ."
    );
  }, []);

  // Hàm parseGlossary
  const parseGlossary = (text: string): { [key: string]: number } => {
    const glossary: { [key: string]: number } = {};
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    lines.forEach((line) => {
      const [index, word] = line.trim().split(/\s+/);
      if (word && index) {
        glossary[word.toLowerCase()] = parseInt(index);
      }
    });
    return glossary;
  };

  const loadData = (
    url: string,
    setData: React.Dispatch<React.SetStateAction<GlossEntry[]>>,
    errorMessage: string
  ) => {
    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Không thể tải file JSON: ${response.statusText}`);
        return response.json();
      })
      .then((json) => {
        console.log("Dữ liệu JSON đã tải:", json);
        setData(json);
      })
      .catch((error) => {
        console.error("Lỗi tải dữ liệu JSON:", error);
        setLoadError(errorMessage);
      });
  };

  const loadGlossary = (
    url: string,
    setGlossary: React.Dispatch<
      React.SetStateAction<{ [key: string]: number }>
    >,
    errorMessage: string
  ) => {
    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `Không thể tải file danh sách từ: ${response.statusText}`
          );
        return response.text();
      })
      .then((text) => setGlossary(parseGlossary(text)))
      .catch((error) => {
        console.error("Lỗi tải dữ liệu danh sách từ:", error);
        setLoadError(errorMessage);
      });
  };

  const checkYouTubeVideoStatus = async (videoId: string) => {
    console.log(`Kiểm tra trạng thái video ID: ${videoId}`);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=status`
      );
      if (!response.ok) {
        console.error(
          `Lỗi API YouTube: ${response.status} ${response.statusText}`
        );
        return true; // Xem như không khả dụng nếu API lỗi
      }
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const status = data.items[0].status;
        console.log(
          `Video ID: ${videoId}, Trạng thái riêng tư: ${status.privacyStatus}, Có thể nhúng: ${status.embeddable}`
        );
        return (
          status.privacyStatus === "private" || status.embeddable === false
        );
      }
      console.log(`Video ID: ${videoId} không khả dụng`);
      return true;
    } catch (error) {
      console.error(`Lỗi kiểm tra trạng thái video ${videoId}:`, error);
      return true; // Xem như không khả dụng nếu có lỗi
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedGloss(null);
    setNotFound(false);

    if (value) {
      const matches = Object.keys(glossary).filter((word) =>
        word.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (word: string) => {
    console.log(`Đã chọn gợi ý: ${word}`);
    const entry = data.find((item) => item.gloss === word);
    if (entry) {
      const filteredInstances = await filterInstances(entry.instances);
      console.log(`Danh sách instance đã lọc cho ${word}:`, filteredInstances);
      setSelectedGloss({ ...entry, instances: filteredInstances });
    } else {
      setSelectedGloss(null);
    }
    setQuery(word);
    setSuggestions([]);
    setNotFound(!entry);
  };

  const filterInstances = async (
    instances: { instance_id: string; url: string }[]
  ) => {
    const filteredInstances: { instance_id: string; url: string }[] = [];
    for (const instance of instances) {
      console.log(
        `Xử lý instance: ${instance.instance_id}, URL: ${instance.url}`
      );
      if (
        instance.url.includes("youtube.com") ||
        instance.url.includes("youtu.be")
      ) {
        const videoId = extractVideoId(instance.url);
        if (videoId) {
          if (!(await checkYouTubeVideoStatus(videoId))) {
            filteredInstances.push(instance);
          } else {
            console.log(`Lọc bỏ video YouTube: ${instance.url}`);
          }
        } else {
          console.log(`URL YouTube không hợp lệ: ${instance.url}`);
        }
      } else {
        // Kiểm tra URL không phải YouTube
        try {
          const response = await fetch(instance.url, { method: "HEAD" });
          if (response.ok) {
            filteredInstances.push(instance);
          } else {
            console.log(
              `URL không phải YouTube không truy cập được: ${instance.url}`
            );
          }
        } catch (error) {
          console.log(
            `Lỗi truy cập URL không phải YouTube: ${instance.url}`,
            error
          );
        }
      }
    }
    return filteredInstances;
  };

  const extractVideoId = (url: string) => {
    if (url.includes("youtube.com")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get("v") || "";
    } else if (url.includes("youtu.be")) {
      return url.split("/").pop() || "";
    }
    return "";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(`Nhấn Enter với truy vấn: ${query}`);
      handleSuggestionClick(query);
    }
  };

  const handleVideoError = (url: string, error?: Event) => {
    console.error(`Lỗi tải video: ${url}`, error);
    setVideoErrors((prevErrors) => ({ ...prevErrors, [url]: true }));
  };

  const renderVideo = (url: string) => {
    console.log(`Thử hiển thị video: ${url}`);
    if (videoErrors[url]) {
      console.log(`Bỏ qua video do lỗi trước đó: ${url}`);
      return null;
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = extractVideoId(url);
      console.log(`ID video YouTube: ${videoId}`);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            width="400"
            height="300"
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={(e) => handleVideoError(url, e)}
            title={`Trình phát video YouTube - ${videoId}`}
            className="max-w-full"
          ></iframe>
        );
      }
      console.log(`Không trích xuất được ID video từ: ${url}`);
      return null;
    } else {
      console.log(`Hiển thị video không phải YouTube: ${url}`);
      return (
        <video
          controls
          className="w-full h-auto max-w-[400px]"
          onError={(e) => handleVideoError(url, e)}
        >
          <source src={url} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      );
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
          <h1 className="text-2xl font-bold text-white">Từ điển</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl mb-10 text-white">Tìm kiếm mọi thứ tại đây</h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg w-4/5">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm ký hiệu..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="pl-10 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {loadError && <p className="text-red-500 mb-4">{loadError}</p>}
          {notFound ? (
            <p className="text-lg text-red-500">
              Không tìm thấy kết quả cho "{query}". Vui lòng thử từ khác.
            </p>
          ) : selectedGloss ? (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {selectedGloss.gloss}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedGloss.instances.length === 0 ? (
                  <p className="text-gray-500">
                    Không có video hợp lệ cho "{selectedGloss.gloss}".
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGloss.instances
                      .filter((instance) => !videoErrors[instance.url])
                      .map((instance) => (
                        <div
                          key={instance.instance_id}
                          className="flex justify-center"
                        >
                          {renderVideo(instance.url)}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-gray-300 text-center">
              <p className="text-lg mb-4">
                Tìm kiếm một ký hiệu để xem video và tìm hiểu thêm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryPage;
