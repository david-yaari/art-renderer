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

// 📐 THE MASTER RESOLUTION DICTIONARY
export const PLATFORMS = {
  Archive_Original: { width: 3840, height: 2160 },    // Dynamically scales to original Lightroom crop
  CinemaScope_239x1: { width: 3840, height: 1606 },   // Cinematic horizontal scope
  Vertical_Reels_9x16: { width: 2160, height: 3840 },  // 9:16 vertical smartphone 4K
  Portrait_Feed_4x5: { width: 1728, height: 2160 },    // 4:5 Instagram feed space dominator
  Square_Grid_1x1: { width: 1080, height: 1080 },      // 1:1 traditional square grid
  Widescreen_16x9: { width: 3840, height: 2160 }       // 16:9 standard horizontal UHD
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