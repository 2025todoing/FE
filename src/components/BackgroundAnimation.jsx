import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const BackgroundAnimation = () => {
  const containerRef = useRef(null);
  const sketchRef = useRef(null);

  useEffect(() => {
    // Only create a new p5 instance if one doesn't already exist
    if (containerRef.current && !sketchRef.current) {
      const sketch = (p) => {
        const circles = [];
        const circleCount = 25; // Increased number of circles
        let mousePos = { x: 0, y: 0 };
        let mousePressed = false;
        
        // Vibrant primary-like colors
        const colorPalette = [
          [255, 50, 50],    // Red
          [50, 100, 255],   // Blue
          [255, 220, 0],    // Yellow
          [50, 200, 80],    // Green
          [255, 120, 0],    // Orange
          [180, 50, 230]    // Purple
        ];

        class Circle {
          constructor() {
            this.reset();
          }

          reset() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.size = p.random(40, 180);
            
            // Select a color from our palette
            const selectedColor = colorPalette[Math.floor(p.random(colorPalette.length))];
            this.color = p.color(
              selectedColor[0],
              selectedColor[1],
              selectedColor[2],
              p.random(40, 80) // More translucent
            );
            
            this.speed = {
              x: p.random(-0.8, 0.8),
              y: p.random(-0.8, 0.8)
            };
            this.life = p.random(150, 500);
            this.maxLife = this.life;
            this.opacity = p.random(40, 90);
            this.pulseSpeed = p.random(0.01, 0.03);
            this.pulseAmount = p.random(0.05, 0.2);
            this.pulseOffset = p.random(0, p.TWO_PI);
            this.rotationSpeed = p.random(-0.005, 0.005);
            this.angle = p.random(0, p.TWO_PI);
          }

          update() {
            // Move the circle
            this.x += this.speed.x;
            this.y += this.speed.y;
            
            // Rotate
            this.angle += this.rotationSpeed;

            // Add pulsing effect
            const pulse = 1 + Math.sin(p.frameCount * this.pulseSpeed + this.pulseOffset) * this.pulseAmount;
            this.displaySize = this.size * pulse;

            // Enhanced mouse interaction
            const dx = mousePos.x - this.x;
            const dy = mousePos.y - this.y;
            const distance = p.sqrt(dx * dx + dy * dy);
            
            // Stronger attraction/repulsion based on mouse distance
            if (distance < 300) {
              // If mouse pressed, push circles away
              if (mousePressed) {
                this.x -= dx * 0.05;
                this.y -= dy * 0.05;
                this.speed.x = p.lerp(this.speed.x, -dx * 0.01, 0.1);
                this.speed.y = p.lerp(this.speed.y, -dy * 0.01, 0.1);
              } else {
                // Otherwise gently attract
                this.x += dx * 0.01;
                this.y += dy * 0.01;
              }
            }

            // Decrease life
            this.life -= 1;

            // Reset when life is over or off screen
            if (this.life <= 0 || 
                this.x < -this.size * 2 || 
                this.x > p.width + this.size * 2 ||
                this.y < -this.size * 2 || 
                this.y > p.height + this.size * 2) {
              this.reset();
            }
            
            // Add slight jitter for more dynamic movement
            this.x += p.random(-0.5, 0.5);
            this.y += p.random(-0.5, 0.5);
          }

          display() {
            // Calculate opacity based on life
            let displayOpacity = this.opacity;
            const lifePhase = this.life / this.maxLife;

            // Fade in and out
            if (lifePhase < 0.2 || lifePhase > 0.8) {
              const fadeAmount = lifePhase < 0.2 ? lifePhase / 0.2 : (1 - lifePhase) / 0.2;
              displayOpacity = displayOpacity * fadeAmount;
            }
            
            p.push();
            p.fill(
              p.red(this.color),
              p.green(this.color),
              p.blue(this.color),
              displayOpacity
            );
            p.noStroke();
            
            // Add subtle glow effect
            for (let i = 3; i > 0; i--) {
              p.fill(
                p.red(this.color),
                p.green(this.color),
                p.blue(this.color),
                displayOpacity / (i * 3)
              );
              p.ellipse(this.x, this.y, this.displaySize + i * 10);
            }
            
            // Main circle
            p.fill(
              p.red(this.color),
              p.green(this.color),
              p.blue(this.color),
              displayOpacity
            );
            p.ellipse(this.x, this.y, this.displaySize);
            p.pop();
          }
        }

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          
          // Initialize circles
          for (let i = 0; i < circleCount; i++) {
            circles.push(new Circle());
          }
        };

        p.draw = () => {
          p.clear();
          
          // Update and display all circles
          circles.forEach(circle => {
            circle.update();
            circle.display();
          });
          
          // Randomly spawn new circles occasionally
          if (p.frameCount % 120 === 0) {
            if (circles.length < 35) { // Cap maximum bubbles
              circles.push(new Circle());
            }
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        p.mouseMoved = () => {
          mousePos = { x: p.mouseX, y: p.mouseY };
        };
        
        p.mousePressed = () => {
          mousePressed = true;
          
          // Add a new circle at mouse position on click
          const newCircle = new Circle();
          newCircle.x = p.mouseX;
          newCircle.y = p.mouseY;
          newCircle.size = p.random(80, 150);
          circles.push(newCircle);
        };
        
        p.mouseReleased = () => {
          mousePressed = false;
        };
      };

      // Create new p5 instance
      sketchRef.current = new p5(sketch, containerRef.current);
    }

    // Cleanup
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, []);

  return <CanvasContainer ref={containerRef} />;
};

export default BackgroundAnimation;