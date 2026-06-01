import { AbsoluteFill, Img, Series, useCurrentFrame, interpolate, Audio, useVideoConfig } from 'remotion';
import React from 'react';
import { ArtVideoProps, THEME } from './config'; 

// 🎬 RESPONSIVE BRANDED INTRO SCREEN
const ArtIntro: React.FC<{ duration: number; fadeFrames: number; title: string; subtitle: string }> = ({ duration, fadeFrames, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig(); // 🌟 Added fluid width discovery

  // Calculate font sizes as percentages so they never break on vertical screens
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

// 🎬 CINEMATIC IMAGE WITH AMBIENT BLUR
const CinematicImage: React.FC<{ src: string; index: number } & ArtVideoProps> = (props) => {
  const frame = useCurrentFrame(); 
  const { width } = useVideoConfig(); 

  const opacity = interpolate(
    frame,
    [0, props.fadeFrames, props.durationPerImage - props.fadeFrames, props.durationPerImage], 
    [0, 1, 1, 0], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(frame, [0, props.durationPerImage], [1, props.zoomEnd]);

  const directionX = props.index % 2 === 0 ? 1 : -1;
  const directionY = props.index % 3 === 0 ? 1 : -1;
  
  // Scale panning speed so it looks consistent across all formats
  const responsivePanX = props.panMaxX * (width / 1920);
  const responsivePanY = props.panMaxY * (width / 1920);

  const translateX = interpolate(frame, [0, props.durationPerImage], [0, responsivePanX * directionX]);
  const translateY = interpolate(frame, [0, props.durationPerImage], [0, responsivePanY * directionY]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      
      {/* 🌫️ 1. AMBIENT BLUR BACKDROP (Automatically fills background layout) */}
      <AbsoluteFill style={{ opacity: opacity * 0.35 }}>
        <Img 
          src={props.src} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Stretches to fill boundaries
            filter: 'blur(50px)', // <--- THE MAGIC BLUR IS HERE
            transform: `scale(${scale * 1.1}) translateX(${translateX}px) translateY(${translateY}px)`,
          }} 
        />
      </AbsoluteFill>

      {/* 🖼️ 2. PRISTINE FOREGROUND ARTWORK */}
      <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6%' }}>
        <Img 
          src={props.src} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // Protects fine art from cropping
            opacity: opacity,
            transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
            boxShadow: '0px 25px 60px rgba(0, 0, 0, 0.7)' // Adds depth
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