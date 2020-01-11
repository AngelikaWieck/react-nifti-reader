import React, { useEffect, useRef } from "react";
import { SliceViewYZ } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentYZ: React.FC<{
  slice: number;
  image?: NIFTIImage;
}> = props => {
  let sliceViewYZRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (sliceViewYZRef.current) {
      let sliceViewYZ = new SliceViewYZ(sliceViewYZRef.current, props.image);
      sliceViewYZ.update(props.slice);
    }
  });

  return (
    <div>
      <canvas className="slice slice-yz" ref={sliceViewYZRef}></canvas>
    </div>
  );
};

export default SliceComponentYZ;
