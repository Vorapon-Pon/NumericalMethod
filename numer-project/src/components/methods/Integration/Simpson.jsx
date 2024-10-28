import React, { useState } from 'react';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js'; 
import { evaluate } from 'mathjs';

const SimpsonRule = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(8);
  const [n, setN] = useState(1);
  const [Equation, setEquation] = useState('4x^5-3x^4+x^3-6x+2');
  const [result, setResult] = useState('');
  const [formula, setFormula] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [integralDisplay, setIntegralDisplay] = useState('');

  const calculateIntegral = () => {
    
    const h = (b - a) / (n * 2);
    const fa = evaluate(Equation, { x: a });
    const fb = evaluate(Equation, { x: b });

    let sum_odd = 0;
    let sum_even = 0;

    for (let i = 1; i < (n * 2); i += 2) {
      const xi = a + i * h;
      sum_odd += evaluate(Equation, { x: xi });
    }

    for (let i = 2; i < (n * 2); i += 2) {
      const xi = a + i * h;
      sum_even += evaluate(Equation, { x: xi });
    }
    // Composite Simpson's integral
    let integrateArea = (h / 3) * (fa + fb + (4 * sum_odd )+ (2 * sum_even));

    if(n === 1) {
        let formula = `\\text{Using } h = \\frac{b - a}{n}; \\text{} h = \\frac{${b} - ${a}}{${n * 2}} = ${h}, \\\\`;
        formula += `\\ I = \\frac{h}{3} \\left[f(x_0) + 4 \\sum_{i=1,3,5,...}^{n-1} f(x_i) + f(x_n)  \\right] \\\\`;
        formula += `\\ I = \\frac{h}{3} \\left[f(${a}) + 4\\left[ f(${a + h}) \\right] + f(${b}) \\right] \\\\`;
        formula += `\\text{} \\\\ \\quad \\begin{align*}
        &x_0 = ${a}; \\quad f(x_0) = ${Equation.replace(/x/g, `(${a})`)} = ${evaluate(Equation, { x: a })} \\\\ \\quad
        &x_1 = ${a + h}; \\quad f(x_1) = ${Equation.replace(/x/g, `(${a + h})`)} = ${evaluate(Equation, { x: a + h })} \\\\
        &x_2 = ${b}; \\quad f(x_2) = ${Equation.replace(/x/g, `(${b})`)} = ${evaluate(Equation, { x: b })}
        \\end{align*}`;
        
        formula += `\\text{} \\\\ I = \\frac{${h}}{3} 
        \\left[${evaluate(Equation, { x: a})} + 4\\left[ ${evaluate(Equation, { x: a + h})} \\right] + ${evaluate(Equation, { x: b})} \\right] \\\\`

        setFormula(formula);
    }else {
        let formula = `\\text{Using } h = \\frac{b - a}{n}; \\text{} h = \\frac{${b} - ${a}}{${n * 2}} = ${h}, \\\\`;
        formula += `\\ I = \\frac{h}{3} \\left[f(x_0) + f(x_n) + 4 \\sum_{i=1,3,5,...}^{n-1} f(x_i) + 2 \\sum_{i=2,4,6,...}^{n-2} f(x_i) \\right] \\\\`;
        formula += `\\ I = \\frac{h}{3} \\left[f(${a}) + f(${b}) + 4\\left[`;

for (let i = 1; i < (n * 2); i += 2) {
    const xi = a + i * h;
    formula += `f(${xi})`;
    if (i < (n * 2) - 1) {  // Corrected condition
        formula += ` + `;
    }
}

formula += `\\right] + 2\\left[`;

for (let i = 2; i < (n * 2); i += 2) {
    const xi = a + i * h;
    formula += `f(${xi})`;
    if (i < (n * 2) - 2) {  // Corrected condition
        formula += ` + `;
    }
}

formula += `\\right]\\right] \\\\`;

formula += `\\text{} \\\\ \\quad \\begin{align*}`;
for (let i = 0; i <= n * 2; i++) {
    const xi = a + i * h;
    const fx = evaluate(Equation, { x: xi });
    formula += `&x_${i} = ${xi}; \\quad f(x_${i}) = ${Equation.replace(/x/g, `(${xi})`)} = ${fx} \\\\ \\quad `;
}
formula += `\\end{align*}`;

formula += `\\text{} \\\\ I = \\frac{${h}}{3} \\left[
    ${evaluate(Equation, { x: a })} + ${evaluate(Equation, { x: b })} + 4\\left[ `;
for (let i = 1; i < (n * 2); i += 2) {
    const xi = a + i * h;
    formula += `${evaluate(Equation, { x: xi })}`;
    if (i < (n * 2) - 1) { 
        formula += ` + `;
    }
}

formula += `\\right] + 2\\left[`;

for (let i = 2; i < (n * 2); i += 2) {
    const xi = a + i * h;
    formula += `${evaluate(Equation, { x: xi })}`;
    if (i < (n * 2) - 2) {  
        formula += ` + `;
    }
}
formula += `\\right]\\right] \\\\`
setFormula(formula);
    }

    setResult(`I_{${'Simpson'}} \\approx ${integrateArea.toFixed(4)}`);
    setIntegralDisplay(`\\int_{${a}}^{${b}} ${Equation} \\, dx`);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Simpson Rule</CardTitle>
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

export default SimpsonRule;
