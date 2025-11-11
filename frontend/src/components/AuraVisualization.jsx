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
      let flowfield = [];
      let cols, rows;
      const numParticles = 2500;
      let time = 0;
      let currentColor = { r: 140, g: 140, b: 160 };

      class Particle {
        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.vx = 0;
          this.vy = 0;
          this.px = this.x;
          this.py = this.y;
          this.a = p.random(100, 200);
        }

        update() {
          this.vx *= 0.97;
          this.vy *= 0.97;
          
          this.px = this.x;
          this.py = this.y;
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < 0) { this.x = p.width; this.px = this.x; }
          else if (this.x > p.width) { this.x = 0; this.px = this.x; }
          if (this.y < 0) { this.y = p.height; this.py = this.y; }
          else if (this.y > p.height) { this.y = 0; this.py = this.y; }
        }

        follow(field, columns) {
          const x = p.floor(this.x / 20);
          const y = p.floor(this.y / 20);
          const index = x + y * columns;
          const force = field[index];
          if (force) {
            this.vx += force.x;
            this.vy += force.y;
          }
        }

        addCircularForce(centerX, centerY, strength) {
          // Calculate vector to center
          const dx = centerX - this.x;
          const dy = centerY - this.y;
          
          // Create tangent force (perpendicular) for circular motion
          const tangentX = -dy;
          const tangentY = dx;
          
          // Normalize and apply
          const mag = p.sqrt(tangentX * tangentX + tangentY * tangentY);
          if (mag > 0) {
            this.vx += (tangentX / mag) * strength;
            this.vy += (tangentY / mag) * strength;
          }
          
          // Add slight inward pull to maintain orbit
          const dist = p.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            this.vx += (dx / dist) * strength * 0.15;
            this.vy += (dy / dist) * strength * 0.15;
          }
        }

        show(strokeW) {
          p.stroke(currentColor.r, currentColor.g, currentColor.b, this.a);
          p.strokeWeight(strokeW);
          p.line(this.px, this.py, this.x, this.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasContainerRef.current);
        
        cols = p.floor(p.width / 20);
        rows = p.floor(p.height / 20);
        flowfield = new Array(cols * rows);
        
        for (let i = 0; i < numParticles; i++) {
          particles[i] = new Particle();
        }
      };

      p.draw = () => {
        const s = sentimentRef.current;
        const centerX = p.width / 2;
        const centerY = p.height / 2;

        let targetColor, noiseScale, noiseStrength, strokeWeight, bgAlpha, circularStrength;

        if (s > 0.5) {
          // VERY POSITIVE - Bright yellow, STRONG CIRCULAR MOTION
          targetColor = { r: 255, g: 210, b: 80 };
          noiseScale = 0.003;
          noiseStrength = 1;
          strokeWeight = 2;
          bgAlpha = 40;
          circularStrength = 0.25; // STRONG orbital force
        } else if (s > 0.2) {
          // POSITIVE - Orange, MODERATE CIRCULAR MOTION
          targetColor = { r: 250, g: 150, b: 70 };
          noiseScale = 0.004;
          noiseStrength = 2;
          strokeWeight = 1.8;
          bgAlpha = 45;
          circularStrength = 0.15; // Medium orbital force
        } else if (s > -0.2) {
          // NEUTRAL - Purple, pure Perlin flow (no circular)
          targetColor = { r: 140, g: 140, b: 160 };
          noiseScale = 0.005;
          noiseStrength = 3;
          strokeWeight = 1.5;
          bgAlpha = 50;
          circularStrength = 0; // No orbital force
        } else if (s > -0.5) {
          // NEGATIVE - Blue, chaotic Perlin
          targetColor = { r: 100, g: 120, b: 200 };
          noiseScale = 0.008;
          noiseStrength = 5;
          strokeWeight = 1.8;
          bgAlpha = 55;
          circularStrength = 0;
        } else {
          // VERY NEGATIVE - Deep blue, very chaotic
          targetColor = { r: 70, g: 100, b: 180 };
          noiseScale = 0.012;
          noiseStrength = 7;
          strokeWeight = 2;
          bgAlpha = 60;
          circularStrength = 0;
        }

        currentColor.r += (targetColor.r - currentColor.r) * 0.1;
        currentColor.g += (targetColor.g - currentColor.g) * 0.1;
        currentColor.b += (targetColor.b - currentColor.b) * 0.1;

        p.background(244, 243, 243, bgAlpha);

        // Generate Perlin noise flow field
        let yoff = 0;
        for (let y = 0; y < rows; y++) {
          let xoff = 0;
          for (let x = 0; x < cols; x++) {
            const index = x + y * cols;
            const angle = p.noise(xoff, yoff, time) * p.TWO_PI * noiseStrength;
            const vx = p.cos(angle) * 0.5;
            const vy = p.sin(angle) * 0.5;
            flowfield[index] = { x: vx, y: vy };
            xoff += noiseScale;
          }
          yoff += noiseScale;
        }

        // Update and render particles
        for (let i = 0; i < numParticles; i++) {
          const part = particles[i];
          
          // Follow Perlin flow field
          part.follow(flowfield, cols);
          
          // Add circular/orbital force when happy!
          if (circularStrength > 0) {
            part.addCircularForce(centerX, centerY, circularStrength);
          }
          
          part.update();
          part.show(strokeWeight);
        }

        time += 0.005;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        cols = p.floor(p.width / 20);
        rows = p.floor(p.height / 20);
        flowfield = new Array(cols * rows);
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