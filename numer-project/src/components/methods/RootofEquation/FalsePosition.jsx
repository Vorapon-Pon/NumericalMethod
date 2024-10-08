import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; 
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';
import ErrorGraph from '@/components/ErrorGraph';
import Answer from '@/components/Answer';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const FalsePositionMethod = () => {
  const [equation, setEquation] = useState('');
  const [xL, setXL] = useState('');
  const [xR, setXR] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState(''); // To store the selected example
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('falseposition');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${method}`);
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
      setXL(selected.xL);
      setXR(selected.xR);
      setTolerance(selected.tolerance);
      setPrecision(selected.precision);
      setSelectedExample(value);
    }
  };

  const handleSolve = () => {
    let xl = parseFloat(xL);
    let xr = parseFloat(xR);
    const tol = parseFloat(tolerance);
    const iterations = [];
    let x, fx, error;
    let xold = 0;

    do {
      const fxl = evaluate(equation, { x: xl });
      const fxr = evaluate(equation, { x: xr });
      x = (xl * fxr - xr * fxl) / (fxr - fxl);
      fx = evaluate(equation, { x });
      error = Math.abs((x - xold) / x);
      iterations.push({ xl, xr, x, fx,error });
      xold = x;

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

      <Button onClick={handleSolve}>Solve</Button>

      {result && (
        <div className="mt-8">
          
          <Answer equation={equation} root={result.root} precision={precision} />

          <ErrorGraph data={result.iterations} />

          <Plot
            data={[
              {
                x: result.iterations.map(iter => iter.x),
                y: result.iterations.map(iter => iter.fx),
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#007bff' },
                name: 'f(x)',
              },
              
            ]}
            layout={{
              title: 'Graph',
              xaxis: { title: 'Iteration' },
              yaxis: { title: 'f(x)' },
              dragmode: 'pan', 
              hovermode: 'closest', 
            }}
            config={{
              displayModeBar: true, 
              scrollZoom: true,
            }}
          />

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
