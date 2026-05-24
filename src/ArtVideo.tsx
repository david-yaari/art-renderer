import { AbsoluteFill, Img, Series, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';
import { ArtVideoProps } from './config';

const CinematicImage: React.FC<{ src: string; index: number } & ArtVideoProps> = (props) => {
  const frame = useCurrentFrame(); 

  // True crossfade (Fades in at the start, fades out at the end)
  const opacity = interpolate(
    frame,
    [
      0, 
      props.fadeFrames,                                   
      props.durationPerImage - props.fadeFrames,          
      props.durationPerImage                              
    ], 
    [0, 1, 1, 0], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(frame, [0, props.durationPerImage], [1, props.zoomEnd]);

  const directionX = props.index % 2 === 0 ? 1 : -1;
  const directionY = props.index % 3 === 0 ? 1 : -1;
  
  const translateX = interpolate(frame, [0, props.durationPerImage], [0, props.panMaxX * directionX]);
  const translateY = interpolate(frame, [0, props.durationPerImage], [0, props.panMaxY * directionY]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Img 
        src={props.src} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', 
          opacity: opacity,
          transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
        }} 
      />
    </AbsoluteFill>
  );
};

export const ArtVideo = (props: ArtVideoProps) => {
  if (!props.images || props.images.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      <Series>
        {props.images.map((img, index) => {
          // 1. THE NATIVE OVERLAP: 
          // Image 0 has no offset. Every image after that shifts left by the fadeFrames!
          const offset = index === 0 ? 0 : -props.fadeFrames;

          return (
            <Series.Sequence 
              key={index} 
              durationInFrames={props.durationPerImage}
              offset={offset}
            >
              <CinematicImage src={img} index={index} {...props} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};