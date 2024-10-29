import React, { useState } from 'react';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; 
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js'; 
import { evaluate } from 'mathjs';
import exp from 'constants';

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

  const f = (x) => evaluate(Equation, { x });

  const forwardCalculate = (x, h) => {
    // ... existing forwardCalculate logic ...
  };

  const backwardCalculate = (x, h) => {
    // ... existing backwardCalculate logic ...
  };

  const centerCalculate = (x, h) => {
    // ... existing centerCalculate logic ...
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
        console.log("not matched");
    }

    // Calculate exact derivative
    const exactDerivative = derivative(Equation, 'x');
    const exactValue = evaluate(exactDerivative.toString(), { x: Xnum });
    const error = Math.abs((result - exactValue) / exactValue) * 100;

    // Set results
    setAnswer(result);
    setExactDiff(`Exact derivative at x = ${Xnum} is ${exactValue}`);
    setErrorFormula(`Error = ${error.toFixed(2)}%`);
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
              <Select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
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
            <Button
              onClick={calculateDifferentiation}
              className="bg-neutral-950 hover:bg-neutral-800"
            >
              Calculate
            </Button>
            <div className="mt-6 overflow-auto max-h-96">
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