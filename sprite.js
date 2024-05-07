class Sprite {
    constructor(sprite_json, x, y, start_state) {
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.x_v = 0;
        this.y_v = 0;

        this.speed = 6; // speed 
        this.isMoving = false;

        this.idleTimeout = null;
    }

    draw() {

        var ctx = canvas.getContext('2d');
    
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
        if (this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }
    
        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);
    
        this.cur_frame++;
        if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
            this.cur_frame = 0;
        }
    
        if (this.isMoving) {
            this.x += this.x_v;
            this.y += this.y_v;
    
            //out of bounds
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x + this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].width > canvas.width) {
                this.x = canvas.width - this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].width;
            }
    
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y + this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].height > canvas.height) {
                this.y = canvas.height - this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].height;
            }
        } else {
            if (!this.idleTimeout) {
                this.idleTimeout = setTimeout(() => {
                    this.set_idle_state();
                }, 3000);
            }
        }
    }
    

    setAnimation(state) {
        this.state = state;
        this.cur_frame = 0;
    }

    startMovement(direction) {
        this.idleTimeout = null;

        switch (direction) {
            case 'up':
                this.y_v = -this.speed;
                this.setAnimation('walk_N');
                break;
            case 'down':
                this.y_v = this.speed;
                this.setAnimation('walk_S');
                break;
            case 'left':
                this.x_v = -this.speed;
                this.setAnimation('walk_W');
                break;
            case 'right':
                this.x_v = this.speed;
                this.setAnimation('walk_E');
                break;
        }
        this.isMoving = true;
    }

    
    stopMovement() {
        this.x_v = 0;
        this.y_v = 0;
        this.setAnimation('idle');
        this.isMoving = false;
    }

    set_idle_state() {
        const prevX = this.x;
        const prevY = this.y;

        this.x_v = 0;
        this.y_v = 0;
        const idle_states = ["idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown", "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight", "idleLookUp", "idleSit", "idleSpin", "idleWave"];
        const randomIndex = Math.floor(Math.random() * idle_states.length);
        this.setAnimation(idle_states[randomIndex]);

        this.x = prevX;
        this.y = prevY;
    }
}
