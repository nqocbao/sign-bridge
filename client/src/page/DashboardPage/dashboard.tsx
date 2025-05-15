import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Languages, Info, NewspaperIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Tutorial from "../TutorialPage/tutorial";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gray-50 p-6 flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://i.pinimg.com/736x/8b/b4/33/8bb433233a9176ea6cb01298f18a0035.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-transparent backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 shadow-none">
          <SidebarTrigger className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 rounded-full p-2 shadow-md size-10" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
      </header>

      {/* Cards Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Dictionary Card */}
          <Link to={"/dictionary"}>
            <Card className="bg-gray-800 text-white min-h-[180px] transition-all duration-300 hover:bg-gray-700 hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6" />
                  Dictionary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Explore a comprehensive dictionary of sign language gestures
                  and their meanings.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Translator Card */}
          <Link to={"/translate"}>
            <Card className="bg-yellow-400 text-gray-800 min-h-[180px] transition-all duration-300 hover:bg-yellow-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-6 w-6" />
                  Translator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Instantly translate text into sign language gestures with our
                  easy-to-use tool.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Tutorial Card */}
          <Link to={"/tutorial"}>
            <Card className="bg-blue-400 text-white min-h-[180px] transition-all duration-300 hover:bg-blue-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NewspaperIcon className="h-6 w-6" />
                  Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Learn sign language step-by-step with interactive tutorials
                  and videos.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* About Us Card */}
          <Link to={"/about-us"}>
            <Card className="bg-gray-400 text-white min-h-[180px] transition-all duration-300 hover:bg-gray-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-6 w-6" />
                  About Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Discover more about our mission to bridge communication gaps
                  through sign language.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
