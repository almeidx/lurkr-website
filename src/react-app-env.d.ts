/// <reference types='react-scripts' />

declare module '*.gif';

declare module 'react-animated-number' {
  import * as React from 'react';

  export interface AnimatedNumberProps {
    value: number;
    initialValue?: number;
    component?: any;
    formatValue?: (n: number) => string;
    duration?: number;
    frameStyle?: (perc: number) => Object | void;
    stepPrecision?: number;
    className?: string;
    style: any;
  }

  // eslint-disable-next-line react/prefer-stateless-function
  export default class AnimatedNumber extends React.Component<AnimatedNumberProps> {}
}
