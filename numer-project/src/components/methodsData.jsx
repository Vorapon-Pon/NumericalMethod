// src/data/methodsData.js

const methodsData = {
    "root-of-equation": [
      {
        title: "Graphical Method",
        desc: "Numerically approximates the root(s) of an equation by increasing each step.",
        path: "/root-of-equation/Graphical"
      },
      {
        title: "Bisection Method",
        desc: "Numerically approximates a root of an equation using repeated division.",
        path: "/root-of-equation/Bisection"
      },
      {
        title: "False Position Method",
        desc: "Numerically approximates a root of an equation using linear interpolation.",
        path: "/root-of-equation/FalsePosition"
      },
      {
        title: "One-Point Iteration Method",
        desc: "Numerically approximates a root of an equation using a single iterative function.",
        path: "/root-of-equation/OnePointIteration"
      },
      {
        title: "Newton-Raphson Method",
        desc: "Numerically approximates a root of an equation using the tangent line.",
        path: "/root-of-equation/NewtonRaphson"
      },
      {
        title: "Secant Method",
        desc: "Numerically approximates a root of an equation using a secant line.",
        path: "/root-of-equation/Secant"
      },
    ],
    
    "linear-algebra": [
      {
        title: "Cramer's Rule",
        desc: "Solves systems of linear equations using determinants.",
        path: "/linear-algebra/CramersRule"
      },
      {
        title: "Gauss Elimination",
        desc: "Solves systems of linear equations using row operations.",
        path: "/linear-algebra/GaussElimination"
      },
      {
        title: "Gauss-Jordan Elimination",
        desc: "Solves systems of linear equations and finds the inverse of a matrix.",
        path: "/linear-algebra/GaussJordan"
      },
      {
        title: "Matrix Inversion",
        desc: "Finds the inverse of a square matrix.",
        path: "/linear-algebra/MatrixInversion"
      },
      {
        title: "LU Decomposition",
        desc: "Factorizes a matrix into the product of a lower and upper triangular matrix.",
        path: "/linear-algebra/LUDecomposition"
      },
      {
        title: "Cholesky Decomposition",
        desc: "Factorizes a symmetric positive-definite matrix into the product of a lower triangular matrix and its conjugate transpose.",
        path: "/linear-algebra/CholeskyDecomposition"
      },
      {
        title: "Jacobi Iteration",
        desc: "Solves systems of linear equations iteratively.",
        path: "/linear-algebra/JacobiIteration"
      },
      {
        title: "Gauss-Seidel",
        desc: "Solves systems of linear equations iteratively using updated values.",
        path: "/linear-algebra/GaussSeidel"
      },
      {
        title: "Conjugate Gradient",
        desc: "Solves systems of linear equations iteratively for symmetric positive-definite matrices.",
        path: "/linear-algebra/ConjugateGradient"
      },
    ],

    "interpolation" : [
      {
        title: "Newton's Divided Difference",
        desc: "Interpolates data using Newton's divided difference formulas.",
        path: "/interpolation/NewtonDividedDiff"
      },
      {
        title: "Lagrange Polynomial",
        desc: "Interpolates data using Lagrange polynomials.",
        path: "/interpolation/LagrangePolynomial"
      },
      {
        title: "Spline Interpolation",
        desc: "Interpolates data using piecewise polynomial functions.",
        path: "/interpolation/SplineInterpolation"
      }
    ],
  };
  
  export default methodsData;
  