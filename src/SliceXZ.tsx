import React from "react";
import { SliceViewXZ } from "./SliceView";
import SliceComponent, { SliceComponentProps } from "./Slice";

const SliceComponentXZ: React.FC<SliceComponentProps> = props => {
  return <SliceComponent sliceViewClass={SliceViewXZ} {...props} />;
};

export default SliceComponentXZ;
