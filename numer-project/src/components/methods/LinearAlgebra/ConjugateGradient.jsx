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

const ConjugateGradient = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [bVector, setBVector] = useState(Array(3).fill(''));
  const [initialX, setInitialX] = useState(Array(3).fill(0));
  const [results, setResults] = useState(null);
  const [precision, setPrecision] = useState(6);
  const [tolerance, setTolerance] = useState(0.000001);
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('conjugate');

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
      setMatrixSize(selected.dimension); 
      setMatrix(selected.matrix);
      setBVector(selected.solution);
      setInitialX(selected.initialX);
      setTolerance(selected.tolerance)
      setPrecision(selected.precision); 
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
    const filledBVector = bVector.map((val) => (val === '' ? '0' : val));
    setMatrix(filledMatrix);
    setBVector(filledBVector);
  };

  const multiplyMatrices = (A, B) => {
    const n = A.length;
    const m = B[0].length;
    const p = A[0].length;
    const result = Array.from({ length: n }, () => Array(m).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < p; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
};

const subtractMatrices = (A, B) => {
    const n = A.length;
    const m = A[0].length;
    const result = Array.from({ length: n }, () => Array(m).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
};

const addMatrices = (A, B) => {
    const n = A.length;
    const m = A[0].length;
    const result = Array.from({ length: n }, () => Array(m).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return result;
};

const scalarMultiplyMatrix = (matrix, scalar) => {
    const n = matrix.length;
    const m = matrix[0].length;
    const result = Array.from({ length: n }, () => Array(m).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            result[i][j] = matrix[i][j] * scalar;
        }
    }
    return result;
};

const transposeMatrix = (matrix) => {
    const n = matrix.length;
    const m = matrix[0].length;
    const result = Array.from({ length: m }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
};

const findR = (A, B, x) => {
  const xMatrix = x.map((xi) => [xi]); // Ensure x is treated as a column vector
  const Ax = multiplyMatrices(A, xMatrix);
  return subtractMatrices(Ax, B); // Now both Ax and B are matrices
};

const findD = (R, alpha, D) => {
    const minusR = scalarMultiplyMatrix(R, -1);
    const alphaD = scalarMultiplyMatrix(D, alpha);
    return addMatrices(minusR, alphaD);
};

const findRambda = (A, D, R) => {
    const tD = transposeMatrix(D);
    const DtR = multiplyMatrices(tD, R);
    const DtAD = multiplyMatrices(multiplyMatrices(tD, A), D);

    const scalarDtR = DtR[0][0];
    const scalarDtAD = DtAD[0][0];

    return -scalarDtR / scalarDtAD;
};

const findX = (X, rambda, D) => {
    const rD = scalarMultiplyMatrix(D, rambda);
    return addMatrices(X, rD);
};

const findError = (R) => {
    const tR = transposeMatrix(R);
    const matrixResult = multiplyMatrices(tR, R);
    return Math.sqrt(matrixResult[0][0]);
};

const findAlpha = (R, A, D) => {
    const Rt = transposeMatrix(R);
    const RtAD = multiplyMatrices(multiplyMatrices(Rt, A), D);
    const scalarRtAD = RtAD[0][0];

    const Dt = transposeMatrix(D);
    const DtAD = multiplyMatrices(multiplyMatrices(Dt, A), D);
    const scalarDtAD = DtAD[0][0];

    return scalarRtAD / scalarDtAD;
};

const calculateConjugateGradient = () => {
  const A = matrix.map((row) => row.map((val) => parseFloat(val)));
  const bMatrix = bVector.map((val) => [parseFloat(val)]); // Convert b to a matrix
  let x = initialX.map((val) => [val]); // Convert initial x to a column matrix

  let r = findR(A, bMatrix, x); // r^0 = A*x^0 - b
  let d = scalarMultiplyMatrix(r, -1); // d^0 = -r^0
  let err = findError(r);

  const steps = [];
  let iteration = 0;

  while (err > tolerance && iteration < 1000) {
      const lamb = findRambda(A, d, r); 
      const xNext = findX(x, lamb, d);
      const rNext = findR(A, bMatrix, xNext); 
      err = findError(rNext);
      const alpha = findAlpha(rNext, A, d);
      const dNext = findD(rNext, alpha, d);

      steps.push({
          iteration,
          lambda: lamb,
          D: d.flat(),
          X: xNext.flat(),
          R: rNext.flat(),
          error: err,
      });

      x = xNext;
      r = rNext;
      d = dNext;

      iteration++;
  }

  setResults({ steps });
};

  const clearAllInputs = () => {
    setMatrixSize(3);
    setMatrix(Array.from({ length: 3 }, () => Array(3).fill('')));
    setBVector(Array(3).fill(''));
    setInitialX(Array(3).fill(0));
    setResults(null);
    setPrecision(2);
    setTolerance(0.000001);
    setErrors([]);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Input Matrix for Conjugate Gradient Method</CardTitle>
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

            <div className="flex space-x-2">
              <div className="mb-2 w-full">
                <Label htmlFor="tolerance">Set Tolerance</Label>
                <Input
                  id="tolerance"
                  type="number"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  placeholder="Tolerance"
                  min={0}
                  step="0.0001"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="mb-2 w-full">
                <Label htmlFor="precision">Set Precision </Label>
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
              <Button onClick={calculateConjugateGradient} className="bg-neutral-950 hover:bg-neutral-800">
                Calculate
              </Button>
              <Button onClick={fillEmptyWithZero} className="bg-neutral-950 hover:bg-neutral-800">
                Fill Empty with 0
              </Button>
              <Button onClick={clearAllInputs} className="bg-red-950 hover:bg-red-800">
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-4 w-full">
          <Plot
            data={[]}
            layout={{
              title: 'Contour Plot',
              xaxis: { title: 'x1' },
              yaxis: { title: 'x2' },
              width: 600,
              height: 500,
            }}
          />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.steps.map((step, index) => (
                  <div key={index}>
                    <Label>{`Iteration ${step.iteration}:`}</Label>
                    <BlockMath math={`
                    \\lambda = ${step.lambda.toFixed(precision)}, 
                    \\ D^k = \\begin{bmatrix}${step.D.map((di) => di.toFixed(precision)).join(' \\\\ ')}\\end{bmatrix}, 
                    \\ X^k = \\begin{bmatrix}${step.X.map((xi) => xi.toFixed(precision)).join(' \\\\ ')}\\end{bmatrix}, 
                    \\ R^k = \\begin{bmatrix}${step.R.map((ri) => ri.toFixed(precision)).join(' \\\\ ')}\\end{bmatrix}, 
                    \\ \\text{Error} = ${step.error.toFixed(precision)}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConjugateGradient;
