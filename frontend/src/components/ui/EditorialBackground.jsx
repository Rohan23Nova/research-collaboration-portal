import React from 'react';

// Architectural photography (strictly monochrome)
import archHaveli from '../../assets/architecture/Queen\'s_haveli_-_Much_kund_-_20210827_174408_HDR.jpg';
import archKhushal from '../../assets/architecture/khushal-chhabra-YXqMsLbKTIE-unsplash.jpg';
import archLightcam from '../../assets/architecture/lightcamact-photography--ORVxivcks4-unsplash.jpg';
import archMilin from '../../assets/architecture/milin-john-4VGA0s1Icfs-unsplash.jpg';
import archHarsh from '../../assets/architecture/pexels-harsh-kukadiya-244412142-37415415.jpg';
import archPeter from '../../assets/architecture/pexels-peter-parker-172082580-35545379.jpg';

// Approved decorative pattern family (ONLY 2746540.svg and mandala-svgrepo-com.svg):
import patMandala1 from '../../assets/patterns/2746540.svg';
import patMandala2 from '../../assets/patterns/mandala-svgrepo-com.svg';

export default function EditorialBackground({ variant = 'dashboard' }) {
  // Layer 1: Architecture (monochrome, multiply in light mode; screened in dark mode with warm charcoal paper tone)
  const baseImg = "absolute object-cover pointer-events-none mix-blend-multiply dark:mix-blend-screen z-[1] hidden md:block select-none dark:brightness-[0.55] dark:contrast-[115%]";

  // Layer 2: Geometric Pattern Overlays
  // Dominant corner mandala (light: 0.65; dark: 0.42 within 0.35-0.48 range)
  const baseMandalaDominant = "absolute pointer-events-none z-[2] select-none max-w-none w-[620px] h-[620px] lg:w-[720px] lg:h-[720px] opacity-[0.65] dark:opacity-[0.42]";
  // Secondary subtle mandala (light: 0.30; dark: 0.12 within 0.08-0.14 range)
  const baseMandalaSecondary = "absolute pointer-events-none z-[2] select-none max-w-none w-[420px] h-[420px] lg:w-[480px] lg:h-[480px] opacity-[0.30] dark:opacity-[0.12]";

  // Strict filters:
  // Photos: 100% Grayscale, contrast 95-100%, NO color leakage
  const monoPhotoFilter = "grayscale(100%) contrast(96%)";
  const haveliPhotoFilter = "grayscale(100%) contrast(94%) brightness(98%)";

  // Terracotta (#C96F3D) filter from pure black (#000000) vector SVG
  const mandalaTerracotta = "brightness(0) saturate(100%) invert(51%) sepia(47%) saturate(1487%) hue-rotate(343deg) brightness(88%) contrast(87%)";

  // Unified broad feathered transition derived from the successful My Requests treatment:
  // Dissolves seamlessly from right to left with a wide decay zone ending at pure alpha 0 (no hard vertical edges anywhere).
  const featheredMask = {
    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.68) 42%, rgba(0,0,0,0.30) 70%, rgba(0,0,0,0.06) 88%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.68) 42%, rgba(0,0,0,0.30) 70%, rgba(0,0,0,0.06) 88%, rgba(0,0,0,0) 100%)'
  };

  switch (variant) {
    case 'dashboard':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Harsh Architectural Photo (Reaches title margin, fades into parchment across center) */}
          <img 
            src={archHarsh} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[55vw] lg:w-[60vw] min-w-[580px] max-w-[960px] h-screen opacity-[0.50] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from TOP-RIGHT corner (heavily cropped quadrant, sitting over architecture) */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaDominant} -top-[240px] -right-[240px] lg:-top-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from BOTTOM-LEFT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaSecondary} -bottom-[200px] -left-[200px] lg:-bottom-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'projects':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Harsh Architectural Texture (Unified full-height feathered background) */}
          <img 
            src={archHarsh} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[54vw] lg:w-[58vw] min-w-[540px] max-w-[920px] h-screen opacity-[0.50] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from BOTTOM-RIGHT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaDominant} -bottom-[240px] -right-[240px] lg:-bottom-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from TOP-LEFT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaSecondary} -top-[200px] -left-[200px] lg:-top-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );
      
    case 'my-requests':
    case 'requests':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Khushal Architectural Photo (The visual reference standard) */}
          <img 
            src={archKhushal} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[52vw] lg:w-[56vw] min-w-[520px] max-w-[900px] h-screen opacity-[0.52] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from BOTTOM-LEFT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaDominant} -bottom-[240px] -left-[240px] lg:-bottom-[280px] lg:-left-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from TOP-RIGHT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaSecondary} -top-[200px] -right-[200px] lg:-top-[240px] lg:-right-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'review-requests':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Khushal Architectural Photo */}
          <img 
            src={archKhushal} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[52vw] lg:w-[56vw] min-w-[520px] max-w-[900px] h-screen opacity-[0.52] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from BOTTOM-RIGHT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaDominant} -bottom-[240px] -right-[240px] lg:-bottom-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from TOP-LEFT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaSecondary} -top-[200px] -left-[200px] lg:-top-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'workspace':
    case 'details':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Queen's Haveli (STRICTLY GRAYSCALE, NO COLOR LEAKAGE) */}
          <img 
            src={archHaveli} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[54vw] lg:w-[58vw] min-w-[540px] max-w-[920px] h-screen opacity-[0.50] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: haveliPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from TOP-RIGHT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaDominant} -top-[240px] -right-[240px] lg:-top-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from BOTTOM-LEFT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaSecondary} -bottom-[200px] -left-[200px] lg:-bottom-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'profile':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Milin Architectural Arch (Feathered transition into parchment) */}
          <img 
            src={archMilin} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[54vw] lg:w-[58vw] min-w-[520px] max-w-[900px] h-screen opacity-[0.48] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from TOP-LEFT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaDominant} -top-[240px] -left-[240px] lg:-top-[280px] lg:-left-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from BOTTOM-RIGHT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaSecondary} -bottom-[200px] -right-[200px] lg:-bottom-[240px] lg:-right-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'documents':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Peter Stepwell Architecture */}
          <img 
            src={archPeter} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[52vw] lg:w-[56vw] min-w-[520px] max-w-[900px] h-screen opacity-[0.48] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from BOTTOM-RIGHT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaDominant} -bottom-[240px] -right-[240px] lg:-bottom-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from TOP-LEFT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaSecondary} -top-[200px] -left-[200px] lg:-top-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'admin':
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* LAYER 1: Lightcam Architecture */}
          <img 
            src={archLightcam} 
            alt="" 
            className={`${baseImg} top-0 right-0 w-[52vw] lg:w-[56vw] min-w-[500px] max-w-[880px] h-screen opacity-[0.48] dark:opacity-[0.24]`}
            style={{ ...featheredMask, filter: monoPhotoFilter }}
          />

          {/* LAYER 2: Dominant Mandala entering from TOP-RIGHT corner */}
          <img 
            src={patMandala1} 
            alt="" 
            className={`${baseMandalaDominant} -top-[240px] -right-[240px] lg:-top-[280px] lg:-right-[280px]`}
            style={{ filter: mandalaTerracotta }}
          />

          {/* Secondary subtle mandala entering from BOTTOM-LEFT corner */}
          <img 
            src={patMandala2} 
            alt="" 
            className={`${baseMandalaSecondary} -bottom-[200px] -left-[200px] lg:-bottom-[240px] lg:-left-[240px]`}
            style={{ filter: mandalaTerracotta }}
          />
        </div>
      );

    case 'auth':
      return null;

    default:
      return null;
  }
}
