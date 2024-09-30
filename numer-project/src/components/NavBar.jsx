import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav
      className={`${isScrolled ? "p-2 bg-opacity-30" : "p-5 bg-opacity-60"} 
        bg-neutral-900 shadow-md fixed top-0 left-0 w-full transition-all duration-300 z-10`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl text-white font-bold">
          <Link to="/" className="line-through text-white">VW</Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => handleNavClick("home")}
              className="text-gray-300 hover:text-neutral-400 px-4"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick("about")}
              className="text-gray-300 hover:text-neutral-400 px-4"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick("contact")}
              className="text-gray-300 hover:text-neutral-400 px-4"
            >
              Contact
            </button>
          </li>
          <li>
            <button className="text-gray-300 hover:text-neutral-400 px-4">
              Login
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
