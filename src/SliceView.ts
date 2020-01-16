import NIFTIImage from "./NIFTIImage";

export type SliceViewClass = typeof SliceView;

export class SliceView {
  id = 0;
  ctx: CanvasRenderingContext2D | null = null;
  image: NIFTIImage = null as any;
  scaleFactor: number;
  static flipVertically = false;

  constructor(private canvas: HTMLCanvasElement, scaleFactor: number, image?: NIFTIImage) {
    this.scaleFactor = scaleFactor;
    if (image) {
      this.setImage(image);
    }
  }

  get dims(): number[] {
    return this.image.header.dims;
  }

  get cols() {
    return this.dims[1];
  }

  get rows() {
    return this.dims[2];
  }

  get slices() {
    return this.dims[3];
  }

  get depth(): number {
    throw new Error("No depth getter, because this is the super class");
  }

  get sliceDim(): [number, number] {
    throw new Error("No sliceDim getter, because this is the super class");
  }

  setImage(image: NIFTIImage) {
    this.image = image;
    // set canvas dimensions to nifti slice dimensions
    const [width, height] = this.sliceDim;
    this.canvas.width = width * this.scaleFactor;
    this.canvas.height = height * this.scaleFactor;

    // make canvas image data
    this.ctx = this.canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = "white";
    }
  }

  extractSlice(slices: number[]): number[] {
    throw new Error("No extractSlice function, because this is the super class");
  }

  drawLines(slices: number[], windowID: number) {
    throw new Error("No extractSlice function, because this is the super class");
  }

  scale(slice: number[], scaleFactor: number): number[] {
    let scaledSlice: number[] = new Array<number>(slice.length * scaleFactor * scaleFactor);

    for (let scaledY = 0; scaledY < this.canvas.height; scaledY ++) {
      const baseY = Math.floor(scaledY / scaleFactor);
      for (let scaledX = 0; scaledX < this.canvas.width; scaledX++) {
        const baseX = Math.floor(scaledX / scaleFactor);
        
        let baseIndex = baseX + baseY * this.canvas.width / scaleFactor;
        let scaledIndex = scaledX + scaledY * this.canvas.width;

        scaledSlice[scaledIndex] = slice[baseIndex];
      }
    }

    return scaledSlice;
  }

  update(slices: number[], mainView: number) {
    if (!this.ctx) {
      return;
    }

    const slice = this.extractSlice(slices);
    
    const scaledSlice = this.scale(slice, this.scaleFactor);
    
    let canvasImageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    
    for (let i = 0; i < scaledSlice.length; i++) {
      canvasImageData.data[4 * i] = scaledSlice[i];     // r
      canvasImageData.data[4 * i + 1] = scaledSlice[i]; // g
      canvasImageData.data[4 * i + 2] = scaledSlice[i]; // b
      canvasImageData.data[4 * i + 3] = 0xff;           // a
    }
    
    this.ctx.putImageData(canvasImageData, 0, 0);
    
    this.drawLines(slices, mainView);
  }
}

export class SliceViewXY extends SliceView {
  id = 0;
  static flipVertically = true;

  get sliceDim(): [number, number] {
    return [this.cols, this.rows];
  }

  get depth(): number {
    return this.slices;
  }

  extractSlice(slices: number[]) {
    let slice: number[] = []; //TODO: set the correct size of the array here to save performance
    let sliceSize = this.cols * this.rows;
    let sliceOffset = sliceSize * slices[0];
    let sliceIndex = 0;

    for (let i = sliceOffset; i < sliceOffset + sliceSize; i++) {
      slice[sliceIndex++] = this.image.data[i];
    }

    return slice;
  }

  drawLines(slices: number[], mainView: number) {
    if (mainView === 1) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(slices[1], 0);
        this.ctx.lineTo(slices[1], this.rows);
        this.ctx.stroke();
      }
    }
    if (mainView === 2) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rows - slices[2]);
        this.ctx.lineTo(this.cols, this.rows - slices[2]);
        this.ctx.stroke();
      }
    }
  }
}

export class SliceViewYZ extends SliceView {
  id = 1;
  static flipVertically = true;

  get sliceDim(): [number, number] {
    return [this.rows, this.slices];
  }

  get depth(): number {
    return this.cols;
  }

  extractSlice(slices: number[]) {
    let slice: number[] = [];
    let sliceSize = this.cols * this.rows;

    let sliceIndex = 0;
    for (let i = slices[1]; i < sliceSize * this.slices; i += this.cols) {
      slice[sliceIndex++] = this.image.data[i];
    }

    return slice;
  }

  drawLines(slices: number[], activeCanvas: number) {
    if (activeCanvas === 0) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, slices[0]);
        this.ctx.lineTo(this.rows, slices[0]);
        this.ctx.stroke();
      }
    }

    if (activeCanvas === 2) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.rows - slices[2], 0);
        this.ctx.lineTo(this.rows - slices[2], this.rows);
        this.ctx.stroke();
      }
    }
  }
}

export class SliceViewXZ extends SliceView {
  id = 2;
  static flipVertically = true;

  get sliceDim(): [number, number] {
    return [this.cols, this.slices];
  }

  get depth(): number {
    return this.rows;
  }

  extractSlice(slices: number[]) {
    let slice: number[] = [];
    let sliceSize = this.cols * this.rows;

    let sliceIndex = 0;
    for (let i = 0; i < sliceSize * this.slices; i += sliceSize) {
      for (
        let k = sliceSize - slices[2] * this.cols;
        k < sliceSize - slices[2] * this.cols + this.cols;
        k++
      ) {
        slice[sliceIndex++] = this.image.data[k + i];
      }
    }

    return slice;
  }

  drawLines(slices: number[], activeCanvas: number) {
    if (activeCanvas === 0) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, slices[0]);
        this.ctx.lineTo(this.rows, slices[0]);
        this.ctx.stroke();
      }
    }
    if (activeCanvas === 1) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(slices[1], 0);
        this.ctx.lineTo(slices[1], this.rows);
        this.ctx.stroke();
      }
    }
  }
}
