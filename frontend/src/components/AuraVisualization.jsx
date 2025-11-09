import { useEffect, useRef } from 'react';
import p5 from 'p5';

function AuraVisualization({ sentiment = 0 }) {
  const canvasContainerRef = useRef(null);
  const p5Instance = useRef(null);
  const sentimentRef = useRef(0);

  useEffect(() => {
    sentimentRef.current = sentiment;
  }, [sentiment]);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const sketch = (p) => {
      let particles = [];
      const numParticles = 300; // Reduced for stability
      let time = 0;
      let currentColor = { r: 150, g: 180, b: 255 };

      class Particle {
        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.vx = 0;
          this.vy = 0;
          this.prevX = this.x;
          this.prevY = this.y;
          this.alpha = p.random(100, 200);
        }

        update(noiseScale, noiseStr) {
          // Get flow direction from Perlin noise
          const angle = p.noise(this.x * noiseScale, this.y * noiseScale, time) * p.TWO_PI * noiseStr;
          
          this.vx += p.cos(angle) * 0.3;
          this.vy += p.sin(angle) * 0.3;
          
          // Limit speed
          const speed = p.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 2) {
            this.vx = (this.vx / speed) * 2;
            this.vy = (this.vy / speed) * 2;
          }
          
          this.prevX = this.x;
          this.prevY = this.y;
          this.x += this.vx;
          this.y += this.vy;
          
          // Wrap edges
          if (this.x < 0) { this.x = p.width; this.prevX = this.x; }
          if (this.x > p.width) { this.x = 0; this.prevX = this.x; }
          if (this.y < 0) { this.y = p.height; this.prevY = this.y; }
          if (this.y > p.height) { this.y = 0; this.prevY = this.y; }
        }

        show(strokeW) {
          p.stroke(currentColor.r, currentColor.g, currentColor.b, this.alpha);
          p.strokeWeight(strokeW);
          p.line(this.prevX, this.prevY, this.x, this.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasContainerRef.current);
        
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        const s = sentimentRef.current;

        // Determine visual parameters based on sentiment
        let targetColor, noiseScale, noiseStrength, strokeWeight, bgAlpha;

        if (s > 0.5) {
          // VERY POSITIVE - Bright yellow, smooth large waves, energetic
          targetColor = { r: 255, g: 235, b: 100 };
          noiseScale = 0.0015; // LARGE smooth waves
          noiseStrength = 1.5; // Gentle curves
          strokeWeight = 2.5; // Thick, visible trails
          bgAlpha = 30; // Long trails
        } else if (s > 0.2) {
          // POSITIVE - Orange, flowing, warm
          targetColor = { r: 255, g: 180, b: 80 };
          noiseScale = 0.003;
          noiseStrength = 2;
          strokeWeight = 2;
          bgAlpha = 35;
        } else if (s > -0.2) {
          // NEUTRAL - Purple/cyan, balanced
          targetColor = { r: 160, g: 190, b: 255 };
          noiseScale = 0.005;
          noiseStrength = 3;
          strokeWeight = 1.5;
          bgAlpha = 40;
        } else if (s > -0.5) {
          // NEGATIVE - Blue, turbulent
          targetColor = { r: 100, g: 130, b: 255 };
          noiseScale = 0.008; // Smaller, tighter patterns
          noiseStrength = 5; // More curves
          strokeWeight = 2;
          bgAlpha = 45;
        } else {
          // VERY NEGATIVE - Deep blue, very chaotic, heavy
          targetColor = { r: 60, g: 100, b: 255 };
          noiseScale = 0.012; // SMALL chaotic turbulence
          noiseStrength = 8; // Sharp, jagged turns
          strokeWeight = 3; // Heavy, thick lines
          bgAlpha = 55; // Shorter, choppier trails
        }

        // Smooth interpolation
        currentColor.r += (targetColor.r - currentColor.r) * 0.1;
        currentColor.g += (targetColor.g - currentColor.g) * 0.1;
        currentColor.b += (targetColor.b - currentColor.b) * 0.1;

        // Clear background
        p.background(5, 5, 10, bgAlpha);

        // Update and draw particles
        particles.forEach(part => {
          part.update(noiseScale, noiseStrength);
          part.show(strokeWeight);
        });

        time += 0.005;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5Instance.current = new p5(sketch);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={canvasContainerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

export default AuraVisualization;