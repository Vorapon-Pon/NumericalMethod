const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", async (req, res) => {
  res.send("Server is running");
});

//swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Numerical Example API',
      version: '1.0.0',
      description: 'API documentation for Example Numerical Method',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB (Replace <username>, <password>, and <cluster-url> with your own values)
mongoose.connect('mongodb+srv://voraponwpon:d52uQ9sC7TOzUtTw@cluster.r06og.mongodb.net/Example?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exampleSchema = new mongoose.Schema({
  category: { type: String, required: true },
  method: { type: String, required: true },
  
  equation: String,
  xL: Number,
  xR: Number,
  tolerance: Number,


  precision: Number,

  dimension: Number,
  matrix: [[Number]],
  solution: [Number],
  initialX: [Number],     
  iteration: Number,      
});

const Example = mongoose.model('example', exampleSchema);

// Example API routes with Swagger documentation

/**
 * @swagger
 * /bisection:
 *   get:
 *     summary: Get Bisection Method examples
 *     responses:
 *       200:
 *         description: A list of Bisection Method examples
 */

// API route to get Bisection examples
app.get('/bisection', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Bisection' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Bisection examples' });
  }
});

/**
 * @swagger
 * /falseposition:
 *   get:
 *     summary: Get False Position Method examples
 *     responses:
 *       200:
 *         description: A list of False Position Method examples
 */

// API route to get False Position examples
app.get('/falseposition', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'FalsePosition' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching False Position examples' });
  }
});

/**
 * @swagger
 * /newtonraphson:
 *   get:
 *     summary: Get Newton Raphson Method examples
 *     responses:
 *       200:
 *         description: A list of Newton Raphson Method examples
 */

// API route to get Newton-Raphson Method examples
app.get('/newtonraphson', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'NewtonRaphson' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Newton-Raphson examples' });
  }
});

/**
 * @swagger
 * /secant:
 *   get:
 *     summary: Get Secant Method examples
 *     responses:
 *       200:
 *         description: A list of Secant Method examples
 */

// API route to get Secant Method examples
app.get('/secant', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Secant' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Secant examples' });
  }
});

/**
 * @swagger
 * /onepointiteration:
 *   get:
 *     summary: Get One Point Iteration Method examples
 *     responses:
 *       200:
 *         description: A list of One Point Iteration Method examples
 */

// API route to get One Point Iteration examples
app.get('/onepointiteration', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'OnePoint' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching One Point Iteration examples' });
  }
});

/**
 * @swagger
 * /graphical:
 *   get:
 *     summary: Get Graphical Method examples
 *     responses:
 *       200:
 *         description: A list of Graphical Method examples
 */

// API route to get Graphical Method examples
app.get('/graphical', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Graphical' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching One Point Iteration examples' });
  }
});

/**
 * @swagger
 * /cramer:
 *   get:
 *     summary: Get Cramer's Rule examples
 *     responses:
 *       200:
 *         description: A list of Cramer's Rule examples
 */

// API route to get Cramer Rule examples
app.get('/cramer', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'CramerRule' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Cramer examples' });
  }
});

/**
 * @swagger
 * /gausselimination:
 *   get:
 *     summary: Get Gauss-Elimination examples
 *     responses:
 *       200:
 *         description: A list of Gauss-Elimination examples
 */

// API route to get Gauss Elimination examples
app.get('/gausselimination', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'GaussElimination' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gauss Elimination examples' });
  }
});

/**
 * @swagger
 * /jordan:
 *   get:
 *     summary: Get Gauss-Jordan examples
 *     responses:
 *       200:
 *         description: A list of Gauss-Jordan examples
 */

// API route to get Gauss Jordan examples
app.get('/jordan', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'GaussJordan' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gauss Elimination examples' });
  }
});

/**
 * @swagger
 * /inversion:
 *   get:
 *     summary: Get Matrix Inversion examples
 *     responses:
 *       200:
 *         description: A list of Matrix Inversion examples
 */

// API route to get Matrix Inversion examples
app.get('/inversion', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'MatrixInversion' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Matrix Inversion examples' });
  }
});

/**
 * @swagger
 * /ludecomposition:
 *   get:
 *     summary: Get LU Decomposition examples
 *     responses:
 *       200:
 *         description: A list of LU Decomposition examples
 */

