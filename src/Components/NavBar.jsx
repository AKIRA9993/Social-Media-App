import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext"; // Import from the right file!

export const SocialMediaLogo = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 512 512" fill="none">
      <g>
        <path
          d="M138.24 358.4c-48.64 0-89.6-38.4-89.6-89.6v-128c0-48.64 38.4-89.6 89.6-89.6h115.2c25.6 0 48.64 20.48 48.64 48.64 0 25.6-20.48 48.64-48.64 48.64h-115.2v128h115.2c25.6 0 48.64 20.48 48.64 48.64 0 25.6-20.48 48.64-48.64 48.64H138.24z"
          fill="#9FC9FF"
        />
        <path
          d="M253.44 464c-48.64 0-89.6-38.4-89.6-89.6V243.2c0-25.6 20.48-48.64 48.64-48.64s48.64 20.48 48.64 48.64v130.56c0 25.6 20.48 48.64 48.64 48.64h64c25.6 0 48.64-20.48 48.64-48.64V243.2c0-25.6 20.48-48.64 48.64-48.64 25.6 0 48.64 20.48 48.64 48.64v130.56c0 48.64-38.4 89.6-89.6 89.6H253.44z"
          fill="#FFFFFF"
        />
        <circle cx="120.32" cy="120.32" r="23.04" fill="#FFFFFF" />
        <path
          d="M304.64 51.2h-97.28c-48.64 0-89.6 38.4-89.6 89.6 0 48.64 38.4 89.6 89.6 89.6h97.28c48.64 0 89.6-38.4 89.6-89.6 0-48.64-40.96-89.6-89.6-89.6zm0 97.28h-97.28V140.8h97.28v7.68z"
          fill="#5B9BD5"
        />
        <path
          d="M368.64 281.6c-48.64 0-89.6 38.4-89.6 89.6v40.96c0 48.64 38.4 89.6 89.6 89.6h64c48.64 0 89.6-38.4 89.6-89.6V371.2c0-48.64-38.4-89.6-89.6-89.6h-64zm64 138.24h-64v-48.64h64v48.64z"
          fill="#ED9EC7"
        />
        <circle cx="400.64" cy="348.16" r="17.92" fill="#C75B9B" />
        <path
          d="M368.64 281.6c-48.64 0-89.6 38.4-89.6 89.6v40.96c0 48.64 38.4 89.6 89.6 89.6h64c48.64 0 89.6-38.4 89.6-89.6V371.2c0-48.64-38.4-89.6-89.6-89.6h-64zm64 138.24h-64v-48.64h64v48.64z"
          fill="#FAD689"
        />
      </g>
    </svg>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  // Get isLoggedIn and logout function from AuthContext
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Handle logout button click
  const handleLogout = () => {
    logout(); // This removes token AND updates isLoggedIn
    navigate('/'); // Go back to home page
  };

  // Menu items change based on login status
  const menuItems = isLoggedIn
    ? [
        { name: "Feed", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Post Details", path: "/post" },
        { name: "Log Out", onClick: handleLogout }, // Only onClick, no path needed
      ]
    : [
        { name: "Feed", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Post Details", path: "/post" },
        { name: "Login", path: "/auth/login" },
        { name: "Register", path: "/auth/register" },
      ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <RouterLink to="/" className="flex items-center gap-2">
            <SocialMediaLogo />
            <p className="font-bold text-inherit">SOCIAL APP</p>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <RouterLink to="/" className="text-foreground hover:text-primary">
            Feed
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            to="/profile"
            className="text-foreground hover:text-primary"
          >
            Profile
          </RouterLink>
        </NavbarItem>
        {/* <NavbarItem>
          <RouterLink to="/post" className="text-foreground hover:text-primary">
            Post Details
          </RouterLink>
        </NavbarItem> */}

        {/* When logged in: show Log Out. When logged out: show Login & Sign Up */}
        {isLoggedIn ? (
          <NavbarItem>
            <span
              onClick={handleLogout}
              className="text-foreground hover:text-primary cursor-pointer"
            >
              Log Out
            </span>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <RouterLink
                to="/auth/login"
                className="text-foreground hover:text-primary"
              >
                Login
              </RouterLink>
            </NavbarItem>
            <NavbarItem>
              <RouterLink
                to="/auth/register"
                className="text-foreground hover:text-primary"
              >
                Sign Up
              </RouterLink>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            {item.onClick ? (
              <span
                onClick={item.onClick}
                className="w-full block py-2 text-lg text-danger cursor-pointer"
              >
                {item.name}
              </span>
            ) : (
              <RouterLink
                to={item.path}
                className="w-full block py-2 text-lg text-foreground"
              >
                {item.name}
              </RouterLink>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}