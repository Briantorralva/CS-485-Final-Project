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

        this.x_v = 0;
        this.y_v = 0;
    }

    draw(state){
        var ctx = canvas.getContext('2d');

        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y, this.sprite_json[this.root_e][this.state][this.cur_frame]['w'], this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );

        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            console.log(this.cur_frame);
            this.cur_frame = 0;
        }
        
        //set velocity based on state
        if(this.state == "walk_N"){
            this.x_v = 0;
            this.y_v = -10;
        }else if(this.state == "walk_E"){
            this.x_v = 10;
            this.y_v = 0;
        }else if(this.state == "walk_S"){
            this.x_v = 0;
            this.y_v = 10;
        }else if(this.state == "walk_W"){
            this.x_v = -10;
            this.y_v = 0;
        }

        if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
            //East boundary
            this.x = this.x - 30;
            this.set_idle_state();
        }else if(this.x <= 0){
            //West boundary
            this.x = this.x + 30;
            this.set_idle_state();
        }else if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
            //South boundary
            this.y = this.y - 30;
            this.set_idle_state();
        }else if(this.y <= 0){
            //North boundary
            this.y = this.y + 30;
            this.set_idle_state();
        }else{
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

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