// API route to get LU Decomposition examples
app.get('/ludecomposition', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'LUDecomposition' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching LU Decomposition examples' });
  }
});

/**
 * @swagger
 * /cholesky:
 *   get:
 *     summary: Get Cholesky Decomposition examples
 *     responses:
 *       200:
 *         description: A list of Cholesky Decomposition examples
 */

// API route to get Cholesky Decomposition examples
app.get('/cholesky', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'CholeskyDecomposition' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Cholesky Decomposition examples' });
  }
});

/**
 * @swagger
 * /jacobi:
 *   get:
 *     summary: Get Jacobi Iteration Method examples
 *     responses:
 *       200:
 *         description: A list of Jacobi Iteration Method examples
 */

// API route to get Jacobi Method examples
app.get('/jacobi', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'JacobiIteration' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Jacobi examples' });
  }
});

/**
 * @swagger
 * /gaussseidel:
 *   get:
 *     summary: Get Gauss Seidel Iteration Method examples
 *     responses:
 *       200:
 *         description: A list of Gauss Seidel Method examples
 */

// API route to get Gauss-Seidel Method examples
app.get('/gaussseidel', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'GaussSeidel' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gauss-Seidel examples' });
  }
});

/**
 * @swagger
 * /conjugate:
 *   get:
 *     summary: Get Conjugate Gradient Method examples
 *     responses:
 *       200:
 *         description: A list of Conjugate Gradient Method examples
 */

// API route to get Conjugate Gradient Method examples
app.get('/conjugate', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'ConjugateGradient' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Conjugate Gradient examples' });
  }
});

/**
 * @swagger
 * /newtondivided:
 *   get:
 *     summary: Get Conjugate Gradient Method examples
 *     responses:
 *       200:
 *         description: A list of Conjugate Gradient Method examples
 */

// API route to get Newton Divided Different Method examples
app.get('/newtondivided', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'NewtonDivided' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Newton Didvided examples' });
  }
});

/**
 * @swagger
 * /lagrange:
 *   get:
 *     summary: Get Lagrange Interpolation examples
 *     responses:
 *       200:
 *         description: A list of Lagrange Interpolation examples
 */

// API route to get Lagrange Interpolation Method examples
app.get('/lagrange', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Largrange' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Lagrange Interpolation examples' });
  }
});

/**
 * @swagger
 * /spline:
 *   get:
 *     summary: Get Spline Interpolation examples
 *     responses:
 *       200:
 *         description: A list of Spline Interpolation examples
 */

// API route to get Spline Interpolation Method examples
app.get('/spline', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Spline' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Spline Interpolation examples' });
  }
});

/**
 * @swagger
 * /linearpoly:
 *   get:
 *     summary: Get Linear/Polynomial Regression examples
 *     responses:
 *       200:
 *         description: A list of Linear/Polynomial Regression examples
 */

// API route to get Linear/Polynomial Regrssion examples
app.get('/linearpoly', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'linearNPolyReg' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Linear/Polynomial Regrssion examples' });
  }
});

/**
 * @swagger
 * /multiple:
 *   get:
 *     summary: Get Multiple Linear Regression examples
 *     responses:
 *       200:
 *         description: A list of  Multiple Linear Regression examples
 */

// API route to get Multiple Linear Regrssion examples
app.get('/multiple', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'multipleLinearReg' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Multiple Linear Regrssion examples' });
  }
});

/**
 * @swagger
 * /trapezoidal:
 *   get:
 *     summary: Get Trapezoidal Rule examples
 *     responses:
 *       200:
 *         description: A list of Trapezoidal Rule examples
 */

// API route to get Trapezoidal Rule  examples
app.get('/trapezoidal', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Trapezoidal' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Trapezoidal Rule examples' });
  }
});

/**
 * @swagger
 * /simpson:
 *   get:
 *     summary: Get Simpson Rule examples
 *     responses:
 *       200:
 *         description: A list of Simpson Rule examples
 */

// API route to get Simpson Rule examples
app.get('/simpson', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Simpson' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Multiple Simpson Rule examples' });
  }
});

/**
 * @swagger
 * /differentiate:
 *   get:
 *     summary: Get Differentaite examples
 *     responses:
 *       200:
 *         description: A list of Differentaite examples
 */

// API route to get Differentaite examples
app.get('/differentiate', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Differentaite' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Differentaite examples' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
