import {
  AudioLines,
  BarChart2,
  BookOpen,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  MessageSquare,
  Settings,
  SignpostBig,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Thêm useLocation
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import logo from "../assets/logo.png";
export function AppSidebar() {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Hàm kiểm tra active
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="pb-6 justify-center items-center">
        <Link to="/">
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Sign Bridge Logo"
              className="h-10 w-auto" // Kích thước logo, có thể điều chỉnh
            />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/dashboard")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11`}
            >
              <Link to="/dashboard">
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/dictionary")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11`}
            >
              <Link to="/dictionary">
                <BookOpen className="h-5 w-5" />
                <span>Dictionary</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/translate")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11`}
            >
              <Link to="/translate">
                <MessageSquare className="h-5 w-5" />
                <span>Translate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/how-to-use")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11`}
            >
              <Link to="/tutorial">
                <HelpCircle className="h-5 w-5" />
                <span>Tutorial</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/about-us")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11`}
            >
              <Link to="/about-us">
                <Settings className="h-5 w-5" />
                <span>About us</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${
                isActive("/logout")
                  ? "bg-[#A5B68D] text-white"
                  : "bg-white text-[#A5B68D]"
              } hover:bg-[#C1CFA1] hover:text-[#A5B68D]/30 h-11 justify-center items-center mb-10`}
            >
              <Link to="/">
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
