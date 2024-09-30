import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const CholeskyDecomposition = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [bVector, setBVector] = useState(Array(3).fill(''));
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [precision, setPrecision] = useState(2);

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

  const calculateCholeskyDecomposition = () => {
    if (matrix.some(row => row.some(col => col === '')) || bVector.some(val => val === '')) {  
      alert('Please fill in all matrix and vector entries.');
      return;
    }

    const n = matrixSize;
    const a = matrix.map(row => row.map(Number));
    const b = bVector.map(Number);
    const l = Array.from({ length: n }, () => Array(n).fill(0));
    const lt = Array.from({ length: n }, () => Array(n).fill(0)); // L transpose matrix
    const steps = [];

    // Cholesky Decomposition
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;

        if (j === i) { // Diagonal elements
          for (let k = 0; k < j; k++) {
            sum += Math.pow(l[j][k], 2);
          }
          l[j][j] = Math.sqrt(a[j][j] - sum);
        } else { // Off-diagonal elements
          for (let k = 0; k < j; k++) {
            sum += l[i][k] * l[j][k];
          }
          l[i][j] = (a[i][j] - sum) / l[j][j];
        }
      }

      steps.push(`\\text{Step ${i + 1}: Updated L matrix:}`);
      steps.push(`L = \\begin{bmatrix} ${l.map(row => row.map(val => val.toFixed(precision)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`);
    }

    // Compute L^T (transpose of L)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        lt[j][i] = l[i][j];
      }
    }
    steps.push(`L^T = \\begin{bmatrix} ${lt.map(row => row.map(val => val.toFixed(precision)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`);

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

    // Backward substitution to solve L^T*x = y
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += lt[i][j] * x[j]; // using L^T here
      }
      x[i] = (y[i] - sum) / lt[i][i];
    }

    steps.push(`\\text{Backward Substitution to solve L}^T X = Y:`);
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
          <CardTitle>Input Matrix for Cholesky Decomposition</CardTitle>
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

          <div className="flex space-x-2">
            <Button onClick={calculateCholeskyDecomposition} className="bg-neutral-950 hover:bg-neutral-800">
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
            <BlockMath math={`\\text{Cholesky Decomposition Steps:}`} />
            {results.steps.map((step, index) => (
              <BlockMath key={index} math={step} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CholeskyDecomposition;
