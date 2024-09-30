import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { evaluate } from 'mathjs';

const GraphicalMethod = () => {
  const [equation, setEquation] = useState('');
  const [xStart, setXStart] = useState('');
  const [xEnd, setXEnd] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [result, setResult] = useState(null);

  const handleSolve = () => {
    const points = [];
    const step = (parseFloat(xEnd) - parseFloat(xStart)) / 100;
    for (let x = parseFloat(xStart); x <= parseFloat(xEnd); x += step) {
      const y = evaluate(equation, { x });
      points.push({ x, y });
    }

    // Find root (where y is closest to 0)
    const root = points.reduce((closest, point) => 
      Math.abs(point.y) < Math.abs(closest.y) ? point : closest
    );

    setResult({
      points,
      root: root.x,
      iterations: [
        { x: parseFloat(xStart), error: Math.abs(evaluate(equation, { x: parseFloat(xStart) })) },
        { x: root.x, error: Math.abs(root.y) },
        { x: parseFloat(xEnd), error: Math.abs(evaluate(equation, { x: parseFloat(xEnd) })) },
      ]
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
        <Label htmlFor="xStart">X Start</Label>
        <Input
          id="xStart"
          type="number"
          value={xStart}
          onChange={(e) => setXStart(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="xEnd">X End</Label>
        <Input
          id="xEnd"
          type="number"
          value={xEnd}
          onChange={(e) => setXEnd(e.target.value)}
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

          <h3 className="text-xl font-semibold mt-6 mb-2">Graph</h3>
          <LineChart width={500} height={300} data={result.points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
          </LineChart>

          <h3 className="text-xl font-semibold mt-6 mb-2">Iteration Table</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">x</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
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

export default GraphicalMethod;
