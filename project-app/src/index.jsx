import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const topics = [
  { title: "Root of Equation", description: "Find roots of equations using various methods", path: "/root-of-equation" },
  { title: "Linear Algebra", description: "Solve linear algebra problems", path: "/linear-algebra" },
  { title: "Interpolation", description: "Estimate values between known data points", path: "/interpolation" },
  { title: "Extrapolation", description: "Estimate values beyond known data points", path: "/extrapolation" },
  { title: "Integration", description: "Calculate definite integrals numerically", path: "/integration" },
  { title: "Differentiation", description: "Compute numerical derivatives", path: "/differentiation" },
]

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Numerical Methods</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={topic.path}>
                <Button className="w-full">Explore Methods</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Index