import Unit from './unit';
import TheGame from './thegame';
import Bullet from './bullet';

class Protagonist extends Unit {
    constructor() {
        super(...arguments);

        this._health = 100;
        this._damage = 10;
        this._maxSpeed = 25;

        this._fireSpeed = 5;
        this._fireing = false;
        this._fireFrameId = 0;
    }

    startFire() {
        let that = this;
        let start = Date.now();

        if (this._fireing) {
            return false;
        }

        this._fireing = true;

        (function fireFrame() {
            if (!that._fireing) {
                return;
            }

            if (!that.isAlive()) {
                that.stopFire();
                return;
            }

            let now = Date.now();
            let time = now - start;
            let shots = that._fireSpeed / 1000 * time;

            that._fireFrameId = TheGame.pushFrame(fireFrame);

            if (shots > 1) {
                start = now - (time % (1000 / that._fireSpeed));
                that.fire();
            }
        })();

        that.fire();

        return true;
    }

    stopFire() {
        this._fireing = false;
        TheGame.stopFrame(this._fireFrameId);
    }

    fire() {
        let bullet = new Bullet(this._game);
        let [curX, curY] = this.getCurrentPos();
        let [fwdX, fwdY] = this.getForwardPos(curX, curY, 1);

        bullet.setDirection(this.getDirection()); // same direction
        bullet.takePos(fwdX, fwdY); // position + 1

        bullet.moveForward(Math.round(Math.sqrt(bullet.getMaxSpeed())));

        bullet.startMoving();
    }
}

export default Protagonist;