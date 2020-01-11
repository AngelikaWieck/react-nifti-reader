import React, { useEffect, useRef } from "react";
import { SliceViewXY } from "./SliceView";
import NIFTIImage from "./NIFTIImage";
import "./Slice.css";

const SliceComponentXY: React.FC<{
  handleCanvasClick: (canvas: HTMLCanvasElement) => void;
  activeCanvas?: HTMLCanvasElement;
  slice: number;
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
}> = props => {
  let sliceViewXYRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (sliceViewXYRef.current) {
      let sliceViewXY = new SliceViewXY(sliceViewXYRef.current, props.image);
      sliceViewXY.update(props.slice);
      // if (props.activeCanvas === sliceViewXYRef.current) {
      //   sliceViewXY.update(props.slice);
      // }
    }
  });

  const handleClick = () => {
    if (sliceViewXYRef.current) {
      let sliceViewXY = new SliceViewXY(sliceViewXYRef.current, props.image);
      props.setMaxValue(sliceViewXY.slices);
      props.handleCanvasClick(sliceViewXYRef.current);
    }
  };

  return (
    <div className="slice slice-xy " onClick={handleClick}>
      <canvas ref={sliceViewXYRef}></canvas>
    </div>
  );
};

export default SliceComponentXY;
