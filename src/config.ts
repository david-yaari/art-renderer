// 🎛️ YOUR MASTER CONTROL PANEL
export const VIDEO_SETTINGS = {
  fps: 30,
  durationPerImage: 90, 
  fadeFrames: 15,       
  zoomEnd: 1.15,        
  panMaxX: 60,          
  panMaxY: 35,          
  
  introDuration: 120,    
  outroDuration: 240,    
  audioUrl: "https://res.cloudinary.com/your-cloud/video/upload/v12345/soft-music.mp3", 
  audioVolume: 0.4,     // 🌟 Moved from ArtVideo.tsx

  // 🆕 TEXT VARIABLES
  introTitle: "THE VELÁZQUEZ COLLECTION",
  introSubtitle: "Curated by DY Studios",
  outroTitle: "AVAILABLE NOW",
  outroSubtitle: "Link in bio to acquire this piece"
};

// 🎨 BRANDING & TYPOGRAPHY THEME (4K Optimized)
export const THEME = {
  colors: {
    backgroundCanvas: '#111',
    backgroundScreens: '#000',
    textPrimary: '#ffffff',
    textSecondary: '#666666',
  },
  intro: {
    titleFontSize: 120,      // 🌟 Doubled for 4K
    subtitleFontSize: 40,    // 🌟 Doubled for 4K
    letterSpacing: 8,
    marginTop: 20,
  },
  outro: {
    titleFontSize: 80,       // 🌟 Doubled for 4K
    subtitleFontSize: 36,    // 🌟 Doubled for 4K
    marginTop: 20,
  }
};

// 📐 THE ASPECT RATIO DIMENSIONS DICTIONARY
export const PLATFORMS = {
  landscape: { width: 3840, height: 2160 },      // 16:9 (Replaces youtube/twitter)
  vertical: { width: 2160, height: 3840 },       // 9:16 (Replaces tiktok/reels)
  square: { width: 1080, height: 1080 },         // 1:1 (Replaces instagram/linkedin)
  pinterest_tall: { width: 1000, height: 1500 }  // 2:3 
};

// 🛡️ TYPESCRIPT RULES
export interface ArtVideoProps {
  images: string[];
  platform?: string;
  durationPerImage: number;
  fadeFrames: number;
  zoomEnd: number;
  panMaxX: number;
  panMaxY: number;
  introDuration: number;
  outroDuration: number;
  audioUrl: string;
  audioVolume: number; // 🌟 Added type rule
  introTitle: string;
  introSubtitle: string;
  outroTitle: string;
  outroSubtitle: string;
}