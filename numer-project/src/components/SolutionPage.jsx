import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Navbar from './NavBar';

import Graphical from './methods/RootofEquation/Graphical.jsx';
import Bisection from './methods/RootofEquation/Bisection.jsx';
import FalsePosition from './methods/RootofEquation/FalsePosition.jsx';
import OnePointIteration from './methods/RootofEquation/OnePointIteration.jsx';
import NewtonRaphson from './methods/RootofEquation/NewtonRaphson.jsx';
import Secant from './methods/RootofEquation/Secant.jsx';

import CramersRule from './methods/LinearAlgebra/CramersRule.jsx';
import GaussElimination from './methods/LinearAlgebra/GaussElimination.jsx';
import GaussJordan from './methods/LinearAlgebra/GaussJordan.jsx';
import MatrixInversion from './methods/LinearAlgebra/MatrixInversion.jsx';
import LUDecomposition from './methods/LinearAlgebra/LUDecomposition.jsx';
import CholeskyDecomposition from './methods/LinearAlgebra/CholeskyDecomposition.jsx';
import JacobiIteration from './methods/LinearAlgebra/Jacobiiteration.jsx';
import GaussSeidel from './methods/LinearAlgebra/GaussSeidel.jsx';
import ConjugateGradient from './methods/LinearAlgebra/ConjugateGradient.jsx';

import NewtonDividedDiff from './methods/Interpolation/NewtonDividedDiff.jsx';
import LagrangePolynomial from './methods/Interpolation/LagrangePolynomial.jsx';
import SplineInterpolation from './methods/Interpolation/SplineInterpolation.jsx';

import LeastSquaresRegression from './methods/Extrapolation/LeastSquaresRegression.jsx';
import MultipleLinearRegression from './methods/Extrapolation/MultipleLinearRegression.jsx';

import TrapezoidalRule from './methods/Integration/Trapezoidal.jsx';

const methodComponents = {
  "Graphical": Graphical,
  "Bisection": Bisection,
  "FalsePosition": FalsePosition,
  "OnePointIteration": OnePointIteration,
  "NewtonRaphson": NewtonRaphson,
  "Secant": Secant,

  "CramersRule": CramersRule,
  "GaussElimination": GaussElimination,
  "GaussJordan": GaussJordan,
  "MatrixInversion": MatrixInversion,
  "LUDecomposition": LUDecomposition,
  "CholeskyDecomposition": CholeskyDecomposition,
  "JacobiIteration": JacobiIteration,
  "GaussSeidel": GaussSeidel,
  "ConjugateGradient": ConjugateGradient,

  "NewtonDividedDiff": NewtonDividedDiff,
  "LagrangePolynomial": LagrangePolynomial,
  "SplineInterpolation": SplineInterpolation,

  "LeastSquaresRegression": LeastSquaresRegression,
  "MultipleLinearRegression": MultipleLinearRegression,
  
  "Trapezoidal": TrapezoidalRule,
};

const SolutionPage = () => {
  const { topicId, methodId } = useParams();
  const MethodComponent = methodComponents[methodId] || (() => <div>Method not found</div>);

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8 py-16 px-4 md:px-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {methodId.replace(/([A-Z])/g, ' $1').trim()} Method
        </h1>
        <div className="bg-black border border-neutral-800 rounded-lg shadow-lg p-6 mb-8">
          <MethodComponent />
        </div>
        <div className="mt-12 text-center space-x-4">
          <Link to={`/${topicId}`}>
            <Button className="text-white bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">
              Back to Methods
            </Button>
          </Link>
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

export default SolutionPage;
