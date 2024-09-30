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
      <div className="container mx-auto my-8 py-16 px-16">
        <h1 className="text-3xl font-bold text-6xl text-left text-white mb-8">Methods for {topicId.toUpperCase()}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <Card key={index} className="bg-neutral-950 shadow-md hover:shadow-neutral-800 border-transparent">
            <CardHeader>
              <CardTitle className="text-white">{method.title}</CardTitle>
              <CardDescription className="text-gray-300">{method.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={method.path}>
                <Button className="w-full text-white bg-neutral-900 hover:bg-neutral-800">Solve with</Button>
              </Link>
            </CardContent>
          </Card>
          ))}
        </div>
          <div className="mt-8 text-center">
            <Link to="/">
                <Button className="mr-2 text-white bg-neutral-900 hover:bg-neutral-800 border-transparent">
                    Back to Home
                </Button>
            </Link>
          </div>
      </div>
    </>
  );
};


export default TopicPage;
