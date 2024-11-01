import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; 
import Plot from 'react-plotly.js';
import { evaluate, index } from 'mathjs';
import ErrorGraph from '@/components/ErrorGraph';
import Answer from '@/components/Answer';
import axios from 'axios';

const SecantMethod = () => {
  const [equation, setEquation] = useState('');
  const [x0, setX0] = useState('');
  const [x1, setX1] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState(''); // To store the selected example
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('secant');

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
      setX0(selected.xL);
      setX1(selected.xR);
      setTolerance(selected.tolerance);
      setPrecision(selected.precision);
      setSelectedExample(value);
    }
  };

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
      error = Math.abs((x_2 - x_1)/x_2);
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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
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

      <Button className="bg-neutral-950 hover:bg-neutral-800" onClick={handleSolve} >Solve</Button>

      {result && (
        <div className="mt-8">
          
          <Answer equation={equation} root={result.root} precision={precision} />

          <ErrorGraph data={result.iterations} />

          <Plot
            data={[
              {
                x: Array.from({ length: Math.ceil((parseFloat(x1) - parseFloat(x0)) / 0.01) + 0.01 }, (_, i) => parseFloat(x0) + i * 0.01),
                y: Array.from({ length: Math.ceil((parseFloat(x1) - parseFloat(x0)) / 0.01) + 0.01 }, (_, i) => evaluate(equation, { x: parseFloat(x0) + i * 0.01 })),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'blue' },
                name: 'f(x)',
              },
              ...result.iterations.map((iter) => {
                const x_vals = [iter.x_0, iter.x_1];
                const y_vals = [iter.fx0, iter.fx1];
                return {
                  x: x_vals,
                  y: y_vals,
                  type: 'scatter',
                  mode: 'lines',
                  marker: {
                    color: 'rgba(235, 125, 110, 0.3)',
                  },  
                  name: `Secant Line ${result.iterations.indexOf(iter) + 1}`,
                };
              }),
            ]}
            layout={{
              title: 'Graph',
              xaxis: { title: 'X' },
              yaxis: { title: 'f(X)'},
              dragmode: 'pan',
              hovermode: 'closest',
            }}
            config={{
              displayModeBar: true,
              scrollZoom: true,
            }}
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">Iteration Table</h3>
          <div className="overflow-x-auto">
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
        </div>
      )}
    </div>
  );
};

export default SecantMethod;
