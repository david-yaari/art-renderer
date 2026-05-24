import { Composition } from 'remotion';
import { ArtVideo } from './ArtVideo';
// 1. Import your master settings from the new config file!
import { VIDEO_SETTINGS, PLATFORMS } from './config';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ArtAnimation"
      component={ArtVideo as any} 
      fps={VIDEO_SETTINGS.fps}
      width={PLATFORMS.youtube.width}
      height={PLATFORMS.youtube.height}
      durationInFrames={VIDEO_SETTINGS.durationPerImage} 
      calculateMetadata={({ props }) => {
        const imageCount = props.images?.length > 0 ? props.images.length : 1;
        const duration = props.durationPerImage || VIDEO_SETTINGS.durationPerImage;
        const fade = props.fadeFrames || VIDEO_SETTINGS.fadeFrames;
        
        const totalTransitions = imageCount > 1 ? imageCount - 1 : 0;
        const totalDuration = (imageCount * duration) - (totalTransitions * fade);
        
        const targetPlatform = props.platform || 'youtube';
        const { width, height } = PLATFORMS[targetPlatform as keyof typeof PLATFORMS] || PLATFORMS.youtube;

        return {
          durationInFrames: totalDuration,
          width: width,     
          height: height,   
          props,
        };
      }}
      defaultProps={{
        images: [] as string[],
        platform: 'youtube',
        ...VIDEO_SETTINGS 
      }}
    />
  );
};