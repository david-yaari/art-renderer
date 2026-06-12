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

// 🎬 CINEMATIC IMAGE GENERATOR WITH DYNAMIC MOTION
const CinematicImage: React.FC<{ src: string; index: number } & ArtVideoProps> = (props) => {
  const frame = useCurrentFrame(); 
  const { width } = useVideoConfig(); 

  // 🌟 DYNAMIC MOTION CALCULATOR
  const isOverview = props.index === 0;
  
  const activeZoomEnd = isOverview ? 1.03 : (props.zoomEnd || 1.15);
  const activePanMaxX = isOverview ? props.panMaxX * 0.3 : props.panMaxX;
  const activePanMaxY = isOverview ? props.panMaxY * 0.3 : props.panMaxY;

  // Smooth fade-in and fade-out envelope
  const opacity = interpolate(
    frame,
    [0, props.fadeFrames, props.durationPerImage - props.fadeFrames, props.durationPerImage], 
    [0, 1, 1, 0], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Unified responsive camera calculations mapped to our type-dependent boundaries
  const scale = interpolate(frame, [0, props.durationPerImage], [1, activeZoomEnd]);

  const directionX = props.index % 2 === 0 ? 1 : -1;
  const directionY = props.index % 3 === 0 ? 1 : -1;
  
  const responsivePanX = activePanMaxX * (width / 1920);
  const responsivePanY = activePanMaxY * (width / 1920);

  const translateX = interpolate(frame, [0, props.durationPerImage], [0, responsivePanX * directionX]);
  const translateY = interpolate(frame, [0, props.durationPerImage], [0, responsivePanY * directionY]);

  // Unified camera matrix
  const sharedCameraTransform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* 🌫️ 1. DEFENSIVE BACKDROP LAYER (Fills the background edges beautifully if contain leaves gaps) */}
      <div
        style={{
          position: 'absolute',
          inset: -40, 
          backgroundImage: `url(${props.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.5)',
          opacity: opacity * 0.6, // Slightly elevated visibility for non-cropped frame boundaries
          transform: `scale(1.1) ${sharedCameraTransform}`, 
        }}
      />

      {/* 🖼️ 2. DYNAMIC COMPOSITION LAYER */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0%', 
          opacity: opacity,
          transform: sharedCameraTransform, 
        }}
      >
        <Img 
          src={props.src} 
          style={{
            width: '100%',      
            height: '100%',     
            objectFit: isOverview ? 'contain' : 'cover',  // 🌟 Changed to contain for index 0 to guarantee non-cropped full artwork overview
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
