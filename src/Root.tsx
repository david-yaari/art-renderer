import { Composition } from 'remotion';
import { ArtVideo } from './ArtVideo';
import { VIDEO_SETTINGS, PLATFORMS } from './config';

// 🌟 Native Binary Header Parser (Safe for both Node and Browser)
const fetchImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
  try {
    const res = await globalThis.fetch(url, { headers: { Range: 'bytes=0-40000' } });
    const buf = await res.arrayBuffer();
    const view = new DataView(buf);
    
    if (view.getUint32(0) === 0x89504E47) {
      return { width: view.getUint32(16), height: view.getUint32(20) };
    }
    
    if (view.getUint16(0) === 0xFFD8) {
      let i = 2;
      while (i < view.byteLength - 8) {
        const marker = view.getUint16(i);
        if (marker >= 0xFFC0 && marker <= 0xFFC3) {
          return {
            height: view.getUint16(i + 5),
            width: view.getUint16(i + 7)
          };
        }
        i += 2 + view.getUint16(i + 2);
      }
    }
  } catch (e) {
    (globalThis as any).console?.warn("[Header Reader Error] Could not read binary metadata stream:", e);
  }
  return { width: 3840, height: 2160 }; 
};

// 🌟 THE CRITICAL EXPORT MATCHING INDEX.TS
export const RemotionRoot = () => {
  return (
    <Composition
      id="ArtAnimation"
      component={ArtVideo as any} 
      fps={VIDEO_SETTINGS.fps}
      width={PLATFORMS.Vertical_Reels_9x16.width}
      height={PLATFORMS.Vertical_Reels_9x16.height}
      durationInFrames={900} 
      
      calculateMetadata={async ({ props }) => {
        const rawProps = props as any;
        let baseProps = Array.isArray(rawProps) ? rawProps[0] : rawProps;
        if (baseProps && baseProps.json) {
          baseProps = baseProps.json;
        }

        const incomingImages = baseProps && Array.isArray(baseProps.images) ? baseProps.images : [];
        const imageCount = incomingImages.length > 0 ? incomingImages.length : 1;
        
        const duration = baseProps?.durationPerImage || VIDEO_SETTINGS.durationPerImage;
        const fade = baseProps?.fadeFrames !== undefined ? baseProps.fadeFrames : VIDEO_SETTINGS.fadeFrames;
        const intro = baseProps?.introDuration || VIDEO_SETTINGS.introDuration;
        const outro = baseProps?.outroDuration || VIDEO_SETTINGS.outroDuration;
        
        const totalOverlaps = imageCount + 1; 
        const totalDuration = Math.ceil(intro + (imageCount * duration) + outro - (totalOverlaps * fade));
        
        const targetPlatform = baseProps?.platform || baseProps?.variant || 'Vertical_Reels_9x16';
        
        let width = 2160;
        let height = 3840; 

        // 🌟 IDENTIFY EXCLUSIVELY BY THE NEW ANCHOR TAG
        if (targetPlatform === 'Archive_Original' && incomingImages.length > 0) {
          const dimensions = await fetchImageDimensions(incomingImages[0]);
          const cropRatio = dimensions.width / dimensions.height;
          
          height = 2160; 
          width = Math.round(2160 * cropRatio);
          
          if (width % 2 !== 0) width += 1; 
        } else {
          const chosenResolution = PLATFORMS[targetPlatform as keyof typeof PLATFORMS] || PLATFORMS.Vertical_Reels_9x16;
          width = chosenResolution.width;
          height = chosenResolution.height;
        }

        return {
          durationInFrames: totalDuration,
          width,     
          height,   
          props: {
            ...VIDEO_SETTINGS,
            ...baseProps, 
            images: incomingImages
          },
        };
      }}
      defaultProps={{
        images: [] as string[],
        platform: 'Vertical_Reels_9x16',
        ...VIDEO_SETTINGS 
      }}
    />
  );
};