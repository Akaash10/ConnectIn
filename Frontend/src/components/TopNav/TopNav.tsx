import "./TopNav.css";
import { useEffect, useRef, useState } from "react";
import TopNavLeft from "./TopNav_Left/TopNav_Left";
import TopNavCenter from "./TopNav_Center/TopNav_Center";
import TopNavRight from "./TopNav_Right/TopNav_Right";

const TopNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="topnav">
      <TopNavLeft />
      <TopNavCenter />
      <TopNavRight
        isOpen={isProfileOpen}
        toggle={() => setIsProfileOpen((p) => !p)}
        ref={profileRef}
      />
    </header>
  );
};

export default TopNav;
