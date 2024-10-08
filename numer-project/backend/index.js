import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Replace <username>, <password>, and <cluster-url> with your own values)
mongoose.connect('mongodb+srv://voraponwpon:d52uQ9sC7TOzUtTw@cluster.r06og.mongodb.net/Example?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for the examples
const exampleSchema = new mongoose.Schema({
  equation: String,
  xL: Number,
  xR: Number,
  tolerance: Number,
  precision: Number,
  method: String, // Field to differentiate methods
});

const Example = mongoose.model('Example', exampleSchema);

// API route to get Bisection examples
app.get('/bisection', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Bisection' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Bisection examples' });
  }
});

// API route to get False Position examples
app.get('/falseposition', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'FalsePosition' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching False Position examples' });
  }
});

// API route to get Newton-Raphson examples
app.get('/newtonraphson', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'NewtonRaphson' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Newton-Raphson examples' });
  }
});

// API route to get Secant method examples
app.get('/secant', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'Secant' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Secant examples' });
  }
});

// API route to get One Point Iteration examples
app.get('/onepointiteration', async (req, res) => {
  try {
    const examples = await Example.find({ method: 'OnePoint' });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching One Point Iteration examples' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
