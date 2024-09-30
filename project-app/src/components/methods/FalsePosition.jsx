import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { evaluate } from 'mathjs';

const FalsePositionMethod = () => {
  const [equation, setEquation] = useState('');
  const [xL, setXL] = useState('');
  const [xR, setXR] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [result, setResult] = useState(null);

  const handleSolve = () => {
    let xl = parseFloat(xL);
    let xr = parseFloat(xR);
    const tol = parseFloat(tolerance);
    const iterations = [];
    let x, fx, error;

    do {
      const fxl = evaluate(equation, { x: xl });
      const fxr = evaluate(equation, { x: xr });
      x = (xl * fxr - xr * fxl) / (fxr - fxl);
      fx = evaluate(equation, { x });
      error = Math.abs(fx);

      iterations.push({ xl, xr, x, error });

      if (fxl * fx < 0) {
        xr = x;
      } else {
        xl = x;
      }
    } while (error > tol);

    setResult({
      root: x,
      iterations,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <Label htmlFor="equation">Enter equation f(x) =</Label>
        <Input
          id="equation"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g., x^2 - 4"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="xL">XL</Label>
        <Input
          id="xL"
          type="number"
          value={xL}
          onChange={(e) => setXL(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="xR">XR</Label>
        <Input
          id="xR"
          type="number"
          value={xR}
          onChange={(e) => setXR(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="tolerance">Tolerance</Label>
        <Input
          id="tolerance"
          type="number"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="precision">Precision</Label>
        <Input
          id="precision"
          type="number"
          value={precision}
          onChange={(e) => setPrecision(e.target.value)}
        />
      </div>
      <Button onClick={handleSolve}>Solve</Button>

      {result && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Solution</h2>
          <p>Equation: f(x) = {equation}</p>
          <p>Root: {result.root.toFixed(parseInt(precision))}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Error Graph</h3>
          <LineChart width={500} height={300} data={result.iterations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="error" stroke="#8884d8" />
          </LineChart>

          <h3 className="text-xl font-semibold mt-6 mb-2">Iteration Table</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">XL</th>
                <th className="border border-gray-300 p-2">XR</th>
                <th className="border border-gray-300 p-2">X</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{iter.xl.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.xr.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.x.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.error.toFixed(parseInt(precision))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FalsePositionMethod;
