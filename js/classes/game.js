import { Player } from "./player.js";
import { Background } from "./background.js";
import { Monsters } from "./monsters.js";
import { Bats } from "./bats.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, CTX } from "../utils/constants.js";
import { Boss } from "./boss.js";
import { DisplayInfo } from "./displayInfo.js";
import { sounds } from "../utils/sounds.js";
import { KeyHandler } from "./keyHandler.js";

export class Game {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.interval = null;
    this.pauseInterval = null;
    this.pause = false;
    this.storage = false;
    this.score = [];
    this.stop = false;
    this.isFinal = false;

    this.batFreed = 0;
    this.monstersKilled = 0;
    this.scorePoints = 0;
    this.liveAccumulator = 0;
    this.namePlayer = "";

    this.decorations = new Background();

    this.player = new Player(this);

    this.display = new DisplayInfo();

    this.input = new KeyHandler(this);
    this.keys = [];

    this.bat = new Bats(this);
    this.monster = new Monsters(this);
    this.bone = new Monsters(this);
    this.boss = new Boss(this);
    this.finalCage = new Bats(this);

    this.bats = [];
    this.monsters = [];
    this.bones = [];
    this.finalBats = [];

    for (let i = 0; i < 100; i++) {
      let x = Math.floor(Math.random() * 150) + CANVAS_WIDTH - 20;
      let y = Math.floor(Math.random() * 310) + 140;
      this.finalBats.push(new Bats(this, x, y));
    }
  }

  start() {
    clearInterval(this.pauseInterval);
    this.pauseInterval = null;

    this.interval = setInterval(() => {
      this.clear();

      this.decorations.draw();

      this.bat.batsAppears();
      this.monster.monstersAppears();

      this.bats.forEach((bat) => {
        bat.drawBats();
        bat.movement();
      });

      this.monsters.forEach((monster) => {
        monster.draw();
        monster.healthBar();
        monster.movement();
      });

      this.checkBombAndCage();
      this.checkBombAndMonster();
      this.checkCollisionsMonstersAndBones();

      this.finalBatle();

      if (this.isFinal && this.boss.isBossAppear) {
        this.finalCage.finalBack.draw();

        this.finalBats.forEach((bat) => {
          bat.draw();
          bat.position.xPosition -= bat.batSpeed;
          if (!this.finalCage.isBatFreed && this.finalCage.cageSpeed === 0) bat.batSpeed = 0;
          if (bat.position.xPosition < -bat.widthImg) bat.isBatOut = true;
        });
        this.finalCage.finalDoor.switchSprite(this.finalCage.isBatFreed ? "FinalOpen" : "FinalClose");
        this.finalCage.finalDoor.draw();

        this.finalCage.final();

        this.boss.draw();

        this.checkBombAndBOSS();
      }

      this.bones.forEach((bone) => {
        bone.xVelocity = 15;
        bone.draw();
        bone.move();
      });

      this.boss.bossAppear();
      this.bone.bonesAppears();

      this.player.charAnimations();

      if (!this.player.isWinner) this.displayStatus();

      if (this.boss.isBossDead && this.boss.position.xPosition > CANVAS_WIDTH) this.gameOver();
    }, 1000 / 60);
  }

  finalBatle() {
    const dx = this.boss.position.xPosition + this.boss.xLocation - this.player.position.xPosition;
    const dy = this.boss.position.yPosition + this.boss.yLocation - this.player.position.yPosition;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 150 && !this.player.isDead && !this.player.isDone && !this.boss.isBossDead) {
      if (this.boss.position.xPosition + this.boss.xLocation > this.player.position.xPosition) {
        this.boss.setState = "attack";
      } else {
        this.boss.setState = "attackright";
      }

      this.player.isDone = true;
      setTimeout(() => {
        this.player.takedHit = true;
        this.player.lives -= 1;
      }, 1500);
      setTimeout(() => {
        this.player.isDone = false;
      }, 1000);
      setTimeout(() => {
        this.boss.setState = "walk";
        this.boss.speed = -1.5;
      }, 1400);
    } else if (this.player.isDead) {
      setTimeout(() => {
        this.boss.speed = 0;
        this.boss.setState = "idle";
      }, 3000);
    }
  }

  checkBombAndBOSS() {
    if (this.boss.isBossDead) return;

    this.player.spiritBombs.forEach((bomb) => {
      const colX =
        this.boss.position.xPosition + this.boss.xLocation < bomb.position.xPosition + bomb.widthImg / 2 &&
        this.boss.position.xPosition + this.boss.widthImg - bomb.widthImg > bomb.position.xPosition;

      const colY = this.boss.position.yPosition + 300 < bomb.position.yPosition + 40 + bomb.heightImg - 80;

      if (colX && colY) {
        if (this.boss.lives > 0) bomb.isSpiritBombCollided = true;
        this.boss.lives -= Math.floor(Math.random() * 20 + 10);
        this.scorePoints += Math.floor(Math.random() * 100 + 40);
        sounds.bossHit.play();
        if (this.boss.position.xPosition + this.boss.xLocation > this.player.position.xPosition) {
          this.boss.setState = "walk";
          this.boss.speed = 1.5;
        } else {
          this.boss.setState = "walkRight";
          this.boss.speed = -1.5;
        }
      }
      if (this.boss.lives <= 0) {
        this.scorePoints += 1000;
        this.finalCage.isBatFreed = true;
        this.finalBats.forEach((bat) => {
          bat.batSpeed = Math.floor(Math.random() * 5 + 4);
          bat.position.xPosition -= bat.batSpeed;
        });

        this.boss.isBossDead = true;
        this.boss.speed = -2;
      }
    });
  }

  checkBombAndMonster() {
    this.monsters.forEach((monster) => {
      if (!monster.isMonsterKilled) {
        this.player.spiritBombs.forEach((bomb) => {
          const colX =
            monster.position.xPosition + 30 < bomb.position.xPosition + 40 + bomb.widthImg - 80 &&
            monster.position.xPosition + 30 + monster.widthImg - bomb.widthImg > bomb.position.xPosition + 40;
          const colY =
            monster.position.yPosition + 30 < bomb.position.yPosition + 40 + bomb.heightImg - 80 &&
            monster.position.yPosition + 30 + monster.heightImg > bomb.position.yPosition + 40;

          if (colX && colY) {
            bomb.isSpiritBombCollided = true;
            monster.lives -= Math.floor(Math.random() * 30 + 10);
            sounds.impactMonster.play();
          }
        });
        if (monster.lives <= 0) {
          monster.speed = 1;
          monster.isNotAttacking = true;
          this.monstersKilled += 1;
          this.scorePoints += Math.floor(Math.random() * 50 + 30);
          monster.isMonsterKilled = true;
          monster.setState = "dead";

          setTimeout(() => {
            this.monsters = this.monsters.filter((monster) => !monster.isMonsterKilled);
          }, 800);
        }
      }
    });
  }

  checkBombAndCage() {
    this.player.spiritBombs.forEach((bomb) => {
      this.bats.forEach((bat) => {
        if (!bat.isBatFreed) {
          const colX =
            bat.cageBack.position.xPosition + 40 < bomb.position.xPosition + bomb.widthImg &&
            bat.cageBack.position.xPosition + 40 + bat.cageBack.widthImg - bomb.widthImg > bomb.position.xPosition;

          const colY =
            bat.cageBack.position.yPosition < bomb.position.yPosition + bomb.heightImg &&
            bat.cageBack.position.yPosition + bat.cageBack.heightImg - 80 > bomb.position.yPosition;

          if (colX && colY) {
            bat.cageBack.hard -= 1;
            bomb.isSpiritBombCollided = true;

            if (bat.cageBack.hard >= 1) sounds.collisionCage.play();

            if (bat.cageBack.hard === 0) {
              bat.isBatFreed = true;
              bat.batSpeed = 2;
              this.batFreed += 1;
              this.scorePoints += Math.floor(Math.random() * 100 + 40);

              if (this.player.lives < 10) this.liveAccumulator += 1;

              if (this.liveAccumulator >= 5 && this.player.lives < 10) {
                this.player.lives += 1;
                this.liveAccumulator = 0;
              }
            }
          }
        }
      });
    });
  }

  checkCollisionsMonstersAndBones() {
    if (!this.player.isDead || !this.player.isTaked) {
      this.monsters.forEach((monster) => {
        if (!monster.isNotAttacking) {
          const colXmonster =
            monster.position.xPosition + monster.xLocation < this.player.position.xPosition + this.player.widthImg &&
            monster.position.xPosition + monster.widthImg - this.player.widthImg > this.player.position.xPosition;

          const colYmonster = monster.position.yPosition < this.player.position.yPosition + this.player.heightImg;

          if (colXmonster && colYmonster) {
            if (this.player.lives > 0) {
              monster.setState = "attack";

              this.player.takedHit = true;

              if (!this.player.isTaked) {
                this.player.position.xPosition -= 200;
                this.player.lives -= 1;
                this.scorePoints -= Math.floor(Math.random() * 100 + 40);
                this.player.isTaked = true;
              }

              setTimeout(() => {
                this.player.isTaked = false;
              }, 3000);
            }
          }
        }
      });
      this.bones.forEach((bone) => {
        const colXbone =
          bone.position.xPosition < this.player.position.xPosition + this.player.widthImg &&
          bone.position.xPosition + bone.widthImg - this.player.widthImg > this.player.position.xPosition;

        const colYbone = bone.position.yPosition < this.player.position.yPosition + this.player.heightImg;

        if (colXbone && colYbone) {
          if (this.player.lives > 0) {
            bone.isSpiritBombCollided = true;
            this.player.takedHit = true;
            if (!this.player.isTaked) {
              this.player.lives -= 1;
              this.scorePoints -= Math.floor(Math.random() * 100 + 40);
              this.player.isTaked = true;
            }

            setTimeout(() => {
              this.player.isTaked = false;
            }, 3000);
          }
        }
      });
    }
  }

  clear() {
    CTX.clearRect(this.x, this.y, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.player.spiritBombs = this.player.spiritBombs.filter((bomb) => !bomb.isSpiritBombCollided);

    this.monsters = this.monsters.filter((monster) => !monster.isMonsterOut);
    this.bones = this.bones.filter((bone) => !bone.isSpiritBombCollided);

    this.bats = this.bats.filter((bat) => !bat.isBatOut);
    this.finalBats = this.finalBats.filter((bat) => !bat.isBatOut);
  }

  pauseGame() {
    clearInterval(this.interval);
    this.interval = undefined;
    this.pause = true;

    this.pauseInterval = setInterval(() => {
      this.clear();
      this.display.gamePaused();
    }, 1000 / 60);
  }

  gameOver() {
    this.player.isWinner = true;
    if (this.boss.isBossDead) {
      this.display.bats_Freed = this.batFreed;
      this.display.monsters_Killed = this.monstersKilled;
      this.display.name = this.namePlayer;
      this.display.score = this.scorePoints;

      this.display.ghostWon();

      sounds.finalBats.stop();
      sounds.backgoundSoundBattle.stop();

      if (!this.stop) {
        sounds.backgoundSoundWin.play();
        this.stop = true;
      }

      this.setLocalStorage();
    }
  }

  setLocalStorage() {
    if (!this.storage) {
      this.score.push({
        name: this.namePlayer,
        score: this.scorePoints,
        bats: this.batFreed,
        zombies: this.monstersKilled,
      });

      if (localStorage.getItem("score")) {
        this.score = JSON.parse(localStorage.getItem("score"));

        this.score = [
          ...this.score,
          {
            name: this.namePlayer,
            score: this.scorePoints,
            bats: this.batFreed,
            zombies: this.monstersKilled,
          },
        ];

        localStorage.setItem("score", JSON.stringify(this.score));
      } else {
        localStorage.setItem("score", JSON.stringify(this.score));
      }

      this.storage = true;
    }
  }

  displayStatus() {
    this.display.bats_Freed = this.batFreed;
    this.display.monsters_Killed = this.monstersKilled;
    this.display.name = this.namePlayer;
    this.display.score = this.scorePoints;
    this.display.displaying();

    if (this.player.isDead) this.display.ghostIsDead();

    if (!this.boss.isBossAppear && this.isFinal) this.display.bossAppears();
  }
}
