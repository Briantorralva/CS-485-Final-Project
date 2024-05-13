
class Sprite {
    constructor(sprite_json, x, y, start_state) {
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";
        this.cur_frame = 0;
        this.x_v = Math.random() * 8 - 4;
        this.y_v = Math.random() * 8 - 4;
        this.frameRate = 100; // milliseconds per frame
        this.lastFrameTime = 0; 
    }
    

    draw() {
        var ctx = canvas.getContext('2d');
        var frame_data = this.sprite_json[this.root_e][this.state][this.cur_frame];
        
        // draw the sprite
        if (!frame_data['img']) {
            frame_data['img'] = new Image();
            frame_data['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }
        
        ctx.drawImage(frame_data['img'], this.x, this.y);
        
   
        let currentTime = Date.now();
        if (currentTime - this.lastFrameTime > this.frameRate) {
            this.cur_frame = (this.cur_frame + 1) % this.sprite_json[this.root_e][this.state].length;
            this.lastFrameTime = currentTime;
        }
    
        // check if this sprite is close to any other sprite
        let showHoveringImage = false;
        sprites_to_draw[1].forEach(sprite => {
            if (sprite !== this) {
                let distance = Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2);
                if (distance < 100) { 
                    showHoveringImage = true;
                }
            }
        });
    
        // draw the hovering image only if showHoveringImage is true
        if (showHoveringImage) {
            let hoveringImage = new Image();
            hoveringImage.src = 'imgs/MOVE1.png';
            hoveringImage.onload = () => {
                // resize the hovering image to make it smaller
                let scaleFactor = 0.3; 
                let resizedWidth = hoveringImage.width * scaleFactor;
                let resizedHeight = hoveringImage.height * scaleFactor;
    
                ctx.drawImage(hoveringImage, this.x, this.y - resizedHeight, resizedWidth, resizedHeight); 
            };
        }
    
        this.updatePosition();
    }
    
    
    
    

    updatePosition() {
        // update position
        this.x += this.x_v;
        this.y += this.y_v;
    
        // check boundaries and bounce
        if (this.x <= 0 || this.x >= canvas.width - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) {
            this.x_v *= -1; // reverse horizontal velocity to bounce
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']));
        }
    
        if (this.y <= 0 || this.y >= canvas.height - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) {
            this.y_v *= -1; // reverse vertical velocity to bounce
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']));
        }
    
        // updates animation state based on direction of movement
        if (this.x_v != 0 || this.y_v != 0) {
            if (this.x_v < 0 && this.y_v < 0) this.state = "walk_NW";
            else if (this.x_v > 0 && this.y_v < 0) this.state = "walk_NE";
            else if (this.x_v < 0 && this.y_v > 0) this.state = "walk_SW";
            else if (this.x_v > 0 && this.y_v > 0) this.state = "walk_SE";
            else if (this.x_v < 0) this.state = "walk_W";
            else if (this.x_v > 0) this.state = "walk_E";
            else if (this.y_v < 0) this.state = "walk_N";
            else if (this.y_v > 0) this.state = "walk_S";
        }
        else {
            
            if (this.state.startsWith("walk")) {
                this.set_idle_state(); 
            }
        }
    }
    

    

    handleBoundaries() {
        var frame_data = this.sprite_json[this.root_e][this.state][this.cur_frame];
        if (this.x >= window.innerWidth - frame_data['w'] || this.x <= 0 ||
            this.y >= window.innerHeight - frame_data['h'] || this.y <= 0) {
            this.set_idle_state();
        }
    }

    set_idle_state() {
        this.x_v = 0;
        this.y_v = 0;
       
        let idleAnimations = ["idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown", "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight", "idleLookUp", "idleSit", "idleSpin", "idleSpinWave", "idleWave"];
        // select a random idle animation from the list
        this.state = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
        this.cur_frame = 0;
    }
    


    cohesion(sprites, cohesionDistance = 200, alignmentFactor = 1) {
        let avgX = 0;
        let avgY = 0;
        let count = 0;
        
      
        sprites.forEach(sprite => {
            let d = Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2);
            if (d > 0 && d < cohesionDistance) {
                avgX += sprite.x;
                avgY += sprite.y;
                count++;
            }
        });

        // steer towards center mass of flock
        if (count > 0) {
            avgX /= count;
            avgY /= count;

            let diffX = avgX - this.x;
            let diffY = avgY - this.y;

            let distance = Math.sqrt(diffX ** 2 + diffY ** 2);

            if (distance > 0) {
                diffX /= distance;
                diffY /= distance;
            }

            this.x_v += diffX * alignmentFactor;
            this.y_v += diffY * alignmentFactor;
        }
    }

