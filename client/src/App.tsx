import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { AppSidebar } from "./components/app-sidebar";
import DashboardPage from "./page/DashboardPage/dashboard";
import DictionaryPage from "./page/DictionaryPage/dictionary";
import TranslatePage from "./page/TranslatePage/translate";
import AboutUsPage from "./page/AboutUsPage/about-us";
import Tutorial from "./page/TutorialPage/tutorial";
import HomePage from "./page/HomePage/homepage";
import LoginPage from "./page/LoginPage/loginpage";
import SignupPage from "./page/SignupPage/signuppage";

function AppLayout() {
  // Đặt useLocation ở đây, vì AppLayout nằm trong <Router>
  const location = useLocation();

  return (
    <div className="flex h-full w-full">
      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && <AppSidebar />}
      <main className="h-full w-full bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Redirect các route không tồn tại về dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <Router>
          <AppLayout />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
