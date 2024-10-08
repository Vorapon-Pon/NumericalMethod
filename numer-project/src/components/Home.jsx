import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom'; 
import { Carousel } from './ui/carousel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Navbar from './NavBar';

const topics = [
    { title: "Root of Equation", desc: "Find roots of equations", path: "/root-of-equation" },
    { title: "Linear Algebra", desc: "Solve linear algebra problems", path: "/linear-algebra" },
    { title: "Interpolation", desc: "Estimate values between known data points", path: "/interpolation" },
    { title: "Extrapolation", desc: "Estimate values beyond known data points", path: "/extrapolation" },
    { title: "Integration", desc: "Calculate definite integrals", path: "/integration" },
    { title: "Differentiation", desc: "Compute numerical derivatives", path: "/differentiation" },
    ];

const HomePage = () => {
  return (
    <>
    <Navbar/>
    <div id="home" className="container mx-auto my-8 py-16 px-4 md:px-16">
      <h1 className="text-md text-left text-neutral-400">6 6 0 4 0 6 2 6 3 0 5 0 1</h1>
      <h1 className="font-bold text-5xl md:text-6xl text-left text-white mb-3">Numerical Methods</h1>
      <p className="text-neutral-300 my-8 md:my-16 px-4 md:px-16 leading-relaxed">
        Today, computers and numerical methods provide an alternative for such complicated calculations. 
        Using computer power to obtain solutions directly, you can approach these calculations without 
        recourse to simplifying assumptions or time-intensive techniques. 
        Although analytical solutions are still extremely valuable both for problem solving and for providing insight, 
        numerical methods represent alternatives that greatly enlarge your capabilities to confront and solve problems. 
        As a result, more time is available for the use of your creative skills. Thus, more emphasis can be placed on problem formulation 
        and solution interpretation and the incorporation of total system, or “holistic,” awareness.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-16">
        {topics.map((topic) => (
          <Card key={topic.title} className="bg-black border border-neutral-800 shadow-lg hover:shadow-neutral-700 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-xl">{topic.title}</CardTitle>
            <CardDescription className="text-gray-400">{topic.desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={topic.path}>
              <Button className="w-full text-white bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">Explore Methods</Button>
            </Link>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
    <div id="about" className="container mx-auto mt-16 py-16 px-16 bg-gradient-to-b from-black to-neutral-900">
      <h1 className="text-3xl font-bold text-3xl text-left text-white mb-3">About</h1>
      <p className="text-neutral-300 my-16 px-16">This Web App is for Numerical Method lesson Build by Vite + React </p>
        
    </div>
    <div id="contact" className="container mx-auto mt-16 py-16 px-16 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold text-left text-white mb-8">Contact</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Your Name</label>
              <Input type="text" placeholder="Enter your name" className="bg-neutral-900 text-white border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <Input type="email" placeholder="you@example.com" className="bg-neutral-900 text-white border-neutral-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <Textarea placeholder="Your message..." className="bg-neutral-900 text-white border-neutral-700" rows={6} />
          </div>
          <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
            Send Message
          </Button>
        </form>
      </div>
    </>
  );
};

export default HomePage;
