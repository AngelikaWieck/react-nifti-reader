declare module "nifti-reader-js" {
  interface NIFTIHeader {
    dims: number[];
  }

  function isCompressed(data: ArrayBuffer): boolean;
  function decompress(data: ArrayBuffer): ArrayBuffer;
  function isNIFTI(data: ArrayBuffer): Boolean;
  function readHeader(data: ArrayBuffer): NIFTIHeader;
  function readImage(header: NIFTIHeader, data: ArrayBuffer): ArrayBuffer;

  namespace NIFTI1 {
    const TYPE_UINT8: number;
    const TYPE_UINT16: number;
    const TYPE_UINT32: number;
    const TYPE_INT8: number;
    const TYPE_INT16: number;
    const TYPE_INT32: number;
    const TYPE_FLOAT32: number;
    const TYPE_FLOAT64: number;
  }
}
