(function () {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var EventHandler = window.Game.EventHandler = function (cube, game) {
    this.cube = cube;
    this.game = game;
    window.addEventListener('keyup', this.handleEvents.bind(this), false);
  };

  EventHandler.prototype.handleEvents = function (key) {
    var that = this;
    switch (key.keyCode) {
      case 32:
        if (this.game.timing) {
          this.game.endTimer();
        } else {
          this.cube.scramble();
          this.game.startTimer();
        }
        break;
      case 65:
        that.cube.seeLeft();
        break;
      case 67:
        that.cube.doubleL();
        break;
      case 68:
        that.cube.l();
        break;
      case 69:
        that.cube.lPrime();
        break;
      case 70:
        that.cube.uPrime();
        break;
      case 71:
        that.cube.fPrime();
        break;
      case 72:
        that.cube.f();
        break;
      case 73:
        that.cube.r();
        break;
      case 74:
        that.cube.u();
        break;
      case 75:
        that.cube.rPrime();
        break;
      case 76:
        that.cube.dPrime();
        break;
      case 77:
        that.cube.doubleRPrime();
        break;
      case 78:
        that.cube.seeUp();
        break;
      case 82:
        that.cube.doubleLPrime();
        break;
      case 83:
        that.cube.d();
        break;
      case 85:
        that.cube.doubleR();
        break;
      case 89:
        that.cube.seeDown();
        break;
      case 186:
        that.cube.seeRight();
        break;
    }
    this.game.draw();
  };
})();
