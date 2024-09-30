import { HomeIcon } from "lucide-react";
import HomePage from "./components/Home.jsx"
import TopicPage from "./components/TopicPage.jsx";
//import SolutionPage from "./components/SolutionPage.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HomePage/>
  },
  {
    title: "Topic",
    to: "/:topic",
    page: <TopicPage />,
  },
  {
    title: "Solution",
    to: "/:topic/:method",
    page: <SolutionPage />,
  },
];