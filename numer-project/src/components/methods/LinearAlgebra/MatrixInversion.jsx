import React, { useState, useEffect } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BlockMath } from 'react-katex';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const formatMatrixWithColor = (mat, rowColorMap = {}, precision = 2, withLine = true) => {
    const n = mat[0].length / (withLine ? 2 : 1); // Adjust column count based on whether there's a vertical line
    const columnSpec = withLine ? `${'c'.repeat(n)}|${'c'.repeat(n)}` : `${'c'.repeat(n)}`;
    return `\\left[\\begin{array}{${columnSpec}} ${mat.map((row, i) =>
      row.map((val, j) => {
        const color = rowColorMap[i]?.includes(j) ? 'red' : 'black';
        return `\\textcolor{${color}}{${val.toFixed(precision)}}`;
      }).join(' & ')
    ).join(' \\\\ ')} \\end{array}\\right]`;
};

const MatrixInversion = () => {
    const [matrixSize, setMatrixSize] = useState(3);
    const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
    const [vectorB, setVectorB] = useState(Array(3).fill('')); 
    const [results, setResults] = useState(null);
    const [steps, setSteps] = useState([]);
    const [precision, setPrecision] = useState(2);
    const [solutionVector, setSolutionVector] = useState(null); 
    const [examples, setExamples] = useState([]); // To store the list of examples
    const [selectedExample, setSelectedExample] = useState('');
    const [method, setMethod] = useState('inversion');
  
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
        setVectorB  (selected.solution); 
        setPrecision(selected.precision); 
      }
    };

    const handleMatrixSizeChange = (e) => {
        const size = parseInt(e.target.value, 10);
        setMatrixSize(size);
        setMatrix(Array.from({ length: size }, () => Array(size).fill('')));
        setVectorB(Array(size).fill('')); 
        setResults(null);
        setSteps([]);
        setSolutionVector(null);
    };

    const handleMatrixChange = (rowIndex, colIndex, value) => {
        const newMatrix = matrix.map((row, rIndex) =>
            rowIndex === rIndex ? row.map((col, cIndex) => (colIndex === cIndex ? value : col)) : row
        );
        setMatrix(newMatrix);
    };

    const handleVectorBChange = (index, value) => {
        const newVectorB = [...vectorB];
        newVectorB[index] = value;
        setVectorB(newVectorB);
    };

    const fillEmptyWithZero = () => {
        const filledMatrix = matrix.map((row) =>
            row.map((col) => (col === '' ? '0' : col))
        );
        setMatrix(filledMatrix);
        setVectorB(vectorB.map((val) => (val === '' ? '0' : val)));
    };

    const calculateMatrixInversion = () => {
        if (matrix.some(row => row.some(col => col === ''))) {
            alert('Please fill in all matrix entries.');
            return;
        }
        if (vectorB.some(val => val === '')) {
            alert('Please fill in all vector B entries.');
            return;
        }

        if (matrixSize < 3) {
            alert('Matrix size must be at least 3x3.');
            return;
        }

        const originalMatrix = matrix.map(row => row.map(Number));
        const n = originalMatrix.length;
        const identityMatrix = Array.from({ length: n }, (_, i) =>
            Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
        );
        const steps = [];

        const augMatrix = originalMatrix.map((row, i) => row.concat(identityMatrix[i]));

        // Initial Matrix
        steps.push(`\\text{Initial augmented matrix:} ${formatMatrixWithColor(augMatrix, {}, precision)}`);

        // Perform Gauss-Jordan on augmented matrix
        for (let i = 0; i < n; i++) {
            // Make the diagonal element 1
            const pivot = augMatrix[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augMatrix[i][j] /= pivot;
            }
            steps.push(`R_{${i + 1}} \\rightarrow \\frac{1}{${pivot.toFixed(precision)}} R_{${i + 1}} : ${formatMatrixWithColor(augMatrix, { [i]: [i] }, precision)}`);

            // Eliminate the other rows
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augMatrix[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augMatrix[k][j] -= factor * augMatrix[i][j];
                    }
                    steps.push(`R_{${k + 1}} \\rightarrow R_{${k + 1}} - (${factor.toFixed(precision)})R_{${i + 1}} : ${formatMatrixWithColor(augMatrix, { [k]: [i] }, precision)}`);
                }
            }
        }

        const inverseMatrix = augMatrix.map(row => row.slice(n));
        const identityCheck = augMatrix.map(row => row.slice(0, n));
 
        steps.push(`\\text{Final augmented matrix:} ${formatMatrixWithColor(augMatrix, {}, precision)}`);

        const vectorBNumbers = vectorB.map(Number);
        const solutionX = inverseMatrix.map(row => row.reduce((sum, val, index) => sum + val * vectorBNumbers[index], 0));

        setResults({ inverse: inverseMatrix, identity: identityCheck, steps });
        setSolutionVector(solutionX);
    };

    const clearAllInputs = () => {
        setMatrixSize(3);
        setMatrix(Array.from({ length: 3 }, () => Array(3).fill('')));
        setVectorB(Array(3).fill(''));
        setResults(null);
        setSteps([]);
        setSolutionVector(null);
        setPrecision(6);
    };

    return (
        <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Input Matrix for Matrix Inversion Method</CardTitle>
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

                        <div>
                            <Label>Input Vector B</Label>
                            {vectorB.map((val, index) => (
                                <Input
                                    key={index}
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleVectorBChange(index, e.target.value)}
                                    placeholder={`b${index + 1}`}
                                    className="w-full mt-2"
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
                        <Button onClick={calculateMatrixInversion} className="bg-neutral-950 hover:bg-neutral-800">
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

            <div className="mt-4 mx-auto p-5 overflow-x-auto">
                {results && (
                    <div className="mt-4 space-y-4">
                        <BlockMath math={`\\text{Matrix Inversion Solution Steps}`} />
                        
                        {results.steps.map((step, index) => (
                            <BlockMath key={index} math={step} />
                        ))}
                        <BlockMath
                            math={`\\text{Inverse Matrix: } ${formatMatrixWithColor(results.inverse, {}, precision, false)}`}
                        />
                    </div>
                )}

                {solutionVector && (
                    <div className="mt-4 overflow-x-auto">
                      <BlockMath math={`A^{-1}B = x`}/>
                      <BlockMath 
                      math={`${formatMatrixWithColor(results.inverse, {}, precision, false)} 
                            \\begin{bmatrix} ${vectorB.map(b => Number(b).toFixed(precision)).join(' \\\\ ')} 
                            \\end{bmatrix}
                            \\text{ = }
                            \\begin{bmatrix} ${solutionVector.map(x => x.toFixed(precision)).join(' \\\\ ')} 
                            \\end{bmatrix}`}
                      />
                      
                      <BlockMath math={`\\text{Solution Vector: }`} />
                      <BlockMath 
                      math={`\\begin{bmatrix} ${solutionVector.map(x => x.toFixed(precision)).join(' \\\\ ')} 
                            \\end{bmatrix}`} 
                      />
                      <BlockMath 
                      math={`\\text{Final Solution: } (x_1, x_2, ..., x_${matrixSize}) = (${solutionVector.map((sol) => 
                      sol.toFixed(precision)).join(', ')})` }
                            />
                            
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatrixInversion;
