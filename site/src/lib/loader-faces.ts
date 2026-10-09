/** Midpoint of the eyes, normalized to the original 1672 × 941 frames.
 * The images remain unchanged: only their presentation is registered.
 */
export const loaderFaces = [
  [.509,.350],[.512,.348],[.516,.354],[.511,.349],[.513,.350],
  [.515,.358],[.513,.357],[.512,.361],[.515,.348],[.513,.347],
  [.510,.352],[.513,.359],[.516,.357],[.518,.358],[.510,.355],
  [.513,.333],[.513,.360],[.514,.364],[.517,.361],[.513,.363],
  [.514,.377],[.514,.385],[.514,.380],[.518,.356],[.515,.370],
  [.515,.377],[.516,.385],[.516,.380],[.520,.379],[.514,.367],
].map(([x,y],index)=>({
  src:`/media/identity/loader-faces/frame-${String(index+1).padStart(2,'0')}.webp`,
  x:(.5-x!)*100,
  y:(.36-y!)*100,
  origin:`${x!*100}% ${y!*100}%`,
}));

export function showLoaderFace(image: HTMLImageElement, index: number) {
  const face=loaderFaces[index]!;
  image.src=face.src;
  image.style.transformOrigin=face.origin;
  image.style.transform=`translate(${face.x}%,${face.y}%) scale(1.06)`;
  image.dataset.frame=String(index+1);
}
