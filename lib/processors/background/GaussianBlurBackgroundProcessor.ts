import { BackgroundProcessor, BackgroundProcessorOptions } from './BackgroundProcessor';
import { BLUR_FILTER_RADIUS } from '../../constants';

/**
 * Options passed to [[GaussianBlurBackgroundProcessor]] constructor.
 */
export interface GaussianBlurBackgroundProcessorOptions extends BackgroundProcessorOptions {
  /**
   * The background blur filter radius to use in pixels.
   * @default
   * ```html
   * 15
   * ```
   */
  blurFilterRadius?: number;
}

/**
 * The GaussianBlurBackgroundProcessor, when added to a VideoTrack,
 * applies a gaussian blur filter on the background in each video frame
 * and leaves the foreground (person(s)) untouched. Each instance of
 * GaussianBlurBackgroundProcessor should be added to only one VideoTrack
 * at a time to prevent overlapping of image data from multiple VideoTracks.
 *
 * @example
 *
 * ```ts
 * import { createLocalVideoTrack } from 'twilio-video';
 * import { GaussianBlurBackgroundProcessor } from '@twilio/video-processors';
 *
 * const blurBackground = new GaussianBlurBackgroundProcessor({
 *   assetsPath: 'https://my-server-path/assets'
 * });
 *
 * blurBackground.loadModel().then(() => {
 *   createLocalVideoTrack({
 *     width: 640,
 *     height: 480,
 *     frameRate: 24
 *   }).then(track => {
 *     track.addProcessor(blurBackground);
 *   });
 * });
 * ```
 */
export class GaussianBlurBackgroundProcessor extends BackgroundProcessor {

  private _blurFilterRadius: number = BLUR_FILTER_RADIUS;
  // tslint:disable-next-line no-unused-variable
  private readonly _name: string = 'GaussianBlurBackgroundProcessor';

  /**
   * Construct a GaussianBlurBackgroundProcessor. Default values will be used for
   * any missing properties in [[GaussianBlurBackgroundProcessorOptions]], and
   * invalid properties will be ignored.
   */
  constructor(options: GaussianBlurBackgroundProcessorOptions) {
    super(options);
    this.blurFilterRadius = options.blurFilterRadius!;
  }

  /**
   * The current background blur filter radius in pixels.
   */
  get blurFilterRadius(): number {
    return this._blurFilterRadius;
  }

  /**
   * Set a new background blur filter radius in pixels.
   */
  set blurFilterRadius(radius: number) {
    if (!radius) {
      console.warn(`Valid blur filter radius not found. Using ${BLUR_FILTER_RADIUS} as default.`);
      radius = BLUR_FILTER_RADIUS;
    }
    this._blurFilterRadius = radius;
  }

  protected _setBackground(inputFrame: OffscreenCanvas): void {
    this._outputContext.filter = `blur(${this._blurFilterRadius}px)`;
    this._outputContext.drawImage(inputFrame, 0, 0);
  }
}
