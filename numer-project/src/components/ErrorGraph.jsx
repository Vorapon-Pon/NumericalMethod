// ErrorGraph.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const ErrorGraph = ({ data }) => {
  const iterations = data.map((_, index) => index + 1);
  const errors = data.map(iter => iter.error);

  return (
    <div>
      <Plot
        
        data={[
          {
            x: iterations,
            y: errors,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#8884d8' },
            name: 'Error',
          }
        ]}
        layout={{
          title: 'Error Graph',
          xaxis: { 
            title: 'Iteration', 
            showgrid: true, 
            zeroline: true,
            autorange: true
          },
          yaxis: { 
            title: 'Error', 
            showgrid: true, 
            zeroline: true, 
            autorange: true
          },
          dragmode: 'pan', 
          hovermode: 'closest', 
        }}
        config={{
          displayModeBar: true, 
          scrollZoom: true,
        }}
      />
    </div>
  );
};

export default ErrorGraph;
