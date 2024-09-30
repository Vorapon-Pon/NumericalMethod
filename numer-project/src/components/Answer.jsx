import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Answer = ({ equation, root, precision }) => {
  return (
    <div className="mt-8 text-left">
      <h2 className="text-2xl font-semibold mb-4">Solution</h2>
      <BlockMath math={`Equation: f(x) = ${equation}`} />
      <BlockMath math={`Root = ${root.toFixed(parseInt(precision))}`} />
    </div>
  );
};

export default Answer;
