import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const GaussianElimination = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(4).fill('')));
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [precision, setPrecision] = useState(6);

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setMatrix(Array.from({ length: size }, () => Array(size + 1).fill('')));
    setResults(null);
    setSteps([]);
  };

  const handleChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIndex) =>
      rowIndex === rIndex ? row.map((col, cIndex) => (colIndex === cIndex ? value : col)) : row
    );
    setMatrix(newMatrix);
  };

  const fillEmptyWithZero = () => {
    const filledMatrix = matrix.map((row) =>
      row.map((col) => (col === '' ? '0' : col))
    );
    setMatrix(filledMatrix);
  };

  const calculateGaussianElimination = () => {
    if (matrix.some(row => row.some(col => col === ''))) {  
      alert('Please fill in all matrix entries.');
      return;
    }

    if (matrixSize < 3) {
        alert('Matrix size must be at least 3x3.');
        return; 
      }
    
  
    const augMatrix = matrix.map(row => row.map(Number));
    const n = augMatrix.length;
    const steps = [];
    const sol = new Array(n).fill(0);
  
    const formatMatrixWithColor = (mat, rowColorMap = {}) => {
      return `\\begin{bmatrix} ${mat.map((row, i) => row.map((val, j) => {
        const color = rowColorMap[i]?.includes(j) ? 'red' : 'black';
        return `\\textcolor{${color}}{${val.toFixed(2)}}`;
      }).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
    };
  
    steps.push(`\\text{Initial matrix:} ${formatMatrixWithColor(augMatrix)}`);
  
    // Forward Elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augMatrix[k][i]) > Math.abs(augMatrix[maxRow][i])) {
          maxRow = k;
        }
      }
  
      // Swap if necessary
      if (maxRow !== i) {
        [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];
        steps.push(`R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}} : ${formatMatrixWithColor(augMatrix)}`);
      }
  
      // Eliminate below pivot
      for (let k = i + 1; k < n; k++) {
        const factor = augMatrix[k][i] / augMatrix[i][i];
        steps.push(`\\text{Factor: } \\frac{a_{${k + 1}, ${i + 1}}}{a_{${i + 1}, ${i + 1}}} = ${factor.toFixed(2)}`);
  
        augMatrix[k][i] = 0;  // The current element is zeroed
        for (let j = i + 1; j <= n; j++) {
          augMatrix[k][j] -= factor * augMatrix[i][j];
        }
  
        steps.push(`R_{${k + 1}} \\rightarrow R_{${k + 1}} - (${factor.toFixed(2)})R_{${i + 1}} : ${formatMatrixWithColor(augMatrix, {[k]: [i]})}`);
      }
    }
  
    steps.push(`\\text{After forward elimination: } ${formatMatrixWithColor(augMatrix)}`);
  
    // Back Substitution
    for (let i = n - 1; i >= 0; i--) {
      sol[i] = augMatrix[i][n] / augMatrix[i][i];
      for (let k = i - 1; k >= 0; k--) {
        augMatrix[k][n] -= augMatrix[k][i] * sol[i];
      }
      steps.push(`x_{${i + 1}} = \\frac{b_{${i + 1}} ${i < n - 1 ? ' - ' + augMatrix[i].slice(i + 1, n).map((v, idx) => `${v.toFixed(2)}x_{${i + idx + 2}}`).join(' - ') : ''}}{a_{${i + 1}, ${i + 1}}}`);
    }
  
    setResults({ solution: sol, steps });
  };

  const clearAllInputs = () => {
    setMatrixSize(3); 
    setMatrix(Array.from({ length: 3 }, () => Array(4).fill('')));
    setResults(null);
    setSteps([]);
    setPrecision(6);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full  shadow-lg">
        <CardHeader>
          <CardTitle>Input Matrix for Gaussian Elimination</CardTitle>
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
            <Button onClick={calculateGaussianElimination} className="bg-neutral-950 hover:bg-neutral-800">
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
            <BlockMath math={`\\text{Gaussian Elimination Solution Steps}`} />
            
            {results.steps.map((step, index) => (
              <BlockMath key={index} math={step} />
            ))}
            <BlockMath
              math={`\\text{Final Solution: } (x_1,  x_2,  ..., x_${matrixSize}) = (${results.solution
                .map((sol) => sol.toFixed(precision))
                .join(',  ')})`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GaussianElimination;
