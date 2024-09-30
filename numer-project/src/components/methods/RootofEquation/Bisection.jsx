import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';
import ErrorGraph from '@/components/ErrorGraph';
import Answer from '@/components/Answer';
import 'katex/dist/katex.min.css';

const BisectionMethod = () => {
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
    let xm, fxm, error;
    let xmold = 0

    do {
      xm = (xl + xr) / 2;
      fxm = evaluate(equation, { x: xm });
      const fxl = evaluate(equation, { x: xl });
      error = Math.abs((xm - xmold)/xm);
      iterations.push({ xl, xr, xm, fxm, error });
      xmold = xm;

      if (fxl * fxm < 0) {
        xr = xm;
      } else {
        xl = xm;
      }
    } while (error > tol);

    setResult({
      root: xm,
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
      <Button onClick={handleSolve} className="bg-neutral-900 hover:bg-neutral-800">Solve</Button>

      {result && (
        <div className="mt-8">
          
          <Answer equation={equation} root={result.root} precision={precision} />

          <ErrorGraph data={result.iterations} />

          <Plot
            data={[
              {
                x: result.iterations.map((_,index) => index),
                y: result.iterations.map(iter => iter.xm),
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#82ca9d' },
                name: 'f(xm)',
              }
            ]}
            layout={{
              title: 'Graph',
              xaxis: { title: 'xm' },
              yaxis: { title: 'f(xm)' },
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
                <th className="border border-gray-300 p-2">XM</th>
                <th className="border border-gray-300 p-2">f(XM)</th>
                <th className="border border-gray-300 p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((iter, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{iter.xl.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.xr.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.xm.toFixed(parseInt(precision))}</td>
                  <td className="border border-gray-300 p-2">{iter.fxm.toFixed(parseInt(precision))}</td>
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

export default BisectionMethod;
