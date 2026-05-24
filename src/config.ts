// 🎛️ YOUR MASTER CONTROL PANEL
export const VIDEO_SETTINGS = {
  fps: 30,
  durationPerImage: 90, 
  fadeFrames: 15,       
  zoomEnd: 1.15,        
  panMaxX: 25,          
  panMaxY: 15,          
};

// 📱 SOCIAL MEDIA DIMENSIONS DICTIONARY
export const PLATFORMS = {
  youtube: { width: 1920, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
  instagram: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 }
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
}