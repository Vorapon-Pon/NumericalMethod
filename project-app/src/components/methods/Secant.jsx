import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { evaluate } from 'mathjs';

const SecantMethod = () => {
  const [equation, setEquation] = useState('');
  const [x0, setX0] = useState('');
  const [x1, setX1] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [result, setResult] = useState(null);

  const handleSolve = () => {
    let x_0 = parseFloat(x0);
    let x_1 = parseFloat(x1);
    const tol = parseFloat(tolerance);
    const iterations = [];
    let error, x_2;

    do {
      const fx0 = evaluate(equation, { x: x_0 });
      const fx1 = evaluate(equation, { x: x_1 });
      x_2 = x_1 - (fx1 * (x_1 - x_0)) / (fx1 - fx0);
      error = Math.abs(x_2 - x_1);
      iterations.push({ x_0, x_1, x_2, fx0, fx1, error });
      x_0 = x_1;
      x_1 = x_2;
    } while (error > tol);

    setResult({
      root: x_2,
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
        <Label htmlFor="x0">X0</Label>
        <Input
          id="x0"
          type="number"
          value={x0}
          onChange={(e) => setX0(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="x1">X1</Label>
        <Input
          id="x1"
          type="number"
          value={x1}
          onChange={(e) => setX1(e.target.value)}
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
            <XAxis dataKey="x_2" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="error" stroke="#8884d8" />
          </LineChart>

          <h3 className="text-xl font-sem
ibold mt-6 mb-2">Iteration Table</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">X0</th>
                <th className="border border-gray-300 p-2">X1</th>
                <th className="border border-gray-300 p-2">X2</th>
                <th className="border border-gray-300 p-2">f(X0)</th>
                <th className="border border-gray-300 p-2">f(X1)</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{iter.x_0.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.x_1.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.x_2.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.fx0.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.fx1.toFixed(parseInt(precision))}</td>
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

export default SecantMethod;
