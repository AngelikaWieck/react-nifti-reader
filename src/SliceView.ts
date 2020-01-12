import NIFTIImage from "./NIFTIImage";

export type SliceViewClass = typeof SliceView;

export class SliceView {
  id = 0;
  ctx: CanvasRenderingContext2D | null = null;
  image: NIFTIImage = null as any;
  static flipVertically = false;

  constructor(private canvas: HTMLCanvasElement, image?: NIFTIImage) {
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

  get canvasDim(): [number, number] {
    throw new Error("No canvasDim getter, because this is the super class");
  }

  setImage(image: NIFTIImage) {
    this.image = image;
    // set canvas dimensions to nifti slice dimensions
    const [width, height] = this.canvasDim;
    this.canvas.width = width;
    this.canvas.height = height;

    // make canvas image data
    this.ctx = this.canvas.getContext("2d");
  }

  innerUpdate(canvasImageData: ImageData, slice: number) {
    throw new Error("No innerUpdate function, because this is the super class");
  }

  update(slice: number) {
    if (!this.ctx) {
      return;
    }

    let canvasImageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );

    this.innerUpdate(canvasImageData, slice);

    this.ctx.putImageData(canvasImageData, 0, 0);
  }
}

export class SliceViewXY extends SliceView {
  id = 0;

  get canvasDim(): [number, number] {
    return [this.cols, this.rows];
  }

  get depth(): number {
    return this.slices;
  }

  innerUpdate(canvasImageData: ImageData, slice: number) {
    let sliceSize = this.cols * this.rows;
    let sliceOffset = sliceSize * slice;

    let canvasImageDataIndex = 0;
    for (let i = sliceOffset; i < sliceOffset + sliceSize; i++) {
      canvasImageData.data[canvasImageDataIndex] = this.image.data[i]; // r
      canvasImageData.data[canvasImageDataIndex + 1] = this.image.data[i]; // g
      canvasImageData.data[canvasImageDataIndex + 2] = this.image.data[i]; // b
      canvasImageData.data[canvasImageDataIndex + 3] = 0xff; // a
      canvasImageDataIndex += 4;
    }
  }
}

export class SliceViewYZ extends SliceView {
  id = 1;
  static flipVertically = true;

  get canvasDim(): [number, number] {
    return [this.rows, this.slices];
  }

  get depth(): number {
    return this.cols;
  }

  innerUpdate(canvasImageData: ImageData, slice: number) {
    let sliceSize = this.cols * this.rows;

    let canvasImageDataIndex = 0;
    for (let i = slice; i < sliceSize * this.slices; i += this.cols) {
      canvasImageData.data[canvasImageDataIndex] = this.image.data[i];
      canvasImageData.data[canvasImageDataIndex + 1] = this.image.data[i];
      canvasImageData.data[canvasImageDataIndex + 2] = this.image.data[i];
      canvasImageData.data[canvasImageDataIndex + 3] = 0xff;
      canvasImageDataIndex += 4;
    }
  }
}

export class SliceViewXZ extends SliceView {
  id = 2;
  static flipVertically = true;

  get canvasDim(): [number, number] {
    return [this.cols, this.slices];
  }

  get depth(): number {
    return this.rows;
  }

  innerUpdate(canvasImageData: ImageData, slice: number) {
    let sliceSize = this.cols * this.rows;

    let canvasImageDataIndex = 0;
    for (let i = 0; i < sliceSize * this.slices; i += sliceSize) {
      for (
        let k = sliceSize - slice * this.cols;
        k < sliceSize - slice * this.cols + this.cols;
        k++
      ) {
        canvasImageData.data[canvasImageDataIndex] = this.image.data[k + i];
        canvasImageData.data[canvasImageDataIndex + 1] = this.image.data[k + i];
        canvasImageData.data[canvasImageDataIndex + 2] = this.image.data[k + i];
        canvasImageData.data[canvasImageDataIndex + 3] = 0xff;
        canvasImageDataIndex += 4;
      }
    }
  }
}
