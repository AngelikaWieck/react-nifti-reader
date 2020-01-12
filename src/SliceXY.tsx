import React from "react";
import { SliceViewXY } from "./SliceView";
import Slice, { SliceProps } from "./Slice";

const SliceXY: React.FC<SliceProps> = props => {
  return <Slice sliceViewClass={SliceViewXY} {...props} />;
};

export default SliceXY;
