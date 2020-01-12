import React from "react";
import { SliceViewXZ } from "./SliceView";
import Slice, { SliceProps } from "./Slice";

const SliceXZ: React.FC<SliceProps> = props => {
  return <Slice sliceViewClass={SliceViewXZ} {...props} />;
};

export default SliceXZ;
