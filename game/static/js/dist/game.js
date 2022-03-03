class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            // outer.hide();
            // outer.root.playground.show("multi mode");
        });
        this.$settings.click(function(){
            // outer.root.settings.logout_on_remote();
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }


    hide() {  // 关闭menu界面
        this.$menu.hide();
    }

}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
//        this.uuid = this.create_uuid();
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    late_update() {  // 在每一帧的最后执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}


let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);



class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        //        this.$canvas.focus();
    }

    resize() {
        //   this.ctx.canvas.width = this.playground.width;
        // this.ctx.canvas.height = this.playground.height;
        // this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;



    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }

    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }

                outer.cur_skill = null;
            }
        });


    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }


    update() {
        //this.spent_time += this.timedelta / 1000;
        //if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0) {
          //  let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            //let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            //let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            //this.shoot_fireball(tx, ty);
        //}

        //if (this.damage_speed > 10) {
          //  this.vx = this.vy = 0;
            //this.move_length = 0;
            //this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            //this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            //this.damage_speed *= this.friction;
        //} else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
            //    if (!this.is_me) {
              //      let tx = Math.random() * this.playground.width;
                //    let ty = Math.random() * this.playground.height;
                  //  this.move_to(tx, ty);
                //}
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        //}


        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}

class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        //this.hide();

        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        this.start();
    }

    start() {

    }

    show(mode) {  // 打开playground界面
        this.$playground.show();

    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }

}
export class AcGame {
    constructor(id){
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.AcWingOS = AcWingOS;


        // this.settings = new Settings(this);
//        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }

}
