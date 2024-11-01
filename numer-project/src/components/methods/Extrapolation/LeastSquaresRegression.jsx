import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BlockMath } from 'react-katex';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js'; 
import { Switch } from '@/components/ui/switch'; 
import { lusolve } from 'mathjs';

const LeastSquaresRegression = () => {
  const [points, setPoints] = useState([{ x: '', fx:''  }]);
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [regressionType, setRegressionType] = useState('linear');
  const [matrixFormula, setMatrixFormula] = useState('')
  const [matrixFormulaResult, setMatrixFormulaResult] = useState(''); 
  const [regressionEquation, setRegressionEquation] = useState('')
  const [regressionEquationSub, setRegressionEquationSub] = useState('');
  const [result, setResult] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [mOrder, setMOrder] = useState(1);
  const [xValue, setXValue] = useState(''); 
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('linearpoly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://numerical-method-backend.vercel.app/${method}`);
        setExamples(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching examples:', error);
      }
    };

    fetchData();
  }, [method]);

  const handleSelectExample = (value) => {
    const selected = examples[value];
    if (selected) {
      const pointsArray = selected.x.map((xVal, index) => ({
        x: xVal,
        fx: selected.y[index],
        selected: true, 
      }));

      setNumberOfPoints(selected.point);
      setPoints(pointsArray);
      setMOrder(selected.mOrder); 
      setXValue(selected.atX);
    }
  };

  const addPoint = () => {
    setPoints([...points, { x: '', fx: '' }]);
    setNumberOfPoints(numberOfPoints + 1);
  };

  const removePoint = () => {
    if (numberOfPoints > 1) {
      setPoints(points.slice(0, -1));
      setNumberOfPoints(numberOfPoints - 1);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: parseFloat(value) };
    setPoints(updatedPoints);
  };

  const handleToggle = (type) => {
    setRegressionType(type);
  };

  const handleXValueChange = (value) => {
    setXValue(parseFloat(value));
  };

  const calculateRegression = () => {
    if(regressionType == 'linear') {
      const n = points.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

      points.forEach(point => {
        sumX += point.x;
        sumY += point.fx;
        sumXY += point.x * point.fx;
        sumX2 += point.x * point.x;
      });

      const a1 = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const a0 = (sumY - a1 * sumX) / n;

    setRegressionEquation(`f(x) = a_0 + a_1 x`)
    setRegressionEquationSub(`f(x) = ${a0} + ${a1}x`);

    setMatrixFormula(`
      \\begin{bmatrix} n & \\sum_{i=1}^{n} x_i 
      \\\\ \\sum_{i=1}^{n} x_i & \\sum_{i=1}^{n} x_i^2 \\end{bmatrix}
      \\begin{bmatrix} a_0 
      \\\\ a_1 \\end{bmatrix}=
      \\begin{bmatrix} \\sum_{i=1}^{n} y_i \\\\ \\sum_{i=1}^{n} x_iy_i \\end{bmatrix}
      `)

    setMatrixFormulaResult(`
      \\begin{bmatrix}${n} & ${sumX} 
      \\\\${sumX} & ${sumX2}
      \\end{bmatrix}

      \\begin{bmatrix} a_0 
      \\\\a_1\\end{bmatrix} =
      \\begin{bmatrix}
      ${sumY} \\\\
      ${sumXY}
      \\end{bmatrix}
      `);

      setResult(`f(${xValue}) = ${a0} + ${a1}(${xValue}) = ${a0 + a1 * xValue}`)

    const regressionLine = {
      x: points.map(point => point.x),
      y: points.map(point => a0 + a1 * point.x),
      type: 'scatter',
      mode: 'lines',
      name: 'Regression Line',
      line: { color: 'skyblue' },
    };

    const pointData = {
      x: points.map(point => point.x),
      y: points.map(point => point.fx),
      mode: 'markers',
      type: 'scatter',
      name: 'Points',
      marker: { color: 'red', size: 8 },
    };

    const resultPoint = {
      x: [xValue],
      y: [a0 + a1 * xValue],
      mode: 'markers',
      type: 'scatter',
      name: 'Result',
      marker: { color: 'blue', size: 10, symbol: 'circle' },
    };

      setPlotData([pointData, regressionLine, resultPoint]);
  } else if(regressionType == 'polynomial') {
    const n = points.length;
    const order = mOrder;

    // Convert string inputs to numbers
    const parsedPoints = points.map(({ x, fx }) => ({
      x: parseFloat(x),
      fx: parseFloat(fx),
    }));

    if (isNaN(xValue)) {
      alert("Please enter a valid value for x to predict.");
      return;
    }

    // Initialize A and B matrices
    let A = Array.from({ length: order + 1 }, () => Array(order + 1).fill(0));
    let B = Array(order + 1).fill(0);

    parsedPoints.forEach(({ x, fx }) => {
      // Fill matrix B
      B[0] += fx;
      for (let j = 1; j <= order; j++) {
        B[j] += Math.pow(x, j) * fx;
      }

      // Fill matrix A
      for (let j = 0; j <= order; j++) {
        for (let l = 0; l <= order; l++) {
          A[j][l] += Math.pow(x, j + l);
        }
      }
    });

    try {
      // Solve A * coeff = B using lusolve
      const resultA = lusolve(A, B);
      const coefficients = resultA.map(Number);

      // Build the regression equation
      let equation = `f(x) = a_0`;
      for (let j = 1; j <= order; j++) {
        equation += ` + a_{${j}}x^{${j}}`;
      }

      setRegressionEquation(equation);

      // Substitute equation with actual values for prediction
      let substitutedEquation = `f(x) = ${coefficients[0].toFixed(6)}`;
      for (let j = 1; j <= order; j++) {
        substitutedEquation += ` + (${coefficients[j].toFixed(6)}) ${xValue}^${j}`;
      }
      const calculatedResult = coefficients.reduce(
        (acc, coeff, index) => acc + coeff * Math.pow(xValue, index),
        0
      );

      setRegressionEquationSub(substitutedEquation);
      setResult(`f(${xValue}) = ${calculatedResult.toFixed(6)}`);

      // Build matrix formula for display (in LaTeX)
      let matrixLatex = `\\begin{bmatrix} n`;
      for (let j = 1; j <= order; j++) {
        matrixLatex += ` & \\sum_{i=1}^{n} x_i^${j}`;
      }
      matrixLatex += ` \\\\`;

      for (let j = 1; j <= order; j++) {
        matrixLatex += `\\sum_{i=1}^{n} x_i^${j}`;
        for (let l = 1; l <= order; l++) {
          matrixLatex += ` & \\sum_{i=1}^{n} x_i^${j + l}`;
        }
        matrixLatex += ` \\\\`;
      }
      matrixLatex += `\\end{bmatrix}`;

      let matrixResultLatex = `\\begin{bmatrix}`;
      A.forEach(row => {
        matrixResultLatex += row.map(val => `${val}`).join(' & ') + ` \\\\`;
      });
      matrixResultLatex += `\\end{bmatrix}`;

      let bMatrixLatex = `\\begin{bmatrix}`;
      B.forEach(val => {
        bMatrixLatex += `${val} \\\\`;
      });
      bMatrixLatex += `\\end{bmatrix}`;

      setMatrixFormula(matrixLatex);
      setMatrixFormulaResult(matrixResultLatex);

      // Generate points to plot the polynomial curve
      const minX = Math.min(...parsedPoints.map(p => p.x));
      const maxX = Math.max(...parsedPoints.map(p => p.x));
      const step = (maxX - minX) / 100; // For a smooth curve
      const curveX = [];
      const curveY = [];

      for (let x = minX; x <= maxX; x += step) {
        let y = coefficients[0];
        for (let j = 1; j <= order; j++) {
          y += coefficients[j] * Math.pow(x, j);
        }
        curveX.push(x);
        curveY.push(y);
      }

      // Plotting the polynomial regression curve
      const regressionCurve = {
        x: curveX,
        y: curveY,
        type: 'scatter',
        mode: 'lines',
        name: 'Regression Curve',
        line: { color: 'skyblue' },
      };

      const pointData = {
        x: parsedPoints.map(point => point.x),
        y: parsedPoints.map(point => point.fx),
        mode: 'markers',
        type: 'scatter',
        name: 'Points',
        marker: { color: 'red', size: 8 },
      };

      const resultPoint = {
        x: [xValue],
        y: [calculatedResult],
        mode: 'markers',
        type: 'scatter',
        name: 'Result',
        marker: { color: 'skyblue', size: 10, symbol: 'circle' },
      };

      setPlotData([pointData, regressionCurve, resultPoint]);

    } catch (error) {
      console.error("Error in solving polynomial regression:", error);
      alert("An error occurred while solving the polynomial regression.");
    }
    }
  };

  const clearAllInputs = () => {
    setPoints([{ x: 0, fx: 0 }]);
    setNumberOfPoints(1);
    setRegressionEquation('');
    setPlotData([]);
    setXValues([{ x: '' }]);
    setXValue('');
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Least Squares Regression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={removePoint}
                className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-white"
              >
                -
              </Button>
              <span className="font-bold text-lg">{numberOfPoints} Points</span>
              <Button
                onClick={addPoint}
                className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-white"
              >
                +
              </Button>
            </div>
            {points.map((point, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Label>{`${index + 1}. `}</Label>
                <Label>{`x${index}`}</Label>
                <Input
                  type="number"
                  value={point.x}
                  onChange={(e) => handleInputChange(index, 'x', e.target.value)}
                  placeholder={`x${index}`}
                />
                <Label>{`f(x${index})`}</Label>
                <Input
                  type="number"
                  value={point.fx}
                  onChange={(e) => handleInputChange(index, 'fx', e.target.value)}
                  placeholder={`f(x${index})`}
                />
              </div>
            ))}

            <div className="flex space-x-6 items-center my-4">
              {/* Switch for Linear Regression */}
              <div className="flex items-center space-x-2">
                <Label>Linear</Label>
                <Switch 
                  checked={regressionType === 'linear'} 
                  onCheckedChange={() => handleToggle('linear')} />
              </div>

              {/* Switch for Polynomial Regression */}
              <div className="flex items-center space-x-2">
                <Label>Polynomial</Label>
                <Switch 
                  checked={regressionType === 'polynomial'} 
                  onCheckedChange={() => handleToggle('polynomial')} />
              </div>       

              <div className="flex items-center space-x-2">
                <Label>{`M order`}</Label>
                <Input
                  type="number"
                  value={mOrder}
                  onChange={(e) => setMOrder(parseInt(e.target.value))}
                  placeholder={`1`}
                  disabled={regressionType !== 'polynomial'}  // Disable when not polynomial
                />
              </div>
            </div>

              <div className="flex items-center space-x-4 my-2">
                <Label>X Value</Label>
                <Input
                  type="number"
                  value={xValue}
                  onChange={(e) => handleXValueChange(e.target.value)}
                  placeholder={`Enter X value`}
                />
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
              {`Example ${index + 1}: ${example.point} Points`}
            </SelectItem>
          ))}
            </SelectContent>
            </Select>
          </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={calculateRegression}
                className="bg-neutral-950 hover:bg-neutral-800"
              >
                Calculate
              </Button>
              <Button
                onClick={clearAllInputs}
                className="bg-red-950 hover:bg-red-800"
              >
                Clear All
              </Button>
            </div>
            
              <div className="mt-6 overflow-x-auto max-h-96">           
                <BlockMath math={regressionEquation} />          
                <BlockMath math={matrixFormula} />
                <BlockMath math={matrixFormulaResult} />
                <BlockMath math={regressionEquationSub} />
                <BlockMath math={result} />  
              </div> 
            <div className="mt-6 flex justify-center items-center">               
              <Plot
                data={
                  plotData
                }
                layout={{   
                  width: 800, 
                  height: 500, 
                  title: 'Regression Graph',
                  xaxis: { title: 'X' },
                  yaxis: { title: 'f(X)'}, 
                }}
                config={{
                  displayModeBar: true,
                  scrollZoom: true,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeastSquaresRegression;
