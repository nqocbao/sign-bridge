import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Languages, Info } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface FeatureProps {
  title: string;
  content: JSX.Element;
  icon: JSX.Element;
  isSelected: boolean;
  onClick: () => void;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  content,
  icon,
  isSelected,
  onClick,
}) => (
  <Card
    className={`bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center w-[300px] h-[244px] cursor-pointer transition-all duration-300 ease-in-out transform hover:bg-gray-100 hover:shadow-lg hover:scale-105 ${
      isSelected ? "scale-105 shadow-xl bg-gray-50" : ""
    }`}
    onClick={onClick}
  >
    {!isSelected ? (
      <>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl font-semibold text-center text-gray-800">
          {title}
        </CardTitle>
      </>
    ) : (
      <CardContent className="text-gray-800 text-sm p-0">{content}</CardContent>
    )}
  </Card>
);

const features = [
  {
    title: "Dictionary",
    content: (
      <>
        <p className="mb-2">
          Easily look up words and phrases in sign language:
        </p>
        <ul className="list-disc list-inside mb-2">
          <li> Type your desired term in the search bar.</li>
          <li> Select a suggestion to view related videos.</li>
          <li> Watch videos demonstrating the corresponding signs.</li>
        </ul>
        <p>
          <strong>No Results?</strong> Try searching for related terms or
          simpler phrases.
        </p>
      </>
    ),
    icon: <Book className="w-16 h-16 text-gray-800" />,
  },
  {
    title: "Translator",
    content: (
      <>
        <p className="mb-2">Translate between text and sign language:</p>
        <p>
          <strong>Text to Sign Language:</strong>
        </p>
        <ul className="list-disc list-inside mb-2">
          <li> Enter any text to translate into sign language.</li>
          <li> Watch an animation demonstrating the signs.</li>
          <li> Use it to communicate easily with others.</li>
        </ul>
        <p>
          <strong>Sign Language to Text:</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>- Use your camera to perform sign language.</li>
          <li>- The app converts the signs into written text.</li>
          <li>- Perfect for real-time communication or practice.</li>
        </ul>
      </>
    ),
    icon: <Languages className="w-16 h-16 text-gray-800" />,
  },
  {
    title: "About Us",
    content: (
      <>
        <p>
          Learn more about our mission, team, and commitment to supporting the
          deaf and mute community in the <strong>About Us</strong> section.
        </p>
      </>
    ),
    icon: <Info className="w-16 h-16 text-gray-800" />,
  },
];

const TutorialPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col p-6"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://i.pinimg.com/736x/8b/b4/33/8bb433233a9176ea6cb01298f18a0035.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-transparent backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 rounded-full p-2 shadow-md size-10" />
          <h1 className="text-2xl font-bold text-white">How to Use</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">How to Use</h1>
          <p className="mb-6 text-lg text-gray-800">
            Welcome to our app! Here's a{" "}
            <span className="text-blue-500">step-by-step</span> guide to help
            you make the most of its features:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <Feature
                key={index}
                title={feature.title}
                content={feature.content}
                icon={feature.icon}
                isSelected={selectedFeature === index}
                onClick={() =>
                  setSelectedFeature(selectedFeature === index ? null : index)
                }
              />
            ))}
          </div>
          <div className="mt-6 text-center text-xl text-gray-800">
            <p>
              We hope this guide helps you enjoy and learn sign language
              effectively!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
