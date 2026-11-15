import { describe, expect, test } from "bun:test";
import {
  buildBmFontDescriptor,
  canvasToBmpBlob,
  encodeCanvasToImage2CppBytes,
} from "../src/engine/bitmapEncoder";
import type { Image2CppOptions } from "../src/engine/bitmapEncoder";

function mockCanvas(width: number, height: number, rgba: number[]) {
  return {
    width,
    height,
    getContext: () => ({
      getImageData: () => ({ data: new Uint8ClampedArray(rgba) }),
    }),
  } as unknown as HTMLCanvasElement;
}

function options(drawMode: Image2CppOptions["drawMode"]): Image2CppOptions {
  return {
    drawMode,
    outputStyle: "plain-bytes",
    invertColors: false,
    prefix: "test",
    includeAllArray: false,
    threshold: 128,
  };
}

describe("image2cpp bitmap packing", () => {
  test("horizontal MSB packs leftmost pixel into the high bit", () => {
    const canvas = mockCanvas(9, 1, [
      255, 255, 255, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 255, 255, 255, 255,
    ]);
    expect(encodeCanvasToImage2CppBytes(canvas, options("horizontal-msb"))).toEqual([0x80, 0x80]);
  });

  test("horizontal LSB packs leftmost pixel into the low bit", () => {
    const canvas = mockCanvas(9, 1, [
      255, 255, 255, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 255, 255, 255, 255,
    ]);
    expect(encodeCanvasToImage2CppBytes(canvas, options("horizontal-lsb"))).toEqual([0x01, 0x01]);
  });

  test("vertical modes pack pixels into successive 8-pixel pages", () => {
    const pixels: number[] = [];
    for (let y = 0; y < 9; y++) {
      const on = y === 0 || y === 8;
      pixels.push(on ? 255 : 0, on ? 255 : 0, on ? 255 : 0, 255);
    }
    const canvas = mockCanvas(1, 9, pixels);
    expect(encodeCanvasToImage2CppBytes(canvas, options("vertical-lsb"))).toEqual([0x01, 0x01]);
    expect(encodeCanvasToImage2CppBytes(canvas, options("vertical-msb"))).toEqual([0x80, 0x80]);
  });

  test("threshold and inversion are applied consistently", () => {
    const canvas = mockCanvas(2, 1, [
      127, 127, 127, 255,
      128, 128, 128, 255,
    ]);
    const cfg = { ...options("horizontal-msb"), invertColors: false };
    expect(encodeCanvasToImage2CppBytes(canvas, cfg)).toEqual([0x40]);
    expect(encodeCanvasToImage2CppBytes(canvas, { ...cfg, invertColors: true })).toEqual([0x80]);
  });
});

describe("BMP export", () => {
  test("1-bit BMP includes aligned rows and a two-color palette", async () => {
    const canvas = mockCanvas(1, 1, [255, 255, 255, 255]);
    const blob = canvasToBmpBlob(canvas, 1, 128);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const view = new DataView(bytes.buffer);

    expect(blob.type).toBe("image/bmp");
    expect(bytes.length).toBe(66);
    expect(view.getUint32(10, true)).toBe(62);
    expect(view.getUint16(28, true)).toBe(1);
    expect(bytes[62]).toBe(0x80);
  });

  test("24-bit BMP stores pixels in BGR order with row padding", async () => {
    const canvas = mockCanvas(1, 1, [10, 20, 30, 255]);
    const blob = canvasToBmpBlob(canvas, 24);
    const bytes = new Uint8Array(await blob.arrayBuffer());

    expect(bytes.length).toBe(58);
    expect(bytes[54]).toBe(30);
    expect(bytes[55]).toBe(20);
    expect(bytes[56]).toBe(10);
    expect(bytes[57]).toBe(0);
  });
});

test("BMFont descriptor points to the exported atlas from its firmware folder", () => {
  const descriptor = buildBmFontDescriptor("ronin-katana-split");
  expect(descriptor).toContain('../bmp_24bit_25x50/spritesheet_275x50.bmp');
  expect(descriptor).toContain("chars count=11");
});
