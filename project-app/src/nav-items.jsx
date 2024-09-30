import { HomeIcon } from "lucide-react"
import Index from "./Index.jsx"
import TopicPage from "./components/TopicPage.jsx"
import SolutionPage from "./components/SolutionPage.jsx"

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
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
]