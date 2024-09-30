import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import GraphicalMethod from './methods/Graphical'
import BisectionMethod from './methods/Bisection'
import FalsePositionMethod from './methods/FalsePosition'
import OnePointIterationMethod from './methods/OnePointIteration'
import NewtonRaphsonMethod from './methods/NewtonRaphson'
import SecantMethod from './methods/Secant'

const methodComponents = {
  'graphical': GraphicalMethod,
  'bisection': BisectionMethod,
  'false-position': FalsePositionMethod,
  'one-point-iteration': OnePointIterationMethod,
  'newton-raphson': NewtonRaphsonMethod,
  'secant': SecantMethod,
}

const SolutionPage = () => {
  const { topic, method } = useParams()
  const MethodComponent = methodComponents[method]

  if (!MethodComponent) {
    return <div>Method not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center capitalize">{method.replace(/-/g, ' ')}</h1>
      <MethodComponent />
      <div className="mt-8 text-center">
        <Link to={`/${topic}`}>
          <Button variant="outline" className="mr-2">Back to Methods</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default SolutionPage