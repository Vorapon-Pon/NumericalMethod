import React, { useState, useEffect  } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; 
import Plot from 'react-plotly.js';
import { evaluate, derivative } from 'mathjs';
import ErrorGraph from '@/components/ErrorGraph';
import { BlockMath } from 'react-katex';
import axios from 'axios';
import 'katex/dist/katex.min.css';

const NewtonRaphsonMethod = () => {
  const [equation, setEquation] = useState('');
  const [initialX, setInitialX] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState(''); // To store the selected example
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('newtonraphson');
  const [graphData, setGraphData] = useState([]);

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
      setInitialX(selected.initialX);
      setTolerance(selected.tolerance);
      setPrecision(selected.precision);
      setSelectedExample(value);
    }
  };

  const handleSolve = () => {
    let x = parseFloat(initialX);
    const tol = parseFloat(tolerance);
    const maxIterations = 100; 
    const iterations = [];
    const graphPoints = [];
    let error, fx, dfx;
    const derivativeEq = derivative(equation, 'x').toString();

    do {
      fx = evaluate(equation, { x });
      dfx = evaluate(derivativeEq, { x });

      if (Math.abs(dfx) < 1e-10) {
        console.error("Derivative is close to zero, method may not converge.");
        break;
      }

      const newX = x - (fx / dfx);
      error = Math.abs((newX - x) / newX);
      iterations.push({ x, fx, dfx, error });

      // Add points to graph
      graphPoints.push({ x, fx, dfx, tangent: fx + dfx * (newX - x) });

      x = newX;
    } while (error > tol && iterations.length < maxIterations);

    setResult({
      root: x,
      iterations,
      derivativeEq,
    });
    setGraphData(graphPoints);
  };
  
  const tangentLines = graphData.map(point => ({
    x: [point.x - 1, point.x + 1],  // Adjust range as needed
    y: [
      point.fx - point.dfx, 
      point.fx + point.dfx,
    ],
  }));
  
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
        <Label htmlFor="initialX">Initial X</Label>
        <Input
          id="initialX"
          type="number"
          value={initialX}
          onChange={(e) => setInitialX(e.target.value)}
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
          <h2 className="text-2xl font-semibold mb-4">Solution</h2>

          <BlockMath math={`Equation: f(x) = ${equation}`} />
          <BlockMath math={`Derivative: f'(x) = ${result.derivativeEq}`} />
          <BlockMath math={`Root = ${result.root.toFixed(parseInt(precision))}`} />

          <ErrorGraph data={result.iterations} />

          <Plot
            data={[
              {
                x: result.iterations.map((_, index) => index),
                y: result.iterations.map((_, index) => evaluate(equation, {x: index})),
                type: 'scatter',
                mode: 'lines',
                marker: { color: '#82ca9d' },
                name: 'f(x)',
              },
              ...tangentLines.map((line, index) => ({
                x: line.x,
                y: line.y,
                type: 'scatter',
                mode: 'lines',
                line: {
                  color: 'rgba(235, 125, 110, 0.3)',
                },  
                
                name: `f'(x) at x=${graphData[index].x.toFixed(2)}`,
              })),
            ]}
            layout={{
              title: 'Graph',
              xaxis: { title: 'X' },
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
          <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Iteration</th>
                <th className="border border-gray-300 p-2">X</th>
                <th className="border border-gray-300 p-2">f(x)</th>
                <th className="border border-gray-300 p-2">f'(x)</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{iter.x.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.fx.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.dfx.toFixed(parseInt(precision))}</td>
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

export default NewtonRaphsonMethod;
