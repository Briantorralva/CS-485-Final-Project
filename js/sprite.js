//Parent Sprit Classa
class Sprite {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;
        this.cur_bk_data = null;

        this.x_v = Math.floor(Math.random() * 10);
        this.y_v = Math.floor(Math.random() * 10);
    
        this.follow_range = 50;
    }

    align() {
        let totalX = 0;
        let totalY = 0;
        let count = 0;
    
        for (const spriteGroup of sprites_to_draw) {
            for (const sprite of spriteGroup) {
                if (sprite !== this) {
                    const distance = Math.floor(Math.sqrt((sprite.x_v - this.x_v) ** 2 + (sprite.y_v - this.y_v) ** 2));
                    if (distance < sprite.follow_range) {
                        totalX += sprite.x_v;
                        totalY += sprite.y_v;
                        count++;
                    } 
                }
            }
        }
    
        if (count > 0) {
            const avgX = totalX / count;
            const avgY = totalY / count;
            
             this.x_v += (avgX - this.x_v) * 0.1;
             this.y_v += (avgY - this.y_v) * 0.1;
             
             this.x = this.x + this.x_v;
             this.y = this.y + this.y_v;
        }

    }
    


    draw(state){


        //this.align(sprites_to_draw);


        var ctx = canvas.getContext('2d');
        //this.align(sprites_to_draw);
        //ctx.clearRect(this.x - this.x_v, this.y - this.y_v, this.sprite_json[this.root_e][this.state][this.cur_frame]['w'], this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y, this.sprite_json[this.root_e][this.state][this.cur_frame]['w'], this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);
        
        //ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }



        if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) 
            && this.state != "walk_N" && this.state != "walk_S" && this.state != "walk_W"
        )
        {
            //East boundary
            this.x_v = this.x_v * -2; 
            //this.y_v = this.y_v - this.y; 
            //this.align(sprites_to_draw);

        }
        if(this.x <= 0 
            && this.state != "walk_N" && this.state != "walk_S" && this.state != "walk_E"){
            //West boundary
            this.x_v = this.x_v * -2;
            //this.align(sprites_to_draw);

        }
         if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) 
            && this.state != "walk_W" && this.state != "walk_E" && this.state != "walk_N"
        ){
            //South boundary
            this.y_v = this.y_v * -2;
            //this.align(sprites_to_draw);

        }
         if(this.y <= 0 && this.state != "walk_W" && this.state != "walk_E" && this.state != "walk_S"){
            //North boundary
            this.y_v = this.y_v * -2; 
            //this.align(sprites_to_draw);
 
        }
        this.align(sprites_to_draw);


        //this.add_total_spd();

        return false;
    }

    set_idle_state(){
        this.x_v = 0;
        this.y_v = 0;
        
        this.state = "idle";
    }

    set_move_N(){
        this.cur_frame = 0;
        this.state = "walk_N";
    }

    set_move_E(){
        this.cur_frame = 0;
        this.state = "walk_E";
    }

    set_move_S(){
        this.cur_frame = 0;
        this.state = "walk_S";
    }

    set_move_W(){
        this.cur_frame = 0;
        this.state = "walk_W";
    }

   move(e){
    if(e == 38){ //up arrow
        this.set_move_N()
    }else if(e == 39){ //right arrow
        this.set_move_E()
    }else if(e == 40){ //south arrow
        this.set_move_S()
    }else if(e == 37){ //left arrow
        this.set_move_W()
    }

   }

   

}



    

