import React, { useEffect, useRef } from "react";
import NIFTIImage from "./NIFTIImage";
import { SliceViewClass } from "./SliceView";
import "./Slice.css";

export interface SliceProps {
  handleCanvasClick: (windowID: number, newMainView: number) => void;
  slices: number[];
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
  sliceViewClass: SliceViewClass;
  windowID: number;
  mainView: number;
}

const Slice: React.FC<SliceProps> = props => {
  let sliceViewRef = useRef<HTMLCanvasElement>(null);
  let scaleFactor = props.windowID === 0 ? 3 : 1; //TODO: calculate this somehow

  useEffect(() => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        scaleFactor,
        props.image
      );
      sliceView.update(props.slices, props.mainView);
    }
  });

  const handleClick = () => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        scaleFactor,
        props.image
      );
      sliceView.update(props.slices, props.mainView);
      props.setMaxValue(sliceView.depth);
      props.handleCanvasClick(props.windowID, sliceView.id);
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
