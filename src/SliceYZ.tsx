import React from "react";
import { SliceViewYZ } from "./SliceView";
import SliceComponent, { SliceComponentProps } from "./Slice";

const SliceComponentYZ: React.FC<SliceComponentProps> = props => {
  return <SliceComponent sliceViewClass={SliceViewYZ} {...props} />;
};

export default SliceComponentYZ;
