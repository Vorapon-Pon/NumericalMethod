import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { evaluate, derivative } from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const NumericalDifferentiation = () => {
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

  const calculateDifferentiation = () => {
    // Implement differentiation logic similar to forwardCalculate, backwardCalculate, centerCalculate
    // Update formula, substitude, exactDiff, errorFormula, and Answer states
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
              <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <Label>Direction</Label>
              <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)}>
                <option value="1">Forward</option>
                <option value="2">Backward</option>
                <option value="3">Central</option>
              </select>
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

export default NumericalDifferentiation; 