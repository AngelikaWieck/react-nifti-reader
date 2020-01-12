import React, { useEffect, useRef } from "react";
import NIFTIImage from "./NIFTIImage";
import { SliceViewClass } from "./SliceView";
import "./Slice.css";

export interface SliceComponentProps {
  handleCanvasClick: (id: number) => void;
  slice: number;
  image?: NIFTIImage;
  setMaxValue: (maxValue: number) => void;
}

const SliceComponent: React.FC<SliceComponentProps & {
  sliceViewClass: SliceViewClass;
}> = props => {
  let sliceViewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        props.image
      );
      sliceView.update(props.slice);
    }
  });

  const handleClick = () => {
    if (sliceViewRef.current) {
      let sliceView = new props.sliceViewClass(
        sliceViewRef.current,
        props.image
      );
      sliceView.update(props.slice);
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

export default SliceComponent;
