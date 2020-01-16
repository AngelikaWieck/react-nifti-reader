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
    slices: [100, 100, 100],
    mainSliceViewClass: SliceViewXY,
    topRightSliceViewClass: SliceViewYZ,
    bottomRightSliceViewClass: SliceViewXZ,
    mainView: 0, // 0: XY, 1: YZ, 2: XZ
    setMaxValue(value: number) {
      store.maxValue = value;
    },
    handleCanvasClick(windowID: number, newMainView: number) {
      store.mainView = newMainView;
      const oldMainSliceViewClass = store.mainSliceViewClass;
      switch(windowID) {
        case 1:
          // switch main and topRight
          store.mainSliceViewClass = store.topRightSliceViewClass;
          store.topRightSliceViewClass = oldMainSliceViewClass;
          break;
        case 2:
          // switch main and bottomRight
          store.mainSliceViewClass = store.bottomRightSliceViewClass;
          store.bottomRightSliceViewClass = oldMainSliceViewClass;
          break;
        default:
          break;
      }
    }
  });

  const commonSliceProps = {
    handleCanvasClick: store.handleCanvasClick,
    slices: store.slices,
    image: image,
    setMaxValue: store.setMaxValue,
    mainView: store.mainView,
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
            windowID={0}
            {...commonSliceProps}
            sliceViewClass={store.mainSliceViewClass}
          />
        </div>
        <div className="side-view-container">
          <Slice
            windowID={1}
            {...commonSliceProps}
            sliceViewClass={store.topRightSliceViewClass}
          />
          <Slice
            windowID={2}
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
          value={store.slices[store.mainView]}
          onChange={event => {
            store.slices[store.mainView] = +event.target.value;
          }}
        />
      </div>
    </div>
  );
});

export default App;
