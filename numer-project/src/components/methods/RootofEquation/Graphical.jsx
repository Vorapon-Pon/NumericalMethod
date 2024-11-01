import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; 
import { evaluate } from 'mathjs';
import { BlockMath } from 'react-katex';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const GraphicalMethod = () => {
  const [equation, setEquation] = useState('');
  const [xStart, setXStart] = useState(0);
  const [xEnd, setXEnd] = useState(5);
  const [tolerance, setTolerance] = useState(0.0001);
  const [precision, setPrecision] = useState(6);
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState(''); // To store the selected example
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('graphical');
  const [iterations, setIterations] = useState([]);
  
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
      setEquation(selected.equation);
      setXStart(selected.xL);
      setXEnd(selected.xR);
      setTolerance(selected.tolerance);
      setPrecision(selected.precision);
      setSelectedExample(value);
    }
  };

  const f = (x) => evaluate(equation, { x });

  const calGraphical = (xl, xr, tol) => {
    let stepSize = 1;
    let iterCount = 0;
    let newIterations = [];
    let error = 1;  
    let oldY = 0;
    let y1, y2;
    let l = xl; 
    let r = xr; 
  
    while (error >= tol) {
      for (let x = l; x <= r; x += stepSize) {
        y1 = f(x);
        y2 = f(x + stepSize);
        iterCount++;
  
        newIterations.push({
          Iteration: iterCount,
          x: x,
          f_x: y1
        });
  
        if (y1 * y2 <= 0) {
          l = x;
          r = x + stepSize;
  
          stepSize /= 10;
  
          break;
        }
      }
  
      error = Math.abs(y1 - oldY);
      oldY = y1;
  
      if (stepSize < tol) {
        let root = findRoot(l, r, tol); 
        setResult(root);
        setIterations(newIterations);
        return; 
      }
    }
  
    setIterations(newIterations);
  };
  

  const findRoot = (xl, xr, tol) => {
    let xm;
    while (Math.abs(xr - xl) > tol) {
      xm = (xl + xr) / 2;
      let fLeft = f(xl);
      let fMid = f(xm);
      if (fLeft * fMid <= 0) {
        xr = xm;
      } else {
        xl = xm;
      }
    }
    return (xl + xr) / 2;
  };

  const handleSolve = () => {
    const xl = parseFloat(xStart);
    const xr = parseFloat(xEnd);
    calGraphical(xl, xr, tolerance);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <Label htmlFor="equation">Enter equation f(x) =</Label>
        <Input
          id="equation"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g., x^3 - 2*x - 5"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="xStart">X Start</Label>
        <Input
          id="xStart"
          type="number"
          value={xStart}
          onChange={(e) => setXStart(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="xEnd">X End</Label>
        <Input
          id="xEnd"
          type="number"
          value={xEnd}
          onChange={(e) => setXEnd(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="tolerance">Tolerance</Label>
        <Input
          id="tolerance"
          type="number"
          value={tolerance}
          onChange={(e) => setTolerance(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="precision">Precision</Label>
        <Input
          id="precision"
          type="number"
          value={precision}
          onChange={(e) => setPrecision(parseInt(e.target.value))}
        />
      </div>

      {/* Dropdown to choose an example */}
      <div className="mb-4">
        <Label htmlFor="example">Choose an Example</Label>
        <Select value={selectedExample} onValueChange={handleSelectExample}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an example" />
          </SelectTrigger>
          <SelectContent>
            {examples.map((example, index) => (
              <SelectItem key={index} value={index.toString()}>
                {`Equation ${index + 1}: ${example.equation}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSolve} className="bg-neutral-900 hover:bg-neutral-800">Solve</Button>

      {result && (
        <div className="mt-8">
          <BlockMath math={`Equation: f(x) = ${equation}`} />
          <BlockMath math={`Root = ${result.toFixed(parseInt(precision))}`} />

          <h3 className="text-xl font-semibold mt-6 mb-2">Iteration Table</h3>
          <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">x</th>
                <th className="border border-gray-300 p-2">f(x)</th>
              </tr>
            </thead>
            <tbody>
              {/* Show all iterations if less than or equal to 20 */}
              {iterations.length <= 20 ? (
                iterations.map((iter, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{iter.Iteration}</td>
                    <td className="border border-gray-300 p-2">{iter.x.toPrecision(precision)}</td>
                    <td className="border border-gray-300 p-2">{iter.f_x.toPrecision(precision)}</td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Show first 10 iterations */}
                  {iterations.slice(0, 10).map((iter, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{iter.Iteration}</td>
                      <td className="border border-gray-300 p-2">{iter.x.toPrecision(precision)}</td>
                      <td className="border border-gray-300 p-2">{iter.f_x.toPrecision(precision)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-gray-300 p-2" colSpan="3">...</td>
                  </tr>
                  {/* Show last 10 iterations */}
                  {iterations.slice(-10).map((iter, index) => (
                    <tr key={index + iterations.length - 10}>
                      <td className="border border-gray-300 p-2">{iter.Iteration}</td>
                      <td className="border border-gray-300 p-2">{iter.x.toPrecision(precision)}</td>
                      <td className="border border-gray-300 p-2">{iter.f_x.toPrecision(precision)}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicalMethod;
