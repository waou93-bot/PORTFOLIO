import { afterEach, describe, expect, it, vi } from 'vitest';
import { initHeroVideoReel } from '../../src/lib/hero-video-reel';

afterEach(() => vi.unstubAllGlobals());

function setup(reduced = false) {
  const source = { removeAttribute: vi.fn() };
  const video = Object.assign(new EventTarget(), {
    readyState: 2, muted: false, defaultMuted: false, loop: false,
    playbackRate: 0.8, defaultPlaybackRate: 0.8,
    play: vi.fn().mockResolvedValue(undefined), pause: vi.fn(),
    removeAttribute: vi.fn(), load: vi.fn(), querySelectorAll: () => [source],
  });
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const page = Object.assign(new EventTarget(), { hidden: false });
  let observe: (entries: { isIntersecting: boolean }[]) => void = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal('document', page);
  vi.stubGlobal('matchMedia', () => motion);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof observe) { observe = callback; }
    observe() {}
    disconnect = disconnect;
  });
  const root = { dataset: { state: 'portrait', heroVideoReady: '' }, querySelector: () => video };
  const reel = initHeroVideoReel(root as unknown as HTMLElement);
  return { video, source, motion, page, root, reel, disconnect, visible: (value: boolean) => observe([{ isIntersecting: value }]) };
}

describe('native hero video lifecycle', () => {
  it('plays at normal speed, pauses offscreen and resumes on return', () => {
    const { reel, video, visible } = setup();
    reel.play();
    expect(video.playbackRate).toBe(1);
    expect(video.loop).toBe(true);
    expect(video.play).toHaveBeenCalledTimes(1);
    visible(false);
    expect(video.pause).toHaveBeenCalled();
    reel.play();
    expect(video.play).toHaveBeenCalledTimes(1);
    visible(true);
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  it('keeps the background still for reduced motion and hidden tabs', () => {
    const { reel, video, page, motion } = setup(true);
    reel.play();
    expect(video.play).not.toHaveBeenCalled();
    motion.matches = false;
    page.hidden = true;
    page.dispatchEvent(new Event('visibilitychange'));
    expect(video.play).not.toHaveBeenCalled();
    page.hidden = false;
    page.dispatchEvent(new Event('visibilitychange'));
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('does not play over loading and releases its media on navigation', () => {
    const { reel, root, video, source, page, disconnect } = setup();
    root.dataset.state = 'loading';
    reel.play();
    expect(video.play).not.toHaveBeenCalled();
    reel.dispose();
    root.dataset.state = 'portrait';
    page.dispatchEvent(new Event('visibilitychange'));
    reel.play();
    expect(video.play).not.toHaveBeenCalled();
    expect(video.removeAttribute).toHaveBeenCalledWith('src');
    expect(source.removeAttribute).toHaveBeenCalledWith('src');
    expect(video.load).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
