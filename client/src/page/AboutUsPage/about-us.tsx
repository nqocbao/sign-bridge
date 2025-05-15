import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TeamMemberProps {
  name: string;
  role: string;
  msv: string;
  imageUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  msv,
  imageUrl,
}) => (
  <Card className="bg-white rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 flex flex-col items-center justify-center w-[262px] h-[289px] p-4">
    <img
      src={imageUrl}
      alt={name}
      className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-lg"
    />
    <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
    <p className="text-gray-700 text-sm mt-1">{role}</p>
    <p className="text-gray-700 text-sm mt-1 mb-5">MSV: {msv}</p>
  </Card>
);

const teamMembers = [
  {
    name: "Nguyễn Văn Ngọc Bảo",
    role: "Leader",
    msv: "22028156",
    imageUrl:
      "https://cdn1.iconfinder.com/data/icons/marvel/512/marvel-04-1024.png",
  },
  {
    name: "Đỗ tiến đạt",
    role: "Member",
    msv: "22028240",
    imageUrl:
      "https://cdn1.iconfinder.com/data/icons/marvel/512/marvel-07-1024.png",
  },
  {
    name: "Trần Lương Minh Đức",
    role: "Member",
    msv: "22028244",
    imageUrl:
      "https://cdn1.iconfinder.com/data/icons/marvel/512/marvel-03-1024.png",
  },
  {
    name: "Đặng Quốc Anh",
    role: "Member",
    msv: "22028064",
    imageUrl:
      "https://cdn1.iconfinder.com/data/icons/marvel/512/marvel-10-1024.png",
  },
];

const AboutUsPage: React.FC = () => {
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
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-transparent backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 rounded-full p-2 shadow-md size-10" />
          <h1 className="text-2xl font-bold text-white">About Us</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 ">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
          <hr className="mb-6 border-gray-300" />
          <p className="text-xl mb-6 text-gray-800">
            We are a handsome team at VNU University of Engineering and
            Technology, working on creating innovative solutions for people with
            disabilities.
          </p>
          <p className="mb-4 text-lg text-center text-gray-800">
            University: VNU University of Engineering and Technology
          </p>
          <p className="mb-4 text-lg text-center text-gray-800">
            Class: INT2041_2 - Human Machine Interaction
          </p>
          <p className="mb-4 text-lg text-center text-gray-800">
            Project: Building applications to support people with disabilities
          </p>
          <hr className="mb-6 border-gray-300" />

          <div className="p-2">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Our Super Team
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {teamMembers.map((member) => (
                <TeamMember
                  key={member.msv}
                  name={member.name}
                  role={member.role}
                  msv={member.msv}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="text-3xl font-semibold text-gray-800">
              <span className="text-blue-500">Help us</span> make sign language
              accessible to everyone!
            </div>
            <div className="mt-4 text-xl font-light text-gray-800">
              Join us in building a more inclusive world. Let's make a
              difference together!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
