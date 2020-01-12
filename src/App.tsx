import React, { useState } from "react";
import NIFTIImage from "./NIFTIImage";
import SliceXY from "./SliceXY";
import SliceYZ from "./SliceYZ";
import SliceXZ from "./SliceXZ";
import { observer, useObservable } from "mobx-react-lite";
import "./App.css";

const App: React.FC = observer(() => {
  const [image, setImage] = useState<NIFTIImage>();

  const store = useObservable({
    maxValue: 200,
    activeCanvas: 0, // 0: XY, 1: YZ, 2: XZ
    slices: [100, 100, 100],
    setMaxValue(value: number) {
      store.maxValue = value;
    },
    handleCanvasClick(id: number) {
      store.activeCanvas = id;
    }
  });

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
          <SliceXY
            handleCanvasClick={store.handleCanvasClick}
            activeCanvas={store.activeCanvas}
            slices={store.slices}
            image={image}
            setMaxValue={store.setMaxValue}
          />
        </div>
        <div className="side-view-container">
          <SliceYZ
            handleCanvasClick={store.handleCanvasClick}
            activeCanvas={store.activeCanvas}
            slices={store.slices}
            image={image}
            setMaxValue={store.setMaxValue}
          />
          <SliceXZ
            handleCanvasClick={store.handleCanvasClick}
            activeCanvas={store.activeCanvas}
            slices={store.slices}
            image={image}
            setMaxValue={store.setMaxValue}
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
