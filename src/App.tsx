import React, { useState } from "react";
import NIFTIImage from "./NIFTIImage";
import SliceXY from "./SliceXY";
import SliceYZ from "./SliceYZ";
import SliceXZ from "./SliceXZ";
import "./App.css";

const App: React.FC = () => {
  const [slice, setSlice] = useState(0);
  const [image, setImage] = useState<NIFTIImage>();
  const [maxValue, setMaxValue] = useState(200);
  const [activeCanvas, setActiveCanvas] = useState<HTMLCanvasElement>();

  function handleCanvasClick(canvas: HTMLCanvasElement) {
    if (activeCanvas !== canvas) {
      if (activeCanvas) activeCanvas.style.border = "none";
      canvas.style.border = "5px solid red";
      setActiveCanvas(canvas);
    }
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
          <SliceXY
            handleCanvasClick={handleCanvasClick}
            activeCanvas={activeCanvas}
            slice={slice}
            image={image}
            setMaxValue={setMaxValue}
          />
        </div>
        <div className="side-view-container">
          <SliceYZ
            handleCanvasClick={handleCanvasClick}
            slice={slice}
            image={image}
            setMaxValue={setMaxValue}
          />
          <SliceXZ
            handleCanvasClick={handleCanvasClick}
            slice={slice}
            image={image}
            setMaxValue={setMaxValue}
          />
        </div>
      </div>
      <div className="slider-container">
        <input
          type="range"
          className="slider"
          min="0"
          max={maxValue}
          step="1"
          value={slice.toString()}
          onChange={event => {
            setSlice(+event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default App;
