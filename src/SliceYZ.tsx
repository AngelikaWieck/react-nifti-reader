import React, { useEffect, useRef } from "react";
import { SliceViewYZ } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentYZ: React.FC<{
  handleCanvasClick: (canvas: HTMLCanvasElement) => void;
  slice: number;
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
}> = props => {
  let sliceViewYZRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (sliceViewYZRef.current) {
      let sliceViewYZ = new SliceViewYZ(sliceViewYZRef.current, props.image);
      sliceViewYZ.update(props.slice);
    }
  });

  const handleClick = () => {
    if (sliceViewYZRef.current) {
      let sliceViewYZ = new SliceViewYZ(sliceViewYZRef.current, props.image);
      props.setMaxValue(sliceViewYZ.cols);
      props.handleCanvasClick(sliceViewYZRef.current);
    }
  };

  return (
    <div className="slice slice-yz" onClick={handleClick}>
      <canvas ref={sliceViewYZRef}></canvas>
    </div>
  );
};

export default SliceComponentYZ;
