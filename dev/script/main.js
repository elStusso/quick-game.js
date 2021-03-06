/**
 * Trude Game
 * @version  0.2
 * @author  Daniel Stuessy
*/
define(['gamestrut'], function (GameStrut) {

	var run = function () {

		var canvasWidth = 1000;
		var canvasHeight = 600;

		var level = new GameStrut.Level({
			id: "level_test",
			gravityV: 80,
			debugElId: 'debugEl',
			entities: [
				new GameStrut.AnimateEntity({
					id: 'animate_entity_test',
					x: 50,
					y: 50,
					width: 40,
					height: 80,
					zindex: '1',
					friction: 1,
					density: 1,
					restitution: 0,
					moveVelocity: 12,
					jumpPower: 25,
					// MOVES PLAYER TO THE RIGHT
					moveRight: function () {

						//console.log('moveRight!');

						this.setLinearVelocity({x: this.moveVelocity});
						this.setAngularVelocity(0.2);

						if (this.getAngle() > 0.2) {
							this.setAngle(0.2);
						}
					},
					// MOVES PLAYER TO THE LEFT
					moveLeft: function () {

						//console.log('moveLeft!');

						this.setLinearVelocity({x: -1*( this.moveVelocity )});
						this.setAngularVelocity(-0.2);

						if (this.getAngle() < -0.2) {
							this.setAngle(-0.2);
						}
					},
					// ADJUSTS PLAYER TO A STANDING POSITION
					standing: function () {

						//console.log('standing');

						this.setAngle(0);
						this.setLinearVelocity(0);
						this.setAngularVelocity(0);
					},
					// JUMPS PLAYER
					jump: function () {

						//console.log('jump!');

						// DEFINE jumpCount
						this.jumpCount = this.jumpCount || 1;
						// SET jumpPower RELATIVE TO NUMBER OF JUMPS
						var jumpPower = this.jumpPower;

						// ONLY JUMP IF JUMPING IS DONE
						if (
							typeof this.jumped == 'undefined' 
							&& 
							this.jumpCount < 3
						) {

							// APPLY IMPULSE
							this.setLinearVelocity({
								y: -1*( jumpPower )
							});
							// SET JUMPED TO TRUE
							this.jumped = true;
							// INCREASE JUMP COUNT
							this.jumpCount++;
						}
					},
					touchWalls: function () {

						this.setFriction( 0 );
					},
					// WHEN JUMP BUTTON IS RELEASED
					jumpRelease: function () {
						// DEFINED IN jump FOR THE FIRST TIME
						// used to controll jumps per space press
						this.jumped = undefined;
					},
					// WHEN JUMP NEEDS TO BE RESET -- for double jump
					jumpReset: function () {
						this.setFriction( 0.5 );
						this.jumpCount = undefined;
					},
					save: function () {
						//console.log('save!');
					},
					controllers: {
						'jump': {
							event: 'keydown',
							key: 'space',
							preventDefault: true,
							execute: 'jump'
						},
						'jumpRelease': {
							event: 'keyup',
							key: 'space',
							preventDefault: true,
							execute: 'jumpRelease'
						},
						'save': {
							event: 'keydown',
							key: 'ctrl+s',
							execute: 'save'
						},
						'standing': {
							event: 'keyup',
							key: 'a+d',
							execute: 'standing'
						},
						'right': {
							event: 'keydown',
							key: 'd', 
							execute: 'moveRight'
						},
						'left': {
							event: 'keydown',
							key: 'a',
							execute: 'moveLeft'
						}
					},
					collisions: {
						'BeginContact': {
							'block_test': 'jumpReset',
							'block_test_2': 'jumpReset',
							'block_ceiling': 'jumpReset',
							'block_left_wall': 'touchWalls',
							'block_right_wall': 'touchWalls',
							'animate_entity_test_2': 'jumpReset',
							'animate_entity_test_3': 'jumpReset',
							'block_floor': 'jumpReset'
						}
					}
				}),
				new GameStrut.AnimateEntity({
					id: 'animate_entity_test_2',
					x: 500,
					y: 500,
					width: 100,
					height: 100,
					color: 'blue',
					zindex: '1',
					restitution: 0,
					density: 1
				}),
				new GameStrut.AnimateEntity({
					id: 'animate_entity_test_3',
					x: canvasWidth/2, 
					y: canvasHeight/2,
					width: 20,
					height: 20,
					color: 'yellow',
					restitution: 0,
					zindex: '1'
				}),
				new GameStrut.StaticEntity({
					id: 'block_ceiling',
					x: 0,
					y: 0,
					width: canvasWidth,
					height: 50,
					color: 'white',
					zindex: '2'
				}),
				new GameStrut.StaticEntity({
					id: 'block_left_wall',
					x: 0,
					y: 0,
					width: 50,
					height: canvasHeight,
					color: 'white',
					zindex: '2'
				}),
				new GameStrut.StaticEntity({
					id: 'block_right_wall',
					x: canvasWidth,
					y: 0,
					width: 50,
					height: canvasHeight,
					color: 'white',
					zindex: '2'
				}),
				new GameStrut.StaticEntity({
					id: 'block_floor',
					x: 0,
					y: canvasHeight,
					width: canvasWidth,
					height: 50,
					color: 'white',
					zindex: '2'
				}),
				new GameStrut.StaticEntity({
					id: 'block_test',
					x: 10,
					y: 200,
					width: 400,
					height: 50,
					color: 'brown',
					zindex: '2'
				}),
				new GameStrut.StaticEntity({
					id: 'block_test_2',
					x: 400,
					y: canvasHeight-25,
					width: 400,
					height: 25,
					color: 'white',
					zindex: '2'
				}),
				new GameStrut.TextEntity({
					id: 'title',
					text: 'Title!',
					x: canvasWidth/2,
					y: 50,
					fontFamily: 'Helvetica',
					fontColor: '#00ff00',
					zindex: '3'
				}),
				new GameStrut.Background({
					id: 'background',
					//texture: 'images/background.png',
					zindex: '0'
				})
			]
		});

		console.log(level);
		console.log(level.type);
		console.log(level instanceof GameStrut.Level);

		var game = new GameStrut.Game({
			canvasID: 'canvas',
			canvasWidth: canvasWidth,
			canvasHeight: canvasHeight,
			levels: [level],
			current_level: level,
			disableRightClick: true,
			debugMode: true
		});

		console.log(game);
	};

	return run;
});

