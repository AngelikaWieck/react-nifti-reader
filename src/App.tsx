import React, { useState } from "react";
import NIFTIImage from "./NIFTIImage";
import { SliceViewXY, SliceViewYZ, SliceViewXZ } from "./SliceView";
import { observer, useObservable } from "mobx-react-lite";
import Slice from "./Slice";
import "./App.css";

const App: React.FC = observer(() => {
  const [image, setImage] = useState<NIFTIImage>();

  const store = useObservable({
    maxValue: 200,
    activeCanvas: 0, // 0: XY, 1: YZ, 2: XZ
    slices: [100, 100, 100],
    mainSliceViewClass: SliceViewXY,
    topRightSliceViewClass: SliceViewYZ,
    bottomRightSliceViewClass: SliceViewXZ,
    setMaxValue(value: number) {
      store.maxValue = value;
    },
    handleCanvasClick(id: number) {
      store.activeCanvas = id;
    }
  });

  const commonSliceProps = {
    handleCanvasClick: store.handleCanvasClick,
    activeCanvas: store.activeCanvas,
    slices: store.slices,
    image: image,
    setMaxValue: store.setMaxValue,
  }

  return (
    <div className="App">
      <div className="file-selector">
        Select a file:{" "}
        <input
          onChange={async event => {
            if (!event.target.files) {
              return;
            }
            setImage(await NIFTIImage.readFile(event.target.files[0]));
          }}
          type="file"
          id="file"
          name="files"
        />
      </div>
      <div className="canvas-container">
        <div className="main-view">
          <Slice
            {...commonSliceProps}
            sliceViewClass={store.mainSliceViewClass}
          />
        </div>
        <div className="side-view-container">
          <Slice
            {...commonSliceProps}
            sliceViewClass={store.topRightSliceViewClass}
          />
          <Slice
            {...commonSliceProps}
            sliceViewClass={store.bottomRightSliceViewClass}
          />
        </div>
      </div>
      <div className="slider-container">
        <input
          type="range"
          className="slider"
          min="0"
          max={store.maxValue}
          step="1"
          value={store.slices[store.activeCanvas]}
          onChange={event => {
            store.slices[store.activeCanvas] = +event.target.value;
          }}
        />
      </div>
    </div>
  );
});

export default App;
