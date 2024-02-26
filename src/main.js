import kaboom from "kaboom";

const FLOOR_HEIGHT = 300;
const JUMP_FORCE = 1300;
const SPEED = 500;

kaboom();

loadSprite("robot", "sprites/robot.png");
loadSprite("floor", "sprites/floor.png");
loadSprite("wrobot", "sprites/wrobot.png");
loadSprite("shower", "sprites/shower.png");
loadSprite("computer", "sprites/computer.png");
loadSprite("rcomputer", "sprites/computerred.png");
loadSprite("int", "sprites/int.png");
loadSprite("intr", "sprites/intr.png");
loadSprite("title", "sprites/title.png");

loadSound("bg", "sounds/mixkit-game-level-music-689.mp3");

const music = play("bg", {
	volume: 0.8,
	loop: true,
	paused: true,
})

scene("starterpage", () => {

	add([
		rect(4000,2000),
		anchor("center"),
		color(135, 206, 235),
	])

	add([
		text("RunTime Error"),
		pos(width()/2, height()/2 - 80),
		scale(4),
		anchor("center"),
	])
		
	add([
		text("Press Space To Start"),
		pos(width()/2, height()/2 + 160),
		scale(2),
		anchor("center"),
	])

	function str(){
		go("game");
	}

	onKeyPress("space", str);
})

scene("game", () => {

	let jumpCount = 0;
	const maxJumps = 2;
	let isWalking = false;
	let isBroken = false;
	let isInt = false;
	music.paused = false;

    setGravity(1800);

	
	add([
		rect(width(), 1000),
		color(135, 206, 235),
		pos(0, 0 ),
	])

    const player = add([
        sprite("robot"),
        pos(90, 40),
        area(),
        body(),
		scale(2),
    ]);

	loop(0.2, () => {
		if(player.isGrounded() && jumpCount >= 2){
			jumpCount = 0;
		}
		if (isWalking) {
			player.use(sprite("robot")); 
		} else {
			player.use(sprite("wrobot"));   
		}
		isWalking = !isWalking;  
	});


	const floor = add([
		sprite("floor", {width: width(), height: FLOOR_HEIGHT}),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
	])


    function jump() {

        if (player.isGrounded() || jumpCount < maxJumps) {
            player.jump(JUMP_FORCE);
			jumpCount++;
        }
    }

    onKeyPress("space", jump);
    onClick(jump);

	function spawnShower(){

		add([
			sprite("shower"),
			scale(2),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			move(LEFT, SPEED),
			"shower"
		]);


		wait(rand(1, 4), spawnShower);		
	}

	spawnShower();

	function spawnComputer(){
		const com = add([
			sprite("computer"),
			scale(2),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			move(LEFT, SPEED),
			"com"
		])

		loop(0.3, () => {
			if (isBroken) {
				com.use(sprite("computer"));  
			} else {
				com.use(sprite("rcomputer"));  
			}
			isBroken = !isBroken;  
		});

		wait(rand(4, 8), spawnComputer);		
	}

	spawnComputer();

	function spawnInternet(){
		const int = add([
			sprite("int"),
			scale(2),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			move(LEFT, SPEED),
			"int"
		])

		loop(0.3, () => {
			if (isInt) {
				int.use(sprite("int"));  
			} else {
				int.use(sprite("intr"));  
			}
			isInt = !isInt;  
		});

		wait(rand(1, 4), spawnComputer);		
	}

	spawnInternet();

	player.onCollide("shower", () => {
        go("lose", score);
    });

	player.onCollide("com", () =>{
		go("lose", score);
	})

	player.onCollide("int", () => {
		go("lose", score);
	})

    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });
});

scene("lose", (score) => {

	music.paused = true;
		
	add([
		rect(width(), 1000),
		color(135, 206, 235),
		pos(0, 0 ),
	])

	add([
        sprite("robot"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    add([
        text("Score: " + score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

	add([
		text("Press Space To Start Again"),
		pos(width()/2, height()/2 + 160),
		scale(2),
		anchor("center"),
	])


    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("starterpage");