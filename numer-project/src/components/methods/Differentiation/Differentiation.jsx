import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; 
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { evaluate, derivative } from 'mathjs';
import axios from 'axios';

const Differentiation = () => {
  const [Equation, setEquation] = useState("");
  const [X, setX] = useState("");
  const [H, setH] = useState("");
  const [Answer, setAnswer] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState("1");
  const [selectedDirection, setSelectedDirection] = useState("1");
  const [formula, setFormula] = useState("");
  const [substitude, setSubstitude] = useState("");
  const [exactDiff, setExactDiff] = useState("");
  const [errorFormula, setErrorFormula] = useState("");
  const [examples, setExamples] = useState([]); // To store the list of examples
  const [selectedExample, setSelectedExample] = useState('');
  const [method, setMethod] = useState('differentiate');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://numerical-method-backend.vercel.app/${method}`);
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
      setX(selected.x);
      setH(selected.h);
      setSelectedOrder(selected.order);
      setSelectedDirection(selected.direction);
    }
  };

  const f = (x) => evaluate(Equation, { x });

  const forwardCalculate = (x, h) => {
    let fxip4 = f(x+(4*h));
    let fxip3 = f(x+(3*h));
    let fxip2 = f(x+(2*h));
    let fxip1 = f(x+(1*h));
    let fxi = f(x);

    let result;
    let formulaLatex = ``;
    let subFormulaLatex = ``;

        switch (selectedOrder) {
            case "1":
                result = (fxip1-fxi)/h;
                formulaLatex = `f'(x) = \\frac{[ f(x_{i+1}) - f(x_{i}) ]}{h} `;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxip1}) - (${fxi}) ] }{${h}} = ${result}`;
                break;
            case "2":
                result = (fxip2-(2*fxip1)+fxi)/(h**2);
                formulaLatex = `f''(x) = \\frac{[ f(x_{i+2}) - 2f(x_{i+1}) + f(x_{i}) ]}{h^2}`;
                subFormulaLatex = `f''(${x}) = \\frac{[ (${fxip2}) - (${2*fxip1}) + (${fxi}) ]}{${h**2}}  = ${result}`;
                break;
            case "3":
                result = (fxip3-(3*fxip2)+(3*fxip1)-fxi)/(h**3);
                formulaLatex = `f'''(x) = \\frac{[ f(x_{i+3}) - 3f(x_{i+2}) + 3f(x_{i+1}) - f(x_{i}) ]}{h^3}`;
                subFormulaLatex = `f'''(${x}) = \\frac{[ (${fxip3}) - (${3*fxip2}) + (${3*fxip1}) - (${fxi}) ]}{${h**3}} = ${result}`;
                break;
            case "4":
                result = (fxip4-(4*fxip3)+(6*fxip2)-(4*fxip1)+fxi)/(h**4);
                formulaLatex = `f''''(x) = \\frac{[ f(x_{i+4}) - 4f(x_{i+3}) + 6f(x_{i+2}) - 4f(x_{i+1}) + f(x_{i}) ]}{h^4} `;
                subFormulaLatex = `f''''(${x}) = \\frac{[ (${fxip4}) - (${4*fxip3}) + (${6*fxip2}) - (${4*fxip1}) + (${fxi}) ]}{${h**4}} = ${result}`;
            default:
                console.log("not matched");
          }
    setFormula(formulaLatex);
    setSubstitude(subFormulaLatex);
    return result;
  };
  
  const backwardCalculate = (x, h) => {
    let fxi = f(x);
    let fxim1 = f(x-(1*h));
    let fxim2 = f(x-(2*h));
    let fxim3 = f(x-(3*h));
    let fxim4 = f(x-(4*h));

    let result;
    let formulaLatex = ``;
    let subFormulaLatex = ``;
        switch (selectedOrder) {
            case "1":
                result = (fxi-fxim1)/h;
                formulaLatex = `f'(x) = \\frac{[ f(x_{i}) - f(x_{i-1}) ]}{h}`;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxi}) - (${fxim1}) ]}{${h}} = ${result}`;
                break;
            case "2":
                result = (fxi-(2*fxim1)+fxim2)/(h**2);
                formulaLatex = `f''(x) = \\frac{[ f(x_{i}) - 2f(x_{i-1}) + f(x_{i-2}) ]}{h^2} `;
                subFormulaLatex = `f''(${x}) = \\frac{[ (${fxi}) - (${2*fxim1}) + (${fxim2}) ]}{${h**2}} = ${result}`;
                break;
            case "3":
                result = (fxi-(3*fxim1)+(3*fxim2)-fxim3)/(h**3);
                formulaLatex = `f'''(x) = \\frac{[ f(x_{i}) - 3f(x_{i-1}) + 3f(x_{i-2}) - f(x_{i-3}) ]}{h^3}`;
                subFormulaLatex = `f'''(${x}) = \\frac{[ (${fxi}) - (${3*fxim1}) + (${3*fxim2}) - (${fxim3}) ]}{${h**3}} = ${result}`;
                break;
            case "4":
                result = (fxi-(4*fxim1)+(6*fxim2)-(4*fxim3)+fxim4)/(h**4);
                formulaLatex = `f''''(x) = \\frac{[ f(x_{i}) - 4f(x_{i-1}) + 6f(x_{i-2}) - 4f(x_{i-3}) + f(x_{i-4}) ]}{h^4}`;
                subFormulaLatex = `f''''(${x}) = \\frac{[ (${fxi}) - (${4*fxim1}) + (${6*fxim2}) - (${4*fxim3}) + (${fxim4}) ]}{${h**4}}  = ${result}`;
            default:
                console.log("not matched");
          }
    setFormula(formulaLatex);
    setSubstitude(subFormulaLatex);
    return result;
  };
  
  const centerCalculate = (x, h) => {
    let fxip2 = f(x+(2*h));
    let fxip1 = f(x+(1*h));
    let fxi = f(x);
    let fxim1 = f(x-(1*h));
    let fxim2 = f(x-(2*h));

    let result;
    let formulaLatex = ``;
    let subFormulaLatex = ``;
        switch (selectedOrder) {
            case "1":
                result = (fxip1-fxim1)/(2*h);
                formulaLatex = `f'(x) = \\frac{[ f(x_{i+1}) - f(x_{i-1}) ]}{2h}`;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxip1}) - (${fxim1}) ]}{${2*h}} = ${result}`;
                break;
            case "2":
                result = (fxip1-(2*fxi)+fxim1)/(h**2);
                formulaLatex = `f''(x) = \\frac{[ f(x_{i+1}) - 2f(x_{i}) + f(x_{i-1}) ]}{h^2}`;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxip1}) - (${2*fxi}) + (${fxim1}) ]}{${h**2}} = ${result}`;
                break;
            case "3":
                result = (fxip2-(2*fxip1)+(2*fxim1)-(fxim2))/(2*(h**3));
                formulaLatex = `f'''(x) = \\frac{[ f(x_{i+2}) - 2f(x_{i+1}) + 2f(x_{i-1}) - f(x_{i-2}) ]}{2h^3}`;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxip2}) - (${2*fxip1}) + (${2*fxim1}) - (${fxim2})]}{${2*(h**3)}} = ${result}`;
                break;
            case "4":
                result = (fxip2-(4*fxip1)+(6*fxi)-(4*fxim1)+(fxim2))/((h**4));
                formulaLatex = `f''''(x) = \\frac{[ f(x_{i+2}) - 4f(x_{i+1}) + 6f(x_{i}) - 4f(x_{i-1}) + f(x_{i-2}) ]}{h^4}`;
                subFormulaLatex = `f'(${x}) = \\frac{[ (${fxip2}) - (${4*fxip1}) + (${6*fxi}) - (${4*fxim1}) + (${fxim2})]}{${(h**4)}} = ${result}`;
            default:
                console.log("not matched");
          }
    setFormula(formulaLatex);
    setSubstitude(subFormulaLatex);
    return result;
  };
  

  const calculateDifferentiation = () => {
    const Xnum = parseFloat(X);
    const Hnum = parseFloat(H);
    let result;

    switch (selectedDirection) {
      case "1":
        result = forwardCalculate(Xnum, Hnum);
        break;
      case "2":
        result = backwardCalculate(Xnum, Hnum);
        break;
      case "3":
        result = centerCalculate(Xnum, Hnum);
        break;
      default:
        console.log("Direction not matched");
    }

    const exactDerivative = derivative(Equation, 'x').toString();
    const exactValue = evaluate(exactDerivative, { x: Xnum });
    const error = Math.abs((result - exactValue) / exactValue) * 100;

    let diffEquation = derivative(Equation, 'x');;
    let exactDiffLatex = `Exact \\ Differentiation \\ of \\ f(x) = ${Equation} \\\\ f'(x) = ${diffEquation.toString()} \\\\ `;
    let symbol = `'`;
        for (let i = 2; i <= selectedOrder; i++) {
            symbol += `'`;
            diffEquation = derivative(diffEquation.toString(), 'x');
            exactDiffLatex += `f${symbol}(x) = ${diffEquation.toString()} \\\\`;
        }

        let errorLatex = `\\displaystyle Error = \\left\\lvert 
        \\frac{f${symbol}(x)_{numerical} - f${symbol}(x)_{true}}{f${symbol}(x)_{true}} \\right\\rvert \\times 100\\% = ${error}\\%`

    setAnswer(result);
    setExactDiff(exactDiffLatex);
    setErrorFormula(errorLatex);
  };

return (
    <div className="flex flex-col max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md justify-center items-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Numerical Differentiation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label>Function f(x)</Label>
              <Input
                value={Equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="Enter function (e.g., x^2 + 3x + 1)"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Point x</Label>
              <Input
                type="number"
                value={X}
                onChange={(e) => setX(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Step size h</Label>
              <Input
                type="number"
                value={H}
                onChange={(e) => setH(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Order</Label>
              <Select value={selectedOrder} onValueChange={(value) => setSelectedOrder(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First</SelectItem>
                  <SelectItem value="2">Second</SelectItem>
                  <SelectItem value="3">Third</SelectItem>
                  <SelectItem value="4">Fourth</SelectItem>
                </SelectContent>
              </Select>
              <Label>Direction</Label>
              <Select value={selectedDirection} onValueChange={(value) => setSelectedDirection(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Forward</SelectItem>
                  <SelectItem value="2">Backward</SelectItem>
                  <SelectItem value="3">Central</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={calculateDifferentiation}
              className="bg-neutral-950 hover:bg-neutral-800"
            >
              Calculate
            </Button>
            <div className="mt-6 overflow-x-auto max-h-96">
              <BlockMath math={formula} />
              <BlockMath math={substitude} />
              <BlockMath math={exactDiff} />
              <BlockMath math={errorFormula} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Differentiation;