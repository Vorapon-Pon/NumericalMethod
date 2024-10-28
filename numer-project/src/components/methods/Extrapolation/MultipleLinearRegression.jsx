import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js';
import { lusolve } from 'mathjs';

const MultipleLinearRegression = () => {
  const [points, setPoints] = useState([{ x0: '', x1: '', x2: '', y: '' }]);
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [k, setK] = useState(3); // Number of X variables
  const [xValues, setXValues] = useState({ x0: '', x1: '', x2: '' });
  const [matrixFormula, setMatrixFormula] = useState('');
  const [matrixFormulaResult, setMatrixFormulaResult] = useState('');
  const [regressionEquation, setRegressionEquation] = useState('');
  const [regressionEquationSub, setRegressionEquationSub] = useState('');
  const [result, setResult] = useState('');
  const [plotData, setPlotData] = useState(null);

  const addPoint = () => {
    setPoints([...points, Object.fromEntries([...Array(k).keys()].map(i => [`x${i}`, ''])).y = '']);
    setNumberOfPoints(numberOfPoints + 1);
  };

  const removePoint = () => {
    if (numberOfPoints > 1) {
      setPoints(points.slice(0, -1));
      setNumberOfPoints(numberOfPoints - 1);
    }
  };

  const incrementK = () => {
    const newK = k + 1;
    setK(newK);
    updatePointsAndXValues(newK);
  };

  const decrementK = () => {
    if (k > 1) {
      const newK = k - 1;
      setK(newK);
      updatePointsAndXValues(newK);
    }
  };

  const updatePointsAndXValues = (newK) => {
    // Update xValues
    const newXValues = {};
    for (let i = 0; i < newK; i++) {
      newXValues[`x${i}`] = xValues[`x${i}`] || '';
    }
    setXValues(newXValues);
    
    // Update points
    setPoints(points.map(point => {
      const newPoint = { y: point.y };
      for (let i = 0; i < newK; i++) {
        newPoint[`x${i}`] = point[`x${i}`] || '';
      }
      return newPoint;
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: parseFloat(value) };
    setPoints(updatedPoints);
  };

  const handleXValueChange = (field, value) => {
    setXValues({ ...xValues, [field]: parseFloat(value) });
  };

  const calculateRegression = () => {
    try {
      const n = points.length;
      
      // Check if we have enough points
      if (n <= k) {
        alert("Please add more points. The number of points should be greater than the number of variables.");
        return;
      }
      
      // Check if all points have valid numeric values
      const validPoints = points.filter(point => 
        Object.values(point).every(val => !isNaN(parseFloat(val)) && isFinite(val))
      );
      
      if (validPoints.length !== n) {
        alert("Please ensure all points have valid numeric values.");
        return;
      }
      
      const X = validPoints.map(point => [1, ...Array(k).fill().map((_, i) => parseFloat(point[`x${i}`]))]);
      const y = validPoints.map(point => parseFloat(point.y));

      // Calculate X^T * X
      const XTX = X[0].map((_, i) => X[0].map((_, j) => X.reduce((sum, row) => sum + row[i] * row[j], 0)));
      
      // Calculate X^T * y
      const XTy = X[0].map((_, i) => X.reduce((sum, row, j) => sum + row[i] * y[j], 0));
      
      const beta = lusolve(XTX, XTy);
      
      console.log("Beta coefficients:", beta);
      
      // Generate regression equation
      let equation = 'f(X) = a_0';
      for (let i = 1; i <= k; i++) {
        equation += ` + a_${i}x_${i}`;
      }
      setRegressionEquation(equation);
      
      // Generate substituted equation
      let subEquation = `f(X) = ${beta[0][0].toFixed(4)}`;
      for (let i = 1; i <= k; i++) {
        subEquation += ` + ${beta[i][0].toFixed(4)}x_${i}`;
      }
      setRegressionEquationSub(subEquation);
      
      // Calculate result
      const predictedY = beta[0][0] + Object.entries(xValues).reduce((sum, [key, value], index) => {
        return sum + beta[index + 1][0] * value;
      }, 0);
      setResult(`f(${Object.values(xValues).join(', ')}) = ${predictedY.toFixed(4)}`);
      
     // Build matrix formula for display (in LaTeX)
     let matrixLatex = `\\begin{bmatrix} n`;
     for (let j = 1; j <= k; j++) {
       matrixLatex += ` & \\sum_{i=1}^{n} x_{${j}i}`;
     }
     matrixLatex += ` \\\\`;
     
     for (let j = 1; j <= k; j++) {
       matrixLatex += `\\sum_{i=1}^{n} x_{${j}i}`;
       for (let l = 1; l <= k; l++) {
         matrixLatex += ` & \\sum_{i=1}^{n} x_{${j}i} `;
         matrixLatex += `x_{${l}i}`;   
       }
       matrixLatex += ` \\\\`;
     }
     matrixLatex += `\\end{bmatrix}`;

     //a0 - an vector and b vector
     matrixLatex += `\\begin{bmatrix} a_0 \\\\ ${Array(k).fill().map((_, i) => `a_${i+1}`).join(' \\\\ ')} \\end{bmatrix} = `;
     let bmatrixLatex = `\\begin{bmatrix} \\sum_{i=1}^{n} y_i \\\\ `;
     for (let i = 1; i <= k; i++) {
      bmatrixLatex += `\\sum_{i=1}^{n} x_{${i}i} y_i`;
      bmatrixLatex += ` \\\\`;
     }
     bmatrixLatex += `\\end{bmatrix}`;
     matrixLatex += bmatrixLatex;
     
      setMatrixFormula(matrixLatex);
      
      // Generate matrix formula result
      let matrixResultLatex = `\\begin{bmatrix}`;
      XTX.forEach(row => {
        matrixResultLatex += row.map(val => val.toFixed(2)).join(' & ') + ` \\\\`;
      });
      matrixResultLatex += `\\end{bmatrix}`;
      matrixResultLatex += `\\begin{bmatrix} a_0 \\\\ ${Array(k).fill().map((_, i) => `a_${i+1}`).join(' \\\\ ')} \\end{bmatrix} = `;
      matrixResultLatex += `\\begin{bmatrix} ${XTy.map(val => val.toFixed(2)).join(' \\\\ ')} \\end{bmatrix}`;
      setMatrixFormulaResult(matrixResultLatex);
      
      // Generate plot data
      if (k === 2) {
        const x0Values = validPoints.map(point => point.x0);
        const x1Values = validPoints.map(point => point.x1);
        const yValues = validPoints.map(point => point.y);
        
        const scatterData = {
          x: x0Values,
          y: x1Values,
          z: yValues,
          mode: 'markers',
          type: 'scatter3d',
          marker: { color: 'red', size: 5 },
        };
        
        // Generate plane data
        const xRange = [Math.min(...x0Values), Math.max(...x0Values)];
        const yRange = [Math.min(...x1Values), Math.max(...x1Values)];
        const planeX = [];
        const planeY = [];
        const planeZ = [];
        
        for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 10) {
          for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 10) {
            planeX.push(x);
            planeY.push(y);
            planeZ.push(beta[0][0] + beta[1][0] * x + beta[2][0] * y);
          }
        }
        
        const planeData = {
          x: planeX,
          y: planeY,
          z: planeZ,
          type: 'surface',
          opacity: 0.8,
        };
        
        setPlotData([scatterData, planeData]);
      } else {
        setPlotData(null);
      }
      
    } catch (error) {
      console.error("Error in solving multiple linear regression:", error);
      alert("An error occurred while solving the multiple linear regression: " + error.message);
    }
  };

  const clearAllInputs = () => {
    setPoints([{ x0: '', x1: '', x2: '', y: '' }]);
    setNumberOfPoints(1);
    setXValues({ x0: '', x1: '', x2: '' });
    setRegressionEquation('');
    setRegressionEquationSub('');
    setResult('');
    setMatrixFormula('');
    setMatrixFormulaResult('');
    setPlotData(null);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Multiple Linear Regression</CardTitle>
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
                {Array(k).fill().map((_, i) => (
                  <React.Fragment key={i}>
                    <Label>{`x${i+1}`}</Label>
                    <Input
                      type="number"
                      value={point[`x${i}`]}
                      onChange={(e) => handleInputChange(index, `x${i}`, e.target.value)}
                      placeholder={`x${i}`}
                    />
                  </React.Fragment>
                ))}
                <Label>y</Label>
                <Input
                  type="number"
                  value={point.y}
                  onChange={(e) => handleInputChange(index, 'y', e.target.value)}
                  placeholder="y"
                />
              </div>
            ))}

            <div className="flex justify-between items-center">
              <Button
                onClick={decrementK}
                className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-white"
                disabled={k <= 1}
              >
                -
              </Button>
              <span className="font-bold text-lg"> {k} X Values </span>
              <Button
                onClick={incrementK}
                className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-white"
              >
                +
              </Button>
            </div>

            <div className="flex items-center space-x-4 my-2">
              <Label>X values</Label>
              {Object.keys(xValues).map((key, index) => (
                <Input
                  key={index}
                  type="number"
                  value={xValues[key]}
                  onChange={(e) => handleXValueChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                />
              ))}
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
            
            <div className="mt-6 overflow-auto max-h-96">           
              <BlockMath math={regressionEquation} />          
              <BlockMath math={matrixFormula} />
              <BlockMath math={matrixFormulaResult} />
              <BlockMath math={regressionEquationSub} />
              <BlockMath math={result} />  
            </div> 
            
           
            <div className="mt-6 flex justify-center items-center">               
                <Plot
                  data={plotData}
                  layout={{   
                    width: 600, 
                    height: 400, 
                    title: 'Multiple Linear Regression (3D)',
                    scene: {
                      xaxis: { title: 'X0' },
                      yaxis: { title: 'X1' },
                      zaxis: { title: 'Y' },
                    },
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

export default MultipleLinearRegression;