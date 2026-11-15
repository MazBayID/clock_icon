export interface SpriteSheetItem {
  id: string;
  canvas: HTMLCanvasElement;
}

export interface SpriteSheetLayout {
  width: number;
  height: number;
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}

export function getSpriteSheetLayout(
  items: { width: number; height: number }[],
  columns = 4,
  gap = 2,
): SpriteSheetLayout {
  if (items.length === 0) throw new Error('Cannot create an empty sprite sheet.');
  const safeColumns = Math.max(1, Math.min(items.length, Math.floor(columns) || 1));
  const safeGap = Math.max(0, Math.min(32, Math.floor(gap) || 0));
  const cellWidth = Math.max(...items.map((item) => item.width));
  const cellHeight = Math.max(...items.map((item) => item.height));
  const rows = Math.ceil(items.length / safeColumns);
  return {
    width: safeColumns * cellWidth + (safeColumns - 1) * safeGap,
    height: rows * cellHeight + (rows - 1) * safeGap,
    columns: safeColumns,
    rows,
    cellWidth,
    cellHeight,
    gap: safeGap,
  };
}

export function createSpriteSheetCanvas(
  items: SpriteSheetItem[],
  columns = 4,
  gap = 2,
): HTMLCanvasElement {
  const layout = getSpriteSheetLayout(
    items.map(({ canvas }) => ({ width: canvas.width, height: canvas.height })),
    columns,
    gap,
  );
  const sheet = document.createElement('canvas');
  sheet.width = layout.width;
  sheet.height = layout.height;
  const ctx = sheet.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is unavailable.');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  items.forEach(({ canvas }, index) => {
    const column = index % layout.columns;
    const row = Math.floor(index / layout.columns);
    const x = column * (layout.cellWidth + layout.gap) + (layout.cellWidth - canvas.width) / 2;
    const y = row * (layout.cellHeight + layout.gap) + (layout.cellHeight - canvas.height) / 2;
    ctx.drawImage(canvas, x, y);
  });
  return sheet;
}
