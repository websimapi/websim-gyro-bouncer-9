const GRAVITY = 1200; // pixels/second^2
const BOUNCE_VELOCITY = -600; // pixels/second
const HORIZONTAL_SPEED = 12; // multiplier for tilt
const MAX_HORIZONTAL_SPEED = 400; // pixels/second

export class Player {
    constructor(x, y, image, avatarImage = null) {
        this.width = 50;
        this.height = 50;
        this.x = x - this.width / 2;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.image = image;
        this.avatarImage = avatarImage;
    }

    update(tilt, platforms, canvasWidth, deltaTime) {
        // Horizontal movement
        this.vx = tilt * HORIZONTAL_SPEED;
        this.vx = Math.max(-MAX_HORIZONTAL_SPEED, Math.min(MAX_HORIZONTAL_SPEED, this.vx));
        this.x += this.vx * deltaTime;

        // Apply gravity
        this.vy += GRAVITY * deltaTime;
        this.y += this.vy * deltaTime;

        // Wall collision
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

        // Platform collision (only when falling)
        if (this.vy > 0) {
            for (const platform of platforms) {
                if (
                    this.x < platform.x + platform.width &&
                    this.x + this.width > platform.x &&
                    this.y + this.height > platform.y &&
                    this.y + this.height < platform.y + platform.height
                ) {
                    this.vy = BOUNCE_VELOCITY;
                    break;
                }
            }
        }
    }

    draw(ctx) {
        if (this.avatarImage) {
            ctx.save();
            // Draw avatar clipped to a circle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width * 0.3; // Approx size of head hole

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(this.avatarImage, this.x, this.y, this.width, this.height);
            
            ctx.restore();
        }
        
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}