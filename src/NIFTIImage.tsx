import nifti from "nifti-reader-js";

function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
}

class NIFTIImage {
  static async readFile(file: File) {
    const data = await readFile(file);
    return this.parseData(data);
  }

  static parseData(data: ArrayBuffer) {
    if (nifti.isCompressed(data)) {
      data = nifti.decompress(data);
    }
    if (!nifti.isNIFTI(data)) {
      throw new Error("This is not a NIFTI image!!");
    }
    let header = nifti.readHeader(data);
    let image = nifti.readImage(header, data);
    return new this(header, image);
  }

  data: Uint8Array;

  constructor(public header: any, public image: ArrayBuffer) {
    // this.header and this.image are automatically set

    let typedData;
    // convert raw data to typed array based on nifti datatype
    if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
      typedData = new Uint8Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
      typedData = new Int16Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
      typedData = new Int32Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
      typedData = new Float32Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
      typedData = new Float64Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
      typedData = new Int8Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
      typedData = new Uint16Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
      typedData = new Uint32Array(image);
    } else {
      throw new Error("Unknown nifti data type " + header.datatypeCode);
    }

    let min = typedData[0];
    let max = typedData[0];
    for (let i = 0; i < typedData.length; i++) {
      if (typedData[i] < min) min = typedData[i];
      if (typedData[i] > max) max = typedData[i];
    }

    let factor = 256 / (max - min);
    for (let i = 0; i < typedData.length; i++) {
      typedData[i] = (typedData[i] - min) * factor;
    }

    // TODO
    this.data = typedData as Uint8Array;
  }
}

export default NIFTIImage;
