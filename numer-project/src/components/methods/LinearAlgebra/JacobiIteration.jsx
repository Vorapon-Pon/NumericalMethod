import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BlockMath } from 'react-katex';
import Plot from 'react-plotly.js';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const JacobiIteration = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [bVector, setBVector] = useState(Array(3).fill(''));
  const [initialX, setInitialX] = useState(Array(3).fill(0)); // Initial guess for x
  const [results, setResults] = useState(null);
  const [precision, setPrecision] = useState(6);
  const [iterations, setIterations] = useState(15);
  const [errors, setErrors] = useState([]);
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('jacobi');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${method}`);
        setExamples(response.data);
      } catch (error) {
        console.error('Error fetching examples:', error);
      }
    };

    fetchData();
  }, [method]);

  const handleSelectExample = (value) => {
  const selected = examples[value];
  if (selected) {
    setMatrixSize(selected.dimension || 3); 
    setMatrix(selected.matrix || Array.from({ length: selected.dimension || 3 }, () => Array(selected.dimension || 3).fill('')));
    setBVector(selected.solution || Array(selected.dimension || 3).fill(''));
    setInitialX(selected.initialX || Array(selected.dimension || 3).fill(0));
    setIterations(selected.iteration || 15); 
    setPrecision(selected.precision || 6); 
  }
};

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setMatrix(Array.from({ length: size }, () => Array(size).fill('')));
    setBVector(Array(size).fill(''));
    setInitialX(Array(size).fill(0));
    setResults(null);
    setErrors([]);
  };

  const handleChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIndex) =>
      rowIndex === rIndex ? row.map((col, cIndex) => (colIndex === cIndex ? value : col)) : row
    );
    setMatrix(newMatrix);
  };

  const handleBChange = (index, value) => {
    const newBVector = bVector.map((val, idx) => (index === idx ? value : val));
    setBVector(newBVector);
  };

  const handleInitialXChange = (index, value) => {
    const newInitialX = initialX.map((val, idx) => (index === idx ? Number(value) : val));
    setInitialX(newInitialX);
  };

  const fillEmptyWithZero = () => {
    const filledMatrix = matrix.map((row) =>
      row.map((col) => (col === '' ? '0' : col))
    );
    const filledBVector = bVector.map(val => (val === '' ? '0' : val));
    setMatrix(filledMatrix);
    setBVector(filledBVector);
  };

  const calculateJacobiIteration = () => {
    if (matrix.some(row => row.some(col => col === '')) || bVector.some(val => val === '')) {
      alert('Please fill in all matrix and vector entries.');
      return;
    }

    const n = matrixSize;
    const a = matrix.map(row => row.map(Number));
    const b = bVector.map(Number);
    const xOld = [...initialX]; 
    const xNew = Array(n).fill(0);
    const steps = [];
    const errorValues = [];

    for (let iter = 0; iter < iterations; iter++) {
      let iterationError = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += a[i][j] * xOld[j];
          }
        }
        xNew[i] = (b[i] - sum) / a[i][i];
        iterationError[i] = Math.abs((xNew[i] - xOld[i]) / xNew[i]);
      }

      steps.push({
        iteration: iter + 1,
        xValues: [...xNew],
        error: [...iterationError]
      });
      
      errorValues.push([...iterationError]);
      console.log(errorValues);

      for (let i = 0; i < n; i++) {
        xOld[i] = xNew[i];
      }

      if (iterationError.every(err => err < Math.pow(10, -precision))) {
        break;
      }
    }

    setResults({ steps });
    setErrors(errorValues);
  };

  const clearAllInputs = () => {
    setMatrixSize(3);
    setMatrix(Array.from({ length: 3 }, () => Array(3).fill('')));
    setBVector(Array(3).fill(''));
    setInitialX(Array(3).fill(0)); 
    setResults(null);
    setPrecision(2);
    setIterations(10);
    setErrors([]);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Input Matrix for Jacobi Iteration Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                value={matrixSize}
                onChange={handleMatrixSizeChange}
                placeholder="Matrix Size (N)"
                className="w-full"
                min={2}
                max={10}
              />
            </div>

            {matrix.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-2">
                {row.map((col, colIndex) => (
                  <Input
                    key={colIndex}
                    type="number"
                    value={col}
                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                    placeholder={`a${rowIndex + 1}${colIndex + 1}`}
                    className="w-full"
                  />
                ))}
              </div>
            ))}

            <div className="space-y-2">
              <Label>Input Matrix B:</Label>
              {bVector.map((bi, index) => (
                <Input
                  key={index}
                  type="number"
                  value={bi}
                  onChange={(e) => handleBChange(index, e.target.value)}
                  placeholder={`b${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>Initial Guess for x (x_start):</Label>
              {initialX.map((xi, index) => (
                <Input
                  key={index}
                  type="number"
                  value={xi}
                  onChange={(e) => handleInitialXChange(index, e.target.value)}
                  placeholder={`x_start${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>Number of Iterations:</Label>
              <Input
                type="number"
                value={iterations}
                onChange={(e) => setIterations(Math.max(1, parseInt(e.target.value, 10)))}
                placeholder="Iterations"
                className="w-full"
                min={1}
              />
            </div>

            <div className="flex space-x-2">
              <div className="mb-2 w-full">
                <Label htmlFor="precision">Set Precision</Label>
                <Input
                  id="precision"
                  type="number"
                  value={precision}
                  onChange={(e) => setPrecision(Math.max(0, parseInt(e.target.value, 10)))}
                  placeholder="Precision (Decimal Places)"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Dropdown to choose an example */}
          <div div className="mb-4">
            <Label htmlFor="example">Choose an Example</Label>
            <Select value={selectedExample} onValueChange={handleSelectExample}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an example" />
            </SelectTrigger>
            <SelectContent>
          {examples.map((example, index) => (
            <SelectItem key={index} value={index.toString()}>
              {`Example ${index + 1}: ${example.dimension} Dimension`}
            </SelectItem>
          ))}
            </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={calculateJacobiIteration} className="bg-neutral-950 hover:bg-neutral-800">
              Calculate
            </Button>
            <Button onClick={fillEmptyWithZero} className="bg-neutral-950 hover:bg-neutral-800">
              Fill Empty with 0
            </Button>
            <Button onClick={clearAllInputs} className="bg-red-950 hover:bg-red-800">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-4 w-full">

            <div className="mt-4 justify-center">
            <Plot
              data={errors[0].map((_, idx) => ({
                x: results.steps.map(step => step.iteration),
                y: errors.map(err => err[idx]),
                type: 'scatter',
                mode: 'lines+markers',
                name: `Error x${idx + 1}`
              }))}
              layout={{ 
                title: 'Error Graph', 
                xaxis: { title: 'Iteration' }, 
                yaxis: { title: 'Error' } }}
              config={{
                displayModeBar: true, 
                scrollZoom: true,
              }}
            />
          </div>

          <BlockMath math={`\\text{Jacobi Iteration Formula: } x_i^{(k+1)} = \\frac{b_i - \\sum_{j \\neq i} a_{ij} x_j^{(k)}}{a_{ii}}`} />
          
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Iteration</th>
                  {Array(matrixSize).fill().map((_, idx) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2">{`x${idx + 1}`}</th>
                  ))}
                  {Array(matrixSize).fill().map((_, idx) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2">{`Error x${idx + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.steps.map((step, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{step.iteration}</td>
                    {step.xValues.map((x, i) => (
                      <td key={i} className="border border-gray-300 px-4 py-2 text-center">{x.toFixed(precision)}</td>
                    ))}
                    {step.error.map((err, i) => (
                      <td key={i} className="border border-gray-300 px-4 py-2 text-center">{err.toFixed(precision)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default JacobiIteration;
