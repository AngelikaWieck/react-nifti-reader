import React, { useEffect, useRef } from "react";
import { SliceViewXY } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentXY: React.FC<{
  slice: number;
  image?: NIFTIImage;
}> = props => {
  let sliceViewXYRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (sliceViewXYRef.current) {
      let sliceViewXY = new SliceViewXY(sliceViewXYRef.current, props.image);
      sliceViewXY.update(props.slice);
    }
  });

  return (
    <div className="slice slice-xy">
      <canvas ref={sliceViewXYRef}></canvas>
    </div>
  );
};

export default SliceComponentXY;
