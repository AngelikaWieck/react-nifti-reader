import React, { useEffect, useRef } from "react";
import NIFTIImage from "./NIFTIImage";
import { SliceViewClass } from "./SliceView";
import "./Slice.css";

export interface SliceProps {
  handleCanvasClick: (id: number) => void;
  activeCanvas: number;
  slices: number[];
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
}

const Slice: React.FC<SliceProps & {
  sliceViewClass: SliceViewClass;
}> = props => {
  let sliceViewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        props.image
      );
      sliceView.update(props.slices, props.activeCanvas);
    }
  });

  const handleClick = () => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        props.image
      );
      sliceView.update(props.slices, props.activeCanvas);
      props.setMaxValue(sliceView.depth);
      props.handleCanvasClick(sliceView.id);
    }
  };

  return (
    <div
      className={
        "slice" + (props.sliceViewClass.flipVertically ? " flip-vertical" : "")
      }
      onClick={handleClick}
    >
      <canvas ref={sliceViewRef}></canvas>
    </div>
  );
};

export default Slice;
