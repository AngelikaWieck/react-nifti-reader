import React from "react";
import { SliceViewYZ } from "./SliceView";
import Slice, { SliceProps } from "./Slice";

const SliceYZ: React.FC<SliceProps> = props => {
  return <Slice sliceViewClass={SliceViewYZ} {...props} />;
};

export default SliceYZ;
