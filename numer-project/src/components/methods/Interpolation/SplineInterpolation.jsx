import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Switch } from '@/components/ui/switch';

const SplineInterpolation = () => {
  const [points, setPoints] = useState([{ x: 0, fx: 0 }]); 
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [interpolateValueX, setInterpolateValueX] = useState(2);
  const [LinearSlope, setSlope] = useState([]);
  const [results, setResults] = useState('');
  const [SplineEquation, setSplineEquation] = useState('');
  const [interpolationType, setInterpolationType] = useState('linear');

  const addPoint = () => {
    setPoints([...points, { x: 0, fx: 0 }]);
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
    setInterpolationType(type);   
  };

  const getResults = () => {
    const n = points.length;

    if (interpolationType === 'linear') {
      for(let i = 0; i < n - 1; i++) {
        if (interpolateValueX >= points[i].x && interpolateValueX <= points[i + 1].x) {
          let result = points[i].fx + LinearSlope[i] * (interpolateValueX - points[i].x);
          setResults(`\\ f_${i + 1}(${interpolateValueX}) = ${points[i].fx} + (${LinearSlope[i]})(x - ${points[i].x}) \\\\
              \\ f(${interpolateValueX}) = ${result}`);
        }
      }
    } else if (interpolationType === 'quadratic') {
      
    } else if (interpolationType === 'cubic') {
     
    }
  };

  const calculateSplineInterpolation = () => {
    const n = points.length;

    if (n < 2) {
      alert('Please select at least 2 points.');
      return;
    }

    if (interpolationType === 'linear') {
      let splineEq = '';
      let slope = [];
      for (let i = 0; i < n - 1; i++) {
        let x0 = points[i].x;
        let x1 = points[i + 1].x;
        let y0 = points[i].fx;
        let y1 = points[i + 1].fx;

        slope[i] = (y1 - y0) / (x1 - x0);

        splineEq += `\\ f_${i + 1}(x) = ${points[i].fx} + (${slope[i]})(x - ${points[i].x}) ; \\quad
        ${points[i].x} \\leq x \\leq${points[i + 1].x} \\\\`;
      }
      setSplineEquation(splineEq);
      setSlope(slope);
    } else if (interpolationType === 'quadratic') {
     
    } else if (interpolationType === 'cubic') {
     
    }
  };

  const clearAllInputs = () => {
    setPoints(Array(numberOfPoints).fill({ x: 0, fx: 0 }));
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Spline Interpolation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={removePoint}
                className="bg-neutral-700 hover:bg-neutral-600"
              >
                -
              </Button>
              <span className="font-bold text-lg">{numberOfPoints} Points</span>
              <Button
                onClick={addPoint}
                className="bg-neutral-700 hover:bg-neutral-600"
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

            <div className="flex space-x-2">
              <div className="mb-2 w-full">
                <Label htmlFor="interpolateValue">Interpolate Value X at:</Label>
                <Input
                  id="interpolateValue"
                  type="number"
                  value={interpolateValueX}
                  onChange={(e) =>
                    setInterpolateValueX(parseFloat(e.target.value))
                  }
                  placeholder="40000"
                  min={0}
                />
              </div>
            </div>

            <div className="flex space-x-6 items-center my-4">
              <div className="flex items-center space-x-2">
                <Label>Linear</Label>
                <Switch
                  checked={interpolationType === 'linear'}
                  onCheckedChange={() => handleToggle('linear')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label>Quadratic</Label>
                <Switch
                  checked={interpolationType === 'quadratic'}
                  onCheckedChange={() => handleToggle('quadratic')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label>Cubic</Label>
                <Switch
                  checked={interpolationType === 'cubic'}
                  onCheckedChange={() => handleToggle('cubic')}
                />
              </div>
            </div>
            <Label> Set Value Before calculate the Results</Label>
            <div className="flex space-x-2">
              
              <Button
                onClick={getResults}
                className="bg-neutral-950 hover:bg-neutral-800"
              >
                Calculate
              </Button>

              <Button
                onClick={calculateSplineInterpolation}
                className="bg-neutral-950 hover:bg-neutral-800"
              >
                Set Value
              </Button>
              <Button
                onClick={clearAllInputs}
                className="bg-red-950 hover:bg-red-800"
              >
                Clear All
              </Button>
            </div>

            {/* Display interpolated value */}
            <div className="mt-6 overflow-auto max-h-96">
              <BlockMath math={`\\text{Interpolated value at } x = ${interpolateValueX}`} />
            </div>

            {/* Display the Spline Equation using to interpolated value */}
            <div className="mt-6 overflow-auto max-h-96 text-left">
              <BlockMath math={`\\begin{aligned}${SplineEquation}\\end{aligned}`} />
            </div>

            {/* Display the final result and interpolated value */}
            <div className="mt-6 overflow-auto max-h-96">
              <BlockMath math={results} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SplineInterpolation;
