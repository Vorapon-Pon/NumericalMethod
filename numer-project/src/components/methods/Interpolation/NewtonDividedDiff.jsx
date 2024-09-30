import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox'; // Make sure this is imported from shadcn-ui
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const NewtonDividedDiff = () => {
  const [points, setPoints] = useState([{ x: 0, fx: 0, selected: true }]); // Array of { x, fx, selected }
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [polynomial, setPolynomial] = useState(''); // To store the final polynomial
  const [interpolateValueX, setInterpolateValueX] = useState(40000);
  const [results , setResults] = useState('');

  const handleInputChange = (index, field, value) => {
    const updatedPoints = [...points];
    updatedPoints[index][field] = parseFloat(value);
    setPoints(updatedPoints);
  };

  // Handle checkbox toggle for shadcn-ui Checkbox component
  const handleCheckboxChange = (index, checked) => {
    const updatedPoints = [...points];
    updatedPoints[index].selected = checked;  // Update the selected value based on the checkbox state
    setPoints(updatedPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: 0, fx: 0, selected: true }]);
    setNumberOfPoints(numberOfPoints + 1);
  };

  const removePoint = () => {
    if (numberOfPoints > 1) {
      setPoints(points.slice(0, -1));
      setNumberOfPoints(numberOfPoints - 1);
    }
  };

  // Recursive function to calculate the divided difference coefficients
  const calculateCoefficient = (i, j, selectedPoints) => {
    if (i === j) return selectedPoints[i].fx;
    return (
      (calculateCoefficient(i + 1, j, selectedPoints) - calculateCoefficient(i, j - 1, selectedPoints)) /
      (selectedPoints[j].x - selectedPoints[i].x)
    );
  };

  const calculateNewtonDividedDifference = () => {
    const selectedPoints = points.filter((point) => point.selected);
    const n = selectedPoints.length;

    if (n < 2) {
      setPolynomial('Please select at least 2 points.');
      return;
    }

    const coefficients = [];

    for (let i = 0; i < n; i++) {
      coefficients.push(calculateCoefficient(0, i, selectedPoints));
    }

    let polynomialStr = `(${coefficients[0].toExponential(4)})`;
    let currentTerm = '';

    for (let i = 1; i < n; i++) {
      currentTerm = `\\\\(${coefficients[i].toExponential(4)})`;
      for (let j = 0; j < i; j++) {
        currentTerm += `(x - ${selectedPoints[j].x})`;
      }
      polynomialStr += ` + ${currentTerm}`;
    }

    const interpolateAtX = (xValue) => {
      let result = coefficients[0];
      for (let i = 1; i < n; i++) {
        let term = coefficients[i];
        for (let j = 0; j < i; j++) {
          term *= xValue - selectedPoints[j].x;
        }
        result += term;
      }
      return result;
    };

    const interpolatedValue = interpolateAtX(interpolateValueX);

    setPolynomial(`${polynomialStr}`)
    setResults(`f(${interpolateValueX}) = ${interpolatedValue}`)                                                       
  };

  const clearAllInputs = () => {
    setPoints(Array(numberOfPoints).fill({ x: 0, fx: 0, selected: true }));
    setPolynomial('');
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Newton's Divided Difference</CardTitle>
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
                <Checkbox
                  onCheckedChange={(checked) => handleCheckboxChange(index, checked)}  
                  checked={point.selected}  
                />
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

            <div className="flex space-x-2">
              <Button
                onClick={calculateNewtonDividedDifference}
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
              <BlockMath math={`\\text{Interpolated value at } x = ${interpolateValueX}`}/>
            </div>

            {polynomial && (
              <div className="mt-6 overflow-auto max-h-96">           
                <BlockMath math={`f(x) = ${polynomial}`} />
              </div>
            )}

            <div className="mt-6 overflow-auto max-h-96">
              <BlockMath math={results}/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewtonDividedDiff;
