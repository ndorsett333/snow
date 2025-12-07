// snow logic
class SnowParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 0.5 + 0.2;
        this.element = this.createElement();
        this.settled = false;
    }
    
    createElement() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = 'white';
        particle.style.pointerEvents = 'none';
        particle.style.left = this.x + 'px';
        particle.style.top = this.y + 'px';
        particle.style.zIndex = '1000';
        return particle;
    }
    
    update() {
        if (this.settled) return;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // floaty
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += Math.random() * 0.01;
        this.vx = Math.max(-1, Math.min(1, this.vx));
        
        // bounds
        if (this.x < 5) this.x = 5;
        if (this.x >= 495) this.x = 494;
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
    
    settle(y) {
        this.y = y;
        this.settled = true;
        this.vx = 0;
        this.vy = 0;
        this.element.style.top = this.y + 'px';
    }
}

class SnowSystem {
    constructor() {
        this.particles = [];
        this.isMouseDown = false;
        this.animationId = null;
        this.screen = document.getElementById('snow-screen');
        this.currentMouseX = 0;
        this.currentMouseY = 0;
        this.groundLevel = 490;
        this.heightMap = new Array(500).fill(this.groundLevel);
        this.setupEventListeners();
        this.animate();
    }
    
    setupEventListeners() {
        this.screen.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            const rect = this.screen.getBoundingClientRect();
            this.currentMouseX = e.clientX - rect.left;
            this.currentMouseY = e.clientY - rect.top;
            this.startSnowGeneration();
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        this.screen.addEventListener('mousemove', (e) => {
            const rect = this.screen.getBoundingClientRect();
            this.currentMouseX = e.clientX - rect.left;
            this.currentMouseY = e.clientY - rect.top;
        });
    }
    
    startSnowGeneration() {
        const generateSnow = () => {
            if (this.isMouseDown) {
                for (let i = 0; i < 5; i++) { 
                    const particle = new SnowParticle(
                        this.currentMouseX + (Math.random() - 0.5) * 8,
                        this.currentMouseY + (Math.random() - 0.5) * 8
                    );
                    this.screen.appendChild(particle.element);
                    this.particles.push(particle);
                }
                setTimeout(generateSnow, 20);
            }
        };
        generateSnow();
    }
    
    checkCollision(particle) {
        if (particle.settled) return;
        
        const x = Math.floor(particle.x);
        const currentHeight = this.heightMap[x] || this.groundLevel;
        
        
        if (particle.y >= currentHeight) {
            const newHeight = currentHeight - 1; // Stack on top
            particle.settle(newHeight);
            
            
            this.heightMap[x] = newHeight;
            
            // more natural stacking
            if (x > 0) this.heightMap[x - 1] = Math.min(this.heightMap[x - 1], newHeight + 1);
            if (x < 499) this.heightMap[x + 1] = Math.min(this.heightMap[x + 1], newHeight + 1);
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.update();
            this.checkCollision(particle);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// init
document.addEventListener('DOMContentLoaded', function() {
    console.log('Snow Project loaded successfully!');
    new SnowSystem();
});