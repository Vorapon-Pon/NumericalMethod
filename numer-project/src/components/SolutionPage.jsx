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
};

const SolutionPage = () => {
  const { topicId, methodId } = useParams();

  // Get the corresponding method component based on methodId
  const MethodComponent = methodComponents[methodId] || (() => <div>Method not found</div>);

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8 py-16 px-16">
        <h1 className="text-3xl font-bold text-6xl text-center text-white mb-8">Solve using {methodId.replace(/([A-Z])/g, ' $1')} Method</h1>
        <div className="mt-8">
          <MethodComponent />
            <div className="mt-8 text-center">
            <Link to={`/${topicId}`}>
                <Button className="mr-2 text-white bg-neutral-900 hover:bg-neutral-800 border-transparent">
                    Back to Methods
                </Button>
            </Link>
            <Link to="/">
                <Button className="mr-2 text-white bg-neutral-900 hover:bg-neutral-800 border-transparent">
                    Back to Home
                </Button>
            </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default SolutionPage;
