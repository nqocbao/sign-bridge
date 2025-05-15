import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url('https://i.pinimg.com/736x/10/ec/39/10ec396369ffe553b920d7bd615d1664.jpg')`,
      }}
    >
      <Navbar />

      <div className="w-full h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to Sign Bridge
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md">
          Communicate with Sign Language
        </p>
        <Link to="/login">
          <Button className="h-12 w-52 bg-amber-700 hover:bg-amber-500 text-white text-lg font-semibold">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
