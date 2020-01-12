import React from "react";
import { SliceViewXY } from "./SliceView";
import SliceComponent, { SliceComponentProps } from "./Slice";

const SliceComponentXY: React.FC<SliceComponentProps> = props => {
  return <SliceComponent sliceViewClass={SliceViewXY} {...props} />;
};

export default SliceComponentXY;
