import React, { useEffect, useRef } from "react";
import { SliceViewXZ } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentXZ: React.FC<{
  handleCanvasClick: (canvas: HTMLCanvasElement) => void;
  slice: number;
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
}> = props => {
  let sliceViewXZRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (sliceViewXZRef.current) {
      let sliceViewXZ = new SliceViewXZ(sliceViewXZRef.current, props.image);
      sliceViewXZ.update(props.slice);
    }
  });

  const handleClick = () => {
    if (sliceViewXZRef.current) {
      let sliceViewXZ = new SliceViewXZ(sliceViewXZRef.current, props.image);
      props.setMaxValue(sliceViewXZ.rows);
      props.handleCanvasClick(sliceViewXZRef.current);
    }
  };

  return (
    <div className="slice slice-xz" onClick={handleClick}>
      <canvas ref={sliceViewXZRef}></canvas>
    </div>
  );
};

export default SliceComponentXZ;
