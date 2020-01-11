import React, { useState } from "react";
import NIFTIImage from "./NIFTIImage";
import SliceXY from "./SliceXY";
import SliceYZ from "./SliceYZ";
import SliceXZ from "./SliceXZ";
import "./App.css";

const App: React.FC = () => {
  const [slice, setSlice] = useState(0);
  const [image, setImage] = useState<NIFTIImage>();
  return (
    <div className="App">
      <p>
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
      </p>
      <div className="canvas-container">
        <SliceXY slice={slice} image={image} />
        <br />
        <SliceYZ slice={slice} image={image} />
        <br />
        <SliceXZ slice={slice} image={image} />
        <br />
      </div>
      <input
        className="slider"
        id="myRange"
        type="range"
        min="0"
        max="100"
        step="1"
        value={slice.toString()}
        onChange={event => {
          setSlice(+event.target.value);
        }}
      />
    </div>
  );
};

export default App;
