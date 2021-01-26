declare module "react-animated-number" {
  import * as React from "react";

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

  export default class AnimatedNumber extends React.Component<AnimatedNumberProps> {}
}
