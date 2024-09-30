import React, { useState } from 'react'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';
import ErrorGraph from '@/components/ErrorGraph';
import Answer from '@/components/Answer';

const OnePointIterationMethod = () => {
  const [equation, setEquation] = useState('');
  const [initialX, setInitialX] = useState('');
  const [tolerance, setTolerance] = useState('0.000001');
  const [precision, setPrecision] = useState('6');
  const [result, setResult] = useState(null);

  const handleSolve = () => {
    let x = parseFloat(initialX);
    const tol = parseFloat(tolerance);
    const iterations = [];
    let error, newX;
    const maxIter = 100; 
    let iter = 0; 

    do {
        const fX = evaluate(equation, { x }); 
        newX = fX; 
        error = Math.abs((newX - x) / newX);
        iterations.push({ x, newX, fX, error });
        x = newX;
        iter++;

        if (iter >= maxIter) {
            console.warn("Maximum iterations reached");
            break;
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
        <Label htmlFor="equation">Enter equation g(x) =</Label>
        <Input
          id="equation"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g., ((7/x) + x) / 2"
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
      <Button onClick={handleSolve} className="bg-neutral-900 hover:bg-neutral-800">Solve</Button>

      {result && (
        <div className="mt-8">
        
          <Answer equation={equation} root={result.root} precision={precision} />

          <ErrorGraph data={result.iterations} />

          <h3 className="text-xl font-semibold mt-6 mb-2">Graph</h3>
          <Plot
            data={[{
              x: result.iterations.map(iter => iter.x),
              y: result.iterations.map(iter => iter.fX),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#82ca9d' },
              name: 'f(x)',
            }]}
            layout={{ 
              title: 'f(x) Graph', 
              xaxis: { title: 'Xi' }, 
              yaxis: { title: 'Xi+1' }}}
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
                <th className="border border-gray-300 p-2">Xold</th>
                <th className="border border-gray-300 p-2">Xnew</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{iter.x.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.fX.toFixed(parseInt(precision))}</td>
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

export default OnePointIterationMethod;
