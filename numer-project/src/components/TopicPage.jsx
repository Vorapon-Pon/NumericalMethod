import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from './NavBar';
import methodsData from './methodsData';

const TopicPage = () => {
  const { topicId } = useParams();
  const methods = methodsData[topicId] || [{ title: "Not Found" }];

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8 py-16 px-4 md:px-16">
        <h1 className="text-4xl md:text-6xl font-bold text-left text-white mb-8">Methods for {topicId.replace(/-/g, ' ').toUpperCase()}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <Card key={index} className="bg-black border border-neutral-800 shadow-lg hover:shadow-neutral-700 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white text-xl">{method.title}</CardTitle>
              <CardDescription className="text-gray-400">{method.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={method.path}>
                <Button className="w-full text-white bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">Solve with</Button>
              </Link>
            </CardContent>
          </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/">
            <Button className="text-white bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};


export default TopicPage;
