import React, { useState, useEffect } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BlockMath } from 'react-katex';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const LUDecomposition = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [bVector, setBVector] = useState(Array(3).fill(''));
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [precision, setPrecision] = useState(6);
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('ludecomposition');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://numerical-method-backend.vercel.app/${method}`);
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
      setMatrixSize(selected.dimension); 
      setMatrix(selected.matrix); 
      setBVector(selected.solution); 
      setPrecision(selected.precision); 
    }
  };

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setMatrix(Array.from({ length: size }, () => Array(size).fill('')));
    setBVector(Array(size).fill(''));
    setResults(null);
    setSteps([]);
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

  const fillEmptyWithZero = () => {
    const filledMatrix = matrix.map((row) =>
      row.map((col) => (col === '' ? '0' : col))
    );
    const filledBVector = bVector.map(val => (val === '' ? '0' : val));
    setMatrix(filledMatrix);
    setBVector(filledBVector);
  };

  const calculateLUDecomposition = () => {
    if (matrix.some(row => row.some(col => col === '')) || bVector.some(val => val === '')) {
      alert('Please fill in all matrix and vector entries.');
      return;
    }
  
    const n = matrixSize;
    const a = matrix.map(row => row.map(Number));
    const b = bVector.map(Number);
    const l = Array.from({ length: n }, () => Array(n).fill(0));
    const u = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = [];
  
    for (let i = 0; i < n; i++) {
      u[i][i] = 1;
  
      for (let j = i; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) {
          sum += l[j][k] * u[k][i];
        }
        l[j][i] = a[j][i] - sum;
      }
  
      for (let j = i + 1; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) {
          sum += l[i][k] * u[k][j];
        }
        u[i][j] = (a[i][j] - sum) / l[i][i];
      }
  
      // Save current step for displaying
      steps.push(`\\text{Step ${i + 1}: Updated L and U matrices:}`);
      steps.push(`L = \\begin{bmatrix} ${l.map(row => row.map(val => val.toFixed(precision)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`);
      steps.push(`U = \\begin{bmatrix} ${u.map(row => row.map(val => val.toFixed(precision)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`);
    }
  
    // Forward substitution to solve L*y = B
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += l[i][j] * y[j];
      }
      y[i] = (b[i] - sum) / l[i][i];
    }
  
    steps.push(`\\text{Forward Substitution to solve L}Y = B:`);
    steps.push(`Y = \\begin{bmatrix} ${y.map(val => val.toFixed(precision)).join(' \\\\ ')} \\end{bmatrix}`);
  
    // Backward substitution to solve U*x = y
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += u[i][j] * x[j];
      }
      x[i] = y[i] - sum;  // Since U[i][i] is 1, we don't divide
    }
  
    steps.push(`\\text{Backward Substitution to solve U}X = Y:`);
    steps.push(`X = \\begin{bmatrix} ${x.map(val => val.toFixed(precision)).join(' \\\\ ')} \\end{bmatrix}`);
  
    setResults({ solution: x, steps });
  };

  const clearAllInputs = () => {
    setMatrixSize(3); 
    setMatrix(Array.from({ length: 3 }, () => Array(3).fill('')));
    setBVector(Array(3).fill(''));
    setResults(null);
    setSteps([]);
    setPrecision(6);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Input Matrix for LU Decomposition</CardTitle>
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
            <Button onClick={calculateLUDecomposition} className="bg-neutral-950 hover:bg-neutral-800">
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

      <div className="mt-4 mx-auto p-5">
        {results && (
          <div className="mt-4 space-y-4">
            <BlockMath math={`\\text{LU Decomposition Solution Steps}`} />
            
            {results.steps.map((step, index) => (
              <BlockMath key={index} math={step} />
            ))}
            
            <div className="bg-gray-100 p-3 rounded-md">
              <BlockMath math={`\\text{Solution: } X = \\begin{bmatrix} ${results.solution.map((val) => val.toFixed(precision)).join(' \\\\ ')} \\end{bmatrix}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LUDecomposition;