    alignment(sprites, alignmentDistance = 200, alignmentFactor = 0.1) {
        let avgXV = 0;
        let avgYV = 0;
        let count = 0;
    
     
        sprites.forEach(sprite => {
            let d = Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2);
            if (d > 0 && d < alignmentDistance) {
                avgXV += sprite.x_v;
                avgYV += sprite.y_v;
                count++;
            }
        });
    
    
        if (count > 0) {
            avgXV /= count;
            avgYV /= count;
    
            let diffXV = avgXV - this.x_v;
            let diffYV = avgYV - this.y_v;
    
            this.x_v += diffXV * alignmentFactor;
            this.y_v += diffYV * alignmentFactor;
        }
    }
    
    separation(sprites, separationDistance = 150, maxSpeed = 4) {
        let avoidanceForce = 0.9; //control separation distance
    
        
        let steerX = 0;
        let steerY = 0;
    
        sprites.forEach(sprite => {
            if (sprite !== this) {
                let diffX = this.x - sprite.x;
                let diffY = this.y - sprite.y;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);
    
                if (distance < separationDistance) {
                    // steer away if too close to other sprite
                    steerX += diffX / distance * avoidanceForce;
                    steerY += diffY / distance * avoidanceForce;
                }
            }
        });
    
        
        this.x_v += steerX;
        this.y_v += steerY;
    
        
        let speed = Math.sqrt(this.x_v ** 2 + this.y_v ** 2);
        if (speed > maxSpeed) {
            let ratio = maxSpeed / speed;
            this.x_v *= ratio;
            this.y_v *= ratio;
        }
    
    
        this.x += this.x_v;
        this.y += this.y_v;
    
        // ensure sprite stays within canvas boundaries
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > canvas.width) {
            this.x = canvas.width;
        }
    
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > canvas.height) {
            this.y = canvas.height;
        }
    }
    
    

    move(keyCode) {
        let xVelocity = this.x_v,
            yVelocity = this.y_v;
    
        switch (keyCode) {
            case 38: // Up
                yVelocity = -10;
                break;
            case 39: // Right
                xVelocity = 10;
                break;
            case 40: // Down
                yVelocity = 10;
                break;
            case 37: // Left
                xVelocity = -10;
                break;
        }
    
        
        if (keyCode === 38 || keyCode === 40) {
            // Up or Down
            if (this.state === "walk_W") xVelocity = -10;
            else if (this.state === "walk_E") xVelocity = 10;
        } else if (keyCode === 37 || keyCode === 39) {
            // Left or Right
            if (this.state === "walk_N") yVelocity = -10;
            else if (this.state === "walk_S") yVelocity = 10;
        }
    
        if (keyCode === 38 && (this.state === "walk_W" || this.state === "walk_NW")) {
            // Up arrow and already moving left
            xVelocity = -10;
        } else if (keyCode === 38 && (this.state === "walk_E" || this.state === "walk_NE")) {
            // Up arrow and already moving right
            xVelocity = 10;
        }
    
        if (keyCode === 40 && (this.state === "walk_W" || this.state === "walk_SW")) {
            // Down arrow and already moving left
            xVelocity = -10;
        } else if (keyCode === 40 && (this.state === "walk_E" || this.state === "walk_SE")) {
            // Down arrow and already moving right
            xVelocity = 10;
        }
    
        if (keyCode === 37 && (this.state === "walk_N" || this.state === "walk_NW")) {
            // Left arrow and already moving up
            yVelocity = -10;
        } else if (keyCode === 37 && (this.state === "walk_S" || this.state === "walk_SW")) {
            // Left arrow and already moving down
            yVelocity = 10;
        }
    
        if (keyCode === 39 && (this.state === "walk_N" || this.state === "walk_NE")) {
            // Right arrow and already moving up
            yVelocity = -10;
        } else if (keyCode === 39 && (this.state === "walk_S" || this.state === "walk_SE")) {
            // Right arrow and already moving down
            yVelocity = 10;
        }
    
        if (xVelocity !== this.x_v || yVelocity !== this.y_v) {
            
            this.x_v = xVelocity;
            this.y_v = yVelocity;
            this.cur_frame = 0;
        }
    }
    

    //this is more for the user-controlled sprite
    stop(keyCode) {
        switch (keyCode) {
            case 38: case 40: this.y_v = 0; break; // stop vertical movement
            case 39: case 37: this.x_v = 0; break; // stop horizontal movement
        }
        if (this.x_v === 0 && this.y_v === 0) {
            this.set_idle_state(); // reset to idle if no movement
        }
    }
    
    
}