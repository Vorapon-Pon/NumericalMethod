import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const CramersRule = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [b, setB] = useState(Array.from({ length: 3 }, () => ''));
  const [results, setResults] = useState(null);
  const [precision, setPrecision] = useState(6); // Default precision

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setMatrix(Array.from({ length: size }, () => Array(size).fill('')));
    setB(Array.from({ length: size }, () => ''));
  };

  const handleMatrixChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIndex) =>
      rowIndex === rIndex ? row.map((col, cIndex) => (colIndex === cIndex ? value : col)) : row
    );
    setMatrix(newMatrix);
  };

  const handleBChange = (index, value) => {
    const newB = b.map((bi, bIndex) => (index === bIndex ? value : bi));
    setB(newB);
  };

  const fillEmptyWithZero = () => {
    const filledMatrix = matrix.map((row) =>
      row.map((col) => (col === '' ? '0' : col))
    );
    setMatrix(filledMatrix);
    const filledB = b.map((col) => (col === '' ? '0' : col));
    setB(filledB);
  };

  const isMatrixFilled = () => {
    for (let row of matrix) {
      if (row.includes('') || row.includes(null)) {
        return false;
      }
    }
    return b.every(value => value !== '');
  };

  const determinantNxN = (matrix) => {
    const n = matrix.length;
  
    if (n === 1) return matrix[0][0];
  
    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
  
    let det = 0;
  
    for (let col = 0; col < n; col++) {
      const minor = matrix.slice(1).map((row) =>
        row.filter((_, index) => index !== col)
      );
      det += matrix[0][col] * determinantNxN(minor) * (col % 2 === 0 ? 1 : -1);
    }

    if(det === 0) {
      alert('Cramers rule does not apply determinant matrix 0');
      return;
    }
  
    return det;
  };
  

  const calculateCramersRule = () => {
    if (!isMatrixFilled()) {
      alert('Please fill all matrix fields before calculating.');
      return;
    }

    const A = matrix.map((row) => row.map(Number));
    const B = b.map(Number);

    const detA = determinantNxN(A);

    if (detA === 0) {
      setResults('The system has no unique solution.');
      return;
    }

    const dets = [];
    const solutions = [];

    for (let i = 0; i < matrixSize; i++) {
      const Ai = A.map((row, rowIndex) =>
        row.map((col, colIndex) => (colIndex === i ? B[rowIndex] : col))
      );
      const detAi = determinantNxN(Ai);
      dets.push(detAi);
      solutions.push(detAi / detA);
    }

    setResults({ detA, dets, solutions });
  };

  const clearAllInputs = () => {
    setMatrixSize(3);
    setMatrix(Array.from({ length: 3 }, () => Array(3).fill('')));
    setB(Array.from({ length: 3 }, () => ''));
    setResults(null);
    setPrecision(2);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg ">
        <CardHeader>
          <CardTitle>Input Matrix Dimension NxN</CardTitle>
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
                    onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                    placeholder={`a${rowIndex + 1}${colIndex + 1}`}
                    className="w-full"
                  />
                ))}
              </div>
            ))}

            <div className="space-y-2">
              <Label>Input Matrix B:</Label>
              {b.map((bi, index) => (
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
            <Button onClick={calculateCramersRule} className="bg-neutral-950 hover:bg-neutral-800">
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

      <div className="mt-4 mx-auto p-5 ">
        {results && (
          <div className="mt-4 space-y-4">
            <BlockMath math={`\\text{From Cramer's Rule: } x_i = \\frac{\\det(A_i)}{\\det(A)}`} />

            <BlockMath
              math={`\\det(A) = \\begin{vmatrix} ${matrix
                .map((row, rowIndex) =>
                  row.map((val, colIndex) => matrix[rowIndex][colIndex]).join(' & ')
                )
                .join(' \\\\ ')} \\end{vmatrix} = ${results.detA}` }
            />

            {results.solutions.map((solution, index) => (
              <BlockMath
                key={index}
                math={`x_${index + 1} = \\frac{\\det(A_${index + 1})}{\\det(A)} = \\frac{${
                  results.dets[index]
                }}{${results.detA}} = ${solution.toFixed(precision)}` }
              />
            ))}

            <BlockMath
              math={`\\text{Final Solution: } (x_1, x_2, ..., x_${matrixSize}) = (${results.solutions
                .map((sol) => sol.toFixed(precision))
                .join(', ')})` }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CramersRule;
