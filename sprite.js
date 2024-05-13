class Sprite {
    constructor(sprite_json, x, y, start_state) {
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";
        this.cur_frame = 0;
        // random initial velocity
        this.x_v = Math.random() * 8 - 4; // random velocity between -2 and 2
        this.y_v = Math.random() * 8 - 4;
    }
    

    draw() {
        var ctx = canvas.getContext('2d');
        var frame_data = this.sprite_json[this.root_e][this.state][this.cur_frame];
    
        if (!frame_data['img']) {
            frame_data['img'] = new Image();
            frame_data['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }
    
        ctx.drawImage(frame_data['img'], this.x, this.y);
        
        // update animation frame
        this.cur_frame = (this.cur_frame + 1) % this.sprite_json[this.root_e][this.state].length;
    
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
        if (this.x_v < 0) this.state = "walk_W";
        else if (this.x_v > 0) this.state = "walk_E";
        if (this.y_v < 0) this.state = "walk_N";
        else if (this.y_v > 0) this.state = "walk_S";
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
        this.state = "idle";
        this.cur_frame = 0;
    }


    cohesion(sprites, cohesionDistance = 200, alignmentFactor = 1) {
        let avgX = 0;
        let avgY = 0;
        let count = 0;
        
        // Average up the distances to get center mass 
        sprites.forEach(sprite => {
            let d = Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2);
            if (d > 0 && d < cohesionDistance) {
                avgX += sprite.x;
                avgY += sprite.y;
                count++;
            }
        });

        // Steer towards center mass of flock
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
    
        // Average up velocities 
        sprites.forEach(sprite => {
            let d = Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2);
            if (d > 0 && d < alignmentDistance) {
                avgXV += sprite.x_v;
                avgYV += sprite.y_v;
                count++;
            }
        });
    
        //Adjust to average heading
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
        let avoidanceForce = 0.9; //Control separation distance
    
        // Calculate the steering force for avoidance
        let steerX = 0;
        let steerY = 0;
    
        sprites.forEach(sprite => {
            if (sprite !== this) {
                let diffX = this.x - sprite.x;
                let diffY = this.y - sprite.y;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);
    
                if (distance < separationDistance) {
                    // Steer away if too close to other sprite
                    steerX += diffX / distance * avoidanceForce;
                    steerY += diffY / distance * avoidanceForce;
                }
            }
        });
    
        // Apply the steering force to adjust the velocity
        this.x_v += steerX;
        this.y_v += steerY;
    
        // Limit speed 
        let speed = Math.sqrt(this.x_v ** 2 + this.y_v ** 2);
        if (speed > maxSpeed) {
            let ratio = maxSpeed / speed;
            this.x_v *= ratio;
            this.y_v *= ratio;
        }
    
        // Update position
        this.x += this.x_v;
        this.y += this.y_v;
    
        // Ensure sprite stays within canvas boundaries
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
        let newState, xVelocity = 0, yVelocity = 0;
        switch (keyCode) {
            case 38: // Up
                newState = "walk_N";
                yVelocity = -10;
                break;
            case 39: // Right
                newState = "walk_E";
                xVelocity = 10;
                break;
            case 40: // Down
                newState = "walk_S";
                yVelocity = 10;
                break;
            case 37: // Left
                newState = "walk_W";
                xVelocity = -10;
                break;
        }
    
        if (newState !== this.state) {
            this.state = newState;
            this.cur_frame = 0; // reset frame index when changing direction
        }
    
        this.x_v = xVelocity;
        this.y_v = yVelocity;
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