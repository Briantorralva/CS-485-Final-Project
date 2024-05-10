const Sprites = new Array(2);

//Parent Sprit Classa
class Sprite {
    static total_x_v;
    static total_y_v;
    static avg_x_v; 
    static avg_y_v;
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.stop = false;

        this.x_v = Math.floor(Math.random() * 1);
        this.y_v = Math.floor(Math.random() * 1);
        
        this.avg_x = 1;
        this.avg_y = 1;
 
        this.follow_range = 50;
    }

    add_total_spd(){
        this.total_x_v = 1;
        this.total_y_v = 1;
        console.log(this.total_x_v);
        console.log(this.total_y_v);
        this.avg_x_v = this.x_v;
        this.avg_y_v = this.y_v;
        this.total_x_v = this.total_x_v + this.x_v;
        this.total_y_v = this.total_y_v + this.y_v;
        this.avg_x_v = this.total_x_v;
        this.avg_y_v = this.total_y_v;
        this.x_v = this.avg_x_v;
        this.y_v = this.avg_y_v; 
        //this.x_v = this.x_v;
        //this.y_v = this.y_v; 
    }

    add_avg(){
        console.log(this.total_x_v);
        console.log(this.total_y_v);
        this.avg_x_v = this.total_x_v / 2;
        this.avg_y_v = this.total_y_v / 2;
    }

    update_spd(){
        this.x_v = this.x_v;
        this.y_v = this.y_v;
    }

    

    alignment(Sprites){
        let avg_x = 0;
        let avg_y = 0;
        for(var i = 0; i < Sprites[i].length(); i++){
            avg_x = avg_x + (Sprites[i].x_v);
            avg_y = avg_y + (Sprites[i].y_v);

        }   
        avg_x = avg_x / (Sprites.length);
        avg_y = avg_y / (Sprites.length);
        for(var i = 0; i < Sprites[i].length(); i++){
            Sprites[i].x_v = avg_x;
            Sprites[i].x_y = avg_y;
        }   

    }
    
    avg_speed(){
        this.avg_x = this.avg_x + this.x_v;
        this.avg_y = this.avg_y + this.y_v;
        this.avg_x = this.avg_x / 2;
        this.avg_y = this.avg_y / 2;
        this.x_v = this.avg_x;
        this.x_y = this.avg_y;
    }
    
    draw(state){
        //this.add_avg();
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
        
        //ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );
        
        this.cur_frame = this.cur_frame + 1;
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            console.log(this.cur_frame);
            this.cur_frame = 0;
        }
        
        this.add_total_spd();


        if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) 
            && this.state != "walk_N" && this.state != "walk_S" && this.state != "walk_W"
        )
        {
            //East boundary
            this.x_v = this.x_v * -1; 
            //this.y_v = this.y_v - this.y; 

        }
        if(this.x <= 0 
            && this.state != "walk_N" && this.state != "walk_S" && this.state != "walk_E"){
            //West boundary
            this.x_v = this.x_v * -1;
        }
         if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) 
            && this.state != "walk_W" && this.state != "walk_E" && this.state != "walk_N"
        ){
            //South boundary
            this.y_v = this.y_v * -1;
        }
         if(this.y <= 0 && this.state != "walk_W" && this.state != "walk_E" && this.state != "walk_S"){
            //North boundary
            this.y_v = this.y_v * -1;  
        }

            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;

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
