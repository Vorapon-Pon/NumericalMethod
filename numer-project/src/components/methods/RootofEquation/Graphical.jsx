import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evaluate } from 'mathjs';

const GraphicalMethod = () => {
  const [equation, setEquation] = useState('43x-180');
  const [xStart, setXStart] = useState(0);
  const [xEnd, setXEnd] = useState(5);
  const [tolerance, setTolerance] = useState(0.000001);
  const [result, setResult] = useState(null);
  const [precision, setPrecision] = useState(6);
  const [isCalculating, setIsCalculating] = useState(false);
  const [data, setData] = useState([]);
  const [root, setRoot] = useState(null);

  const f = (x) => evaluate(equation, { x });

  const start = (xlnum, xrnum) => {
    let left = 0, right = 0;
    for (let i = xlnum; i < xrnum; i++) {
      left = f(i);
      right = f(i + 1);
      if (left * right < 0) {
        return i;
      }
    }
    return -1;
  };

  const calGraphical = (xlnum, xrnum) => {
    let iter = 0;
    const st = start(xlnum, xrnum);
    if (st === -1) {
      alert("No root found in the interval.");
      return;
    }

    let newData = [];
    let foundRoot = null;
    for (let i = st; i < st + 1; i += tolerance) {
      let result = f(i);
      iter++;
      newData.push({ Iteration: iter, x: i, y: result });
      if (result > -tolerance * 10 && result < tolerance * 10) {
        foundRoot = i;
        break;  
      }
    }
    setData(newData);
    setRoot(foundRoot);
    setResult({
      root: foundRoot,
      points: newData,
      iterations: newData
    });
  };

  const handleSolve = () => {
    setIsCalculating(true);
    const xlnum = parseFloat(xStart);
    const xrnum = parseFloat(xEnd);
    calGraphical(xlnum, xrnum);
    setIsCalculating(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <Label htmlFor="equation">Enter equation f(x) =</Label>
        <Input
          id="equation"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g., 43 * x - 180"
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
      <Button onClick={handleSolve} disabled={isCalculating}>
        {isCalculating ? 'Calculating...' : 'Solve'}
      </Button>

      {result && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Solution</h2>
          <p>Equation: f(x) = {equation}</p>
          <p>Root: {root !== null ? root.toFixed(parseInt(precision)) : "No root found"}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Iteration Table</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">x</th>
                <th className="border border-gray-300 p-2">f(x)</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.slice(0, 10).map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{iter.Iteration}</td>
                  <td className="border border-gray-300 p-2">{iter.x.toFixed(precision)}</td>
                  <td className="border border-gray-300 p-2">{iter.y.toFixed(precision)}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-300 p-2" colSpan="3">...</td>
              </tr>
              {result.iterations.slice(-10).map((iter, index) => (
                <tr key={index + result.iterations.length - 10}>
                  <td className="border border-gray-300 p-2">{iter.Iteration}</td>
                  <td className="border border-gray-300 p-2">{iter.x.toFixed(precision)}</td>
                  <td className="border border-gray-300 p-2">{iter.y.toFixed(precision)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GraphicalMethod;
