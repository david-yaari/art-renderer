import { Composition } from 'remotion';
import { ArtVideo } from './ArtVideo';
import { VIDEO_SETTINGS, PLATFORMS } from './config';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ArtAnimation"
      component={ArtVideo as any} 
      fps={VIDEO_SETTINGS.fps}
      // 🌟 Base defaults updated to match your new dictionary
      width={PLATFORMS.vertical.width}
      height={PLATFORMS.vertical.height}
      durationInFrames={900} 
      calculateMetadata={({ props }) => {

        // 🌟 FIX: Automatically unwrap the data if n8n passes an array or an n8n JSON wrapper
        let baseProps = Array.isArray(props) ? props[0] : props;
        if (baseProps && baseProps.json) {
          baseProps = baseProps.json;
        }
        // 1. Safety fallback array check 
        const incomingImages = Array.isArray(props.images) ? props.images : [];
        const imageCount = incomingImages.length > 0 ? incomingImages.length : 1;
        
        // 2. Get durations
        const duration = props.durationPerImage || VIDEO_SETTINGS.durationPerImage;
        const fade = props.fadeFrames !== undefined ? props.fadeFrames : VIDEO_SETTINGS.fadeFrames;
        const intro = props.introDuration || VIDEO_SETTINGS.introDuration;
        const outro = props.outroDuration || VIDEO_SETTINGS.outroDuration;
        
        // 3. Perfect Timeline Math
        const totalOverlaps = imageCount + 1; 
        const totalDuration = Math.ceil(intro + (imageCount * duration) + outro - (totalOverlaps * fade));
        
        // 🌟 4. Dynamic Lookup (Defaults to 'vertical' now!)
        const targetPlatform = props.platform || 'vertical';
        const { width, height } = PLATFORMS[targetPlatform as keyof typeof PLATFORMS] || PLATFORMS.vertical;

        return {
          durationInFrames: totalDuration,
          width: width,     
          height: height,   
          props: {
            ...VIDEO_SETTINGS,
            ...props,
            images: incomingImages
          },
        };
      }}
      defaultProps={{
        images: [] as string[],
        platform: 'vertical', // 🌟 Default prop updated
        ...VIDEO_SETTINGS 
      }}
    />
  );
};