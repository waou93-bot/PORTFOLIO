export const ROOM_IMAGE = '/media/room/salon-v1.webp';
let prepared: Promise<boolean> | undefined;
export function prepareRoom() {
  return prepared ??= (async () => {
    const image = new Image();
    image.src = ROOM_IMAGE;
    try { await image.decode(); return true; } catch { return false; }
  })();
}
