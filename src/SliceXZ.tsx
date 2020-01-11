import React, { useEffect, useRef } from "react";
import { SliceViewXZ } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentXZ: React.FC<{
  slice: number;
  image?: NIFTIImage;
}> = props => {
  let sliceViewXZRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (sliceViewXZRef.current) {
      let sliceViewXZ = new SliceViewXZ(sliceViewXZRef.current, props.image);
      sliceViewXZ.update(props.slice);
    }
  });

  return (
    <div>
      <canvas className="slice slice-xz" ref={sliceViewXZRef}></canvas>
    </div>
  );
};

export default SliceComponentXZ;
