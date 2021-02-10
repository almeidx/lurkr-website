declare module 'react-animated-number' {
  import * as React from 'react';

  export interface AnimatedNumberProps {
    value: number;
    initialValue?: number;
    component?: any;
    formatValue?: (n: number) => string;
    duration?: number;
    // eslint-disable-next-line @typescript-eslint/ban-types
    frameStyle?: (perc: number) => Object | void;
    stepPrecision?: number;
    className?: string;
    style: any;
  }

  export default class AnimatedNumber extends React.Component<AnimatedNumberProps> {}
}

declare module 'color-thief-node' {
  export function getColorFromURL(imageURL: string, quality?: number): Promise<[number, number, number]>;
}
