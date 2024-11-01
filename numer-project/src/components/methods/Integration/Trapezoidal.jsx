import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js';
import axios from 'axios'; 
import { evaluate } from 'mathjs';

const TrapezoidalRule = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(8);
  const [n, setN] = useState(1);
  const [Equation, setEquation] = useState('4x^5-3x^4+x^3-6x+2');
  const [result, setResult] = useState('');
  const [formula, setFormula] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [integralDisplay, setIntegralDisplay] = useState('');
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('trapezoidal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${method}`);
        setExamples(response.data);
        console.log(response.data);
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
      setA(selected.xL);
      setB(selected.xR);
      setN(selected.n);
    }
  };

  const calculateIntegral = () => {
    const h = (b - a) / n;
    const fa = evaluate(Equation, { x: a });
    const fb = evaluate(Equation, { x: b });
    
    let sum_fx = 0;
    for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        sum_fx += evaluate(Equation, { x: xi });
    }
    // Composite trapezoidal integral
    let integrateArea = (h / 2) * (fa + fb + (2 * sum_fx));

    let formula = `\\text{Using } h = \\frac{b - a}{n}; \\text{} h = \\frac{${b} - ${a}}{${n}} = ${h}, \\\\`;
    if(n === 1) {
      formula += `\\text{} \\\\ \\ I \\approx \\frac{h}{2} \\left[f(x_0) + f(x_n) \\right] \\\\`;
      formula += `\\ I = \\frac{h}{2} \\left[f(${a}) + f(${b}) \\right] \\\\`
      formula += `\\text{} \\\\ \\quad \\begin{align*}
      &x_0 = a = ${a}; \\quad f(x_0) = ${Equation.replace(/x/g, `(${a})`)} = ${evaluate(Equation, { x: a })} \\\\ \\quad
      &x_1 = b = ${b}; \\quad f(x_1) = ${Equation.replace(/x/g, `(${b})`)} = ${evaluate(Equation, { x: b })}
      \\end{align*}`;

      formula += `\\text{} \\\\ I = \\frac{${h}}{2} \\left[
      ${evaluate(Equation, { x: a })} + 
      ${evaluate(Equation, { x: b })} \\right] `

      const curvePoints = Array.from({ length: 100 }, (_, i) => {
        const x = (a - 1) + (i / 99) * ((b + 1) - (a - 1)); // Extend range by 1 on each side
        return { x, y: evaluate(Equation, { x }) };
      });
  
      const functionCurve = {
        x: curvePoints.map(p => p.x),
        y: curvePoints.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { color: 'red' },
      };
  
      const linearLine = {
        x: [a, b],
        y: [fa, fb],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'green', dash: 'dash' }, 
        name: 'Linear f(x)',
      };
      
      const linearFill = {
        x: [a, b, b, a],
        y: [fa, fb, 0, 0],
        type: 'scatter',
        fill: 'tozeroy',
        fillcolor: 'rgba(182, 255, 161, 0.4)', 
        name: 'Linear Area',
        mode: 'none',
      };

      setPlotData([functionCurve, linearLine, linearFill]);

    }else {
      formula += `\\ I = \\frac{h}{2} \\left[f(x_0) + f(x_n) + 2 \\sum_{i=1}^{n-1} f(x_i) \\right] \\\\`;
      formula += `\\ I = \\frac{h}{2} \\left[f(${a}) + f(${b}) + 2\\left[`;
      for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        formula += `f(${xi})`;
        if (i < n - 1) {
          formula += ` + `;
        }
      }
      formula += `\\right]\\right] \\\\`;

      formula += `\\text{} \\\\ \\quad \\begin{align*}`;
      for (let i = 0; i <= n; i++) {
        const xi = a + i * h;
        const fx = evaluate(Equation, { x: xi });
        formula += `&x_${i} = ${xi}; \\quad f(x_${i}) = ${Equation.replace(/x/g, `(${xi})`)} = ${fx} \\\\ \\quad `;
      }
      formula += `\\end{align*}`;
      
      formula += `\\text{} \\\\ I = \\frac{${h}}{2} \\left[
      ${evaluate(Equation, { x: a })} + ${evaluate(Equation, { x: b })} + 2\\left[ `
      for(let i = 1; i< n; i++) {
        const xi = a + i * h;
        formula += `${evaluate(Equation, { x: xi })}`;
        if (i < n - 1) {
          formula += ` + `;
        }
      }

      formula += `\\right]\\right] \\\\`
      const curvePoints = Array.from({ length: 100 }, (_, i) => {
        const x = (a - 1) + (i / 99) * ((b + 1) - (a - 1)); // Extend range by 1 on each side
        return { x, y: evaluate(Equation, { x }) };
      });

      const functionCurve = {
        x: curvePoints.map(p => p.x),
        y: curvePoints.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { color: 'red' },
      };

      const linearLines = [];
      const linearFills = [];
      const verticalDashes = [];
      for (let i = 0; i < n; i++) {
        const x0 = a + i * h;
        const x1 = a + (i + 1) * h;
        const y0 = evaluate(Equation, { x: x0 });
        const y1 = evaluate(Equation, { x: x1 });

        linearLines.push({
          x: [x0, x1],
          y: [y0, y1],
          type: 'scatter',
          mode: 'lines',
          line: { color: 'green', dash: 'dash' },
          name: `Linear f(x) ${i + 1}`,
          showlegend: false,
        });

        linearFills.push({
          x: [x0, x1, x1, x0],
          y: [y0, y1, 0, 0],
          type: 'scatter',
          fill: 'tozeroy',
          fillcolor: 'rgba(182, 255, 161, 0.4)',
          name: `Linear Area ${i + 1}`,
          mode: 'none',
          showlegend: false,
        });

        verticalDashes.push({
          x: [x0, x0],
          y: [0, y0],
          type: 'scatter',
          mode: 'lines',
          line: { color: 'green', dash: 'dash' },
          showlegend: false,
        });
      }

      // Add the last vertical line at x_n
      const xn = a + n * h;
      const yn = evaluate(Equation, { x: xn });
      verticalDashes.push({
        x: [xn, xn],
        y: [0, yn],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'green', dash: 'dash' },
        name: `Vertical Line ${n}`,
        showlegend: false,
      });

      setPlotData([functionCurve, ...linearLines, ...linearFills, ...verticalDashes]);
    }

    setResult(`I_{${'Trapezoidal'}} \\approx ${integrateArea.toFixed(4)}`);
    setFormula(formula);
    setIntegralDisplay(`\\int_{${a}}^{${b}} ${Equation} \\, dx`);
};

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Trapezoidal Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <BlockMath math={integralDisplay || '\\int_{a}^{b} f(x) \\, dx'} />
            </div>

            <div className="flex items-center space-x-4">
              <Label>Function f(x)</Label>
              <Input
                value={Equation}
                onChange={(e) => {
                  const newFunc = e.target.value;
                  setEquation(newFunc);
                  setIntegralDisplay(`\\int_{${a}}^{${b}} ${newFunc} \\, dx`);
                }}
                placeholder="Enter function (e.g., x^2 + 3x + 1)"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Lower bound (a)</Label>
              <Input
                type="number"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Upper bound (b)</Label>
              <Input
                type="number"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Number of subintervals (n)</Label>
              <Input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
              />
            </div>

            {/* Dropdown to choose an example */}
          <div div className="mb-4">
            <Label htmlFor="example">Choose an Example</Label>
            <Select value={selectedExample} onValueChange={handleSelectExample}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an example" />
            </SelectTrigger>
            <SelectContent>
          {examples.map((example, index) => (
            <SelectItem key={index} value={index.toString()}>
              {`Example ${index + 1}: ${example.equation}`}
            </SelectItem>
          ))}
            </SelectContent>
            </Select>
          </div>
            
            <Button
              onClick={calculateIntegral}
              className="bg-neutral-950 hover:bg-neutral-800"
            >
              Calculate
            </Button>
            
            <div className="mt-6 overflow-auto max-h-96">
              <BlockMath math={formula} />
              <BlockMath math={result} />  
            </div> 
            <div className="mt-6 flex justify-center items-center">               
              <Plot
                data={plotData}
                layout={{
                  width: 800,  
                  height: 500, 
                  title: 'Trapezoidal Rule',
                  xaxis: { title: 'x' },
                  yaxis: { title: 'f(x)' },
                  showlegend: true,
                  legend: {
                    x: 1.05,  
                    y: 1,
                    orientation: 'v',  
                    xanchor: 'left',   
                  },
                  margin: {
                    l: 50, 
                    r: 150, 
                    t: 50,  
                    b: 50,  
                  },
                }}
                config={{
                  displayModeBar: true,
                  scrollZoom: true,
                }}
              />

             
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrapezoidalRule;
