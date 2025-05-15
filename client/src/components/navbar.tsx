import React from "react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Link } from "react-router-dom";
import { SignpostBig, UserCircleIcon, UserPlusIcon } from "lucide-react";
// Import logo từ thư mục assets
import logo from "../assets/logo.png"; // Đường dẫn tới logo.png trong src/assets

// ListItem component definition
type ListItemProps = {
  href: string;
  title: string;
  children: React.ReactNode;
};

function ListItem({ href, title, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          href={href}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-30 w-full p-4 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo (Sign Bridge) bên trái */}
        <Link to="/">
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Sign Bridge Logo"
              className="h-10 w-auto" // Kích thước logo, có thể điều chỉnh
            />
          </div>
        </Link>

        {/* NavigationMenu ở giữa */}
        <NavigationMenu className="flex-1 flex justify-center">
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="text-black hover:text-gray-300">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-black hover:text-gray-300">
                Contents
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components built with Radix UI
                          and Tailwind CSS.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/dictionary" title="Dictionary">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/translate" title="Translate">
                    How to install dependencies and structure your app.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="https://www.british-sign.co.uk/fingerspelling-alphabet-charts/">
                <NavigationMenuLink className="text-black hover:text-gray-300">
                  Fingerspelling
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-black hover:text-gray-300">
                Contact
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Login/Signup bên phải */}
        <div className="flex-shrink-0 flex gap-2">
          <Link to="/login">
            <Button className="text-black bg-transparent hover:bg-gray-700/50 flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5" />
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="text-black bg-transparent border border-white hover:bg-gray-700/50 flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5" />
              Signup
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
