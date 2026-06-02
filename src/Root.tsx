import { Composition } from 'remotion';
import { ArtVideo } from './ArtVideo';
import { VIDEO_SETTINGS, PLATFORMS } from './config';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ArtAnimation"
      component={ArtVideo as any} 
      fps={VIDEO_SETTINGS.fps}
      // 🌟 Base vertical defaults preserved
      width={PLATFORMS.vertical.width}
      height={PLATFORMS.vertical.height}
      durationInFrames={900} 
      calculateMetadata={({ props }) => {
        
        // 🌟 FIX 1: Cast to 'any' to completely bypass strict TypeScript compilation blocks
        const rawProps = props as any;

        // 🌟 FIX 2: Safely unwrap n8n's outer array structure at runtime
        let baseProps = Array.isArray(rawProps) ? rawProps[0] : rawProps;
        if (baseProps && baseProps.json) {
          baseProps = baseProps.json;
        }

        // Extract the images sequence safely
        const incomingImages = baseProps && Array.isArray(baseProps.images) ? baseProps.images : [];
        const imageCount = incomingImages.length > 0 ? incomingImages.length : 1;
        
        // Your Exact Timeline configurations with robust fallbacks
        const duration = baseProps?.durationPerImage || VIDEO_SETTINGS.durationPerImage;
        const fade = baseProps?.fadeFrames !== undefined ? baseProps.fadeFrames : VIDEO_SETTINGS.fadeFrames;
        const intro = baseProps?.introDuration || VIDEO_SETTINGS.introDuration;
        const outro = baseProps?.outroDuration || VIDEO_SETTINGS.outroDuration;
        
        // Your Exact Timeline Math
        const totalOverlaps = imageCount + 1; 
        const totalDuration = Math.ceil(intro + (imageCount * duration) + outro - (totalOverlaps * fade));
        
        // Your Exact Dynamic Platform Lookup
        const targetPlatform = baseProps?.platform || 'vertical';
        const { width, height } = PLATFORMS[targetPlatform as keyof typeof PLATFORMS] || PLATFORMS.vertical;

        return {
          durationInFrames: totalDuration,
          width: width,     
          height: height,   
          props: {
            ...VIDEO_SETTINGS,
            ...baseProps, // Pipes clean, flat properties directly down to ArtVideo components
            images: incomingImages
          },
        };
      }}
      defaultProps={{
        images: [] as string[],
        platform: 'vertical',
        ...VIDEO_SETTINGS 
      }}
    />
  );
};