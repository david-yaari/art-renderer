import { AbsoluteFill, Img, Series, useCurrentFrame, interpolate, Audio, useVideoConfig } from 'remotion';
import React from 'react';
import { ArtVideoProps, THEME } from './config'; 

// 🎬 RESPONSIVE BRANDED INTRO SCREEN
const ArtIntro: React.FC<{ duration: number; fadeFrames: number; title: string; subtitle: string }> = ({ duration, fadeFrames, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig(); 

  const dynamicTitleSize = width * 0.055;
  const dynamicSubtitleSize = width * 0.022;
  const dynamicMargin = width * 0.015;

  const opacity = interpolate(frame, [duration - fadeFrames, duration], [1, 0], { extrapolateLeft: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundScreens, justifyContent: 'center', alignItems: 'center', opacity }}>
      <h1 style={{ color: THEME.colors.textPrimary, fontFamily: 'sans-serif', fontSize: dynamicTitleSize, letterSpacing: THEME.intro.letterSpacing, textAlign: 'center', width: '85%', lineHeight: 1.2 }}>
        {title}
      </h1>
      <p style={{ color: THEME.colors.textSecondary, fontFamily: 'sans-serif', fontSize: dynamicSubtitleSize, marginTop: dynamicMargin, textAlign: 'center', width: '85%' }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};

// 🎬 RESPONSIVE BRANDED OUTRO SCREEN
const ArtOutro: React.FC<{ duration: number; fadeFrames: number; title: string; subtitle: string }> = ({ duration, fadeFrames, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig(); 

  const dynamicTitleSize = width * 0.045;
  const dynamicSubtitleSize = width * 0.022;
  const dynamicMargin = width * 0.015;

  const opacity = interpolate(frame, [0, fadeFrames], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundScreens, justifyContent: 'center', alignItems: 'center', opacity }}>
      <h1 style={{ color: THEME.colors.textPrimary, fontFamily: 'sans-serif', fontSize: dynamicTitleSize, textAlign: 'center', width: '85%', lineHeight: 1.2 }}>
        {title}
      </h1>
      <p style={{ color: THEME.colors.textSecondary, fontFamily: 'sans-serif', fontSize: dynamicSubtitleSize, marginTop: dynamicMargin, textAlign: 'center', width: '85%' }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};

// 🎬 CINEMATIC IMAGE WITH LOCKSTEP CAMERA TRACKING
const CinematicImage: React.FC<{ src: string; index: number } & ArtVideoProps> = (props) => {
  const frame = useCurrentFrame(); 
  const { width } = useVideoConfig(); 

  // Smooth fade-in and fade-out envelope
  const opacity = interpolate(
    frame,
    [0, props.fadeFrames, props.durationPerImage - props.fadeFrames, props.durationPerImage], 
    [0, 1, 1, 0], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Unified camera calculations
  const scale = interpolate(frame, [0, props.durationPerImage], [1, props.zoomEnd]);

  const directionX = props.index % 2 === 0 ? 1 : -1;
  const directionY = props.index % 3 === 0 ? 1 : -1;
  
  const responsivePanX = props.panMaxX * (width / 1920);
  const responsivePanY = props.panMaxY * (width / 1920);

  const translateX = interpolate(frame, [0, props.durationPerImage], [0, responsivePanX * directionX]);
  const translateY = interpolate(frame, [0, props.durationPerImage], [0, responsivePanY * directionY]);

  // 🌟 Master transform matrix applied identically to both layers
  const sharedCameraTransform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* 🌫️ 1. AMBIENT BLUR BACKDROP */}
      <div
        style={{
          position: 'absolute',
          inset: -40, // 🌟 Bleeds past edges to prevent white frame lines during heavy pans
          backgroundImage: `url(${props.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.5)',
          opacity: opacity * 0.4,
          transform: `scale(1.1) ${sharedCameraTransform}`, // Extra native scale buffer for the blur bleed
        }}
      />

      {/* 🖼️ 2. PRISTINE FOREGROUND ARTWORK */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8%',
          opacity: opacity,
          transform: sharedCameraTransform, // 🌟 Locked onto the identical camera track
        }}
      >
        <Img 
          src={props.src} 
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain', 
            boxShadow: '0px 30px 70px rgba(0, 0, 0, 0.65)',
            borderRadius: '4px'
          }} 
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export const ArtVideo = (props: ArtVideoProps) => {
  if (!props.images || props.images.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundCanvas }}>
      
      {/* 1. BACKGROUND MUSIC */}
      {props.audioUrl && (
        <Audio 
          src={props.audioUrl} 
          volume={props.audioVolume} 
        />
      )}

      <Series>
        {/* 2. THE INTRO */}
        <Series.Sequence durationInFrames={props.introDuration}>
          <ArtIntro 
            duration={props.introDuration} 
            fadeFrames={props.fadeFrames} 
            title={props.introTitle} 
            subtitle={props.introSubtitle} 
          />
        </Series.Sequence>

        {/* 3. THE ARTWORK COMPILATION */}
        {props.images.map((img, index) => (
          <Series.Sequence 
            key={index} 
            durationInFrames={props.durationPerImage}
            offset={-props.fadeFrames}
          >
            <CinematicImage src={img} index={index} {...props} />
          </Series.Sequence>
        ))}

        {/* 4. THE OUTRO */}
        <Series.Sequence durationInFrames={props.outroDuration} offset={-props.fadeFrames}>
          <ArtOutro 
            duration={props.outroDuration} 
            fadeFrames={props.fadeFrames} 
            title={props.outroTitle} 
            subtitle={props.outroSubtitle} 
          />
        </Series.Sequence>
      </Series>
      
    </AbsoluteFill>
  );
};