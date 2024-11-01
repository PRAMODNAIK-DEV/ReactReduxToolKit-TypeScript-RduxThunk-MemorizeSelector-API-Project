declare module 'react-plotly.js' {
    import { Component } from 'react';
    import Plotly from 'plotly.js';
  
    interface PlotParams {
      data: Plotly.Data[];
      layout?: Partial<Plotly.Layout>;
      config?: Partial<Plotly.Config>;
      onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
      onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
      onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    }
  
    export default class Plot extends Component<PlotParams> {}
  }
  