// TODO: Enable moving middle faces

(function () {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var rubiksCube = window.Game.Cube = function (scene, camera, cubes) {
    this.cubes = cubes;
    this.animating = false;
    this.isSolved = false;

    this.r = {
      cubes: [],
      axis: 'x',
      vector: {
        startPos: new THREE.Vector3(cubeStartPos, cubeStartPos, (cubeStartPos + 100)),
        rayDir: new THREE.Vector3(0, 0, -1),
        sliceDir: { axis: 'y', mag: -1 } // TODO: make this a vector
      },
      dir: -1,
      middle: 'm'
    };

    this.l = {
      cubes: [],
      axis: 'x',
      vector: {
        startPos: new THREE.Vector3(-cubeStartPos, cubeStartPos, -(cubeStartPos + 100)),
        rayDir: new THREE.Vector3(0, 0, 1),
        sliceDir: { axis: 'y', mag: -1 }
      },
      dir: 1,
      middle: 'm'
    };

    this.u = {
      cubes: [],
      axis: 'y',
      vector: {
        startPos: new THREE.Vector3(-(cubeStartPos + 100), cubeStartPos, -cubeStartPos),
        rayDir: new THREE.Vector3(1, 0, 0),
        sliceDir: { axis: 'z', mag: 1 }
      },
      dir: -1,
      middle: 'e'
    };

    this.d = {
      cubes: [],
      axis: 'y',
      vector: {
        startPos: new THREE.Vector3(-(cubeStartPos + 100), -cubeStartPos, cubeStartPos),
        rayDir: new THREE.Vector3(1, 0, 0),
        sliceDir: { axis: 'z', mag: -1 }
      },
      dir: 1,
      middle: 'e'
    };

    this.b = {
      cubes: [],
      axis: 'z',
      vector: {
        startPos: new THREE.Vector3((cubeStartPos + 100), cubeStartPos, -cubeStartPos),
        rayDir: new THREE.Vector3(-1, 0, 0),
        sliceDir: { axis: 'y', mag: -1 }
      },
      dir: 1,
      middle: 's'
    };

    this.f = {
      cubes: [],
      axis: 'z',
      vector: {
        startPos: new THREE.Vector3(-(cubeStartPos + 100), cubeStartPos, cubeStartPos),
        rayDir: new THREE.Vector3(1, 0, 0),
        sliceDir: { axis: 'y', mag: -1 }
      },
      dir: -1,
      middle: 's'
    };

    this.m = {
      cubes: [],
      axis: 'x',
      vector: {
        startPos: new THREE.Vector3(0, cubeStartPos, (cubeStartPos + 100)),
        rayDir: new THREE.Vector3(0, 0, -1),
        sliceDir: { axis: 'y', mag: -1 }
      },
      dir: 1
    };

    this.e = {
      cubes: [],
      axis: 'y',
      vector: {
        startPos: new THREE.Vector3(-cubeStartPos, 0, (cubeStartPos + 100)),
        rayDir: new THREE.Vector3(0, 0, -1),
        sliceDir: { axis: 'x', mag: 1 }
      },
      dir: 1
    };

    this.s = {
      cubes: [],
      axis: 'z',
      vector: {
        startPos: new THREE.Vector3((cubeStartPos + 100), cubeStartPos, 0),
        rayDir: new THREE.Vector3(-1, 0, 0),
        sliceDir: { axis: 'y', mag: -1 }
      },
      dir: -1
    };

    this.possibleMoves = [
      'r', 'rPrime', 'l', 'lPrime', 'u', 'uPrime', 'd', 'dPrime', 'f', 'fPrime',
      'd', 'dPrime', 'b', 'bPrime'
    ].concat(sizeSpecificScrambles);
  };

  Game.Cube.moveToKeyMap = {
    b:            'q',
    bPrime:       'p',
    d:            's',
    down:         'y',
    dPrime:       'l',
    e:            'z',
    ePrime:       '/',
    f:            'h',
    fPrime:       'g',
    l:            'd',
    lDouble:      'c',
    lDoublePrime: 'r',
    left:         'a',
    lPrime:       'e',
    m:            'v',
    mPrime:       't',
    r:            'i',
    rDouble:      'u',
    rDoublePrime: 'm',
    right:        ';',
    rPrime:       'k',
    u:            'j',
    up:           'n',
    uPrime:       'f',
    s:            'o',
    sPrime:       'w'
  };

  Game.Cube.keyToMoveMap = {
    a:   'left',
    c:   'lDouble',
    d:   'l',
    e:   'lPrime',
    f:   'uPrime',
    g:   'fPrime',
    h:   'f',
    i:   'r',
    j:   'u',
    k:   'rPrime',
    l:   'dPrime',
    m:   'rDoublePrime',
    n:   'up',
    o:   's',
    p:   'bPrime',
    q:   'b',
    r:   'lDoublePrime',
    s:   'd',
    t:   'mPrime',
    u:   'rDouble',
    v:   'm',
    w:   'sPrime',
    y:   'down',
    z:   'e',
    ';': 'right',
    '/': 'ePrime'
  };

  rubiksCube.prototype.animate = function (rotatingFace, axis, dir) {
    // rotatingFace is an Object3D parent containing all cubes on a given face
    var id = requestAnimationFrame(function () {
      this.animate(rotatingFace, axis, dir);
      renderer.render(scene, camera);
    }.bind(this));

    rotatingFace.rotation[axis] += dir * (Math.PI / 2) / 8;
    renderer.render(scene, camera);

    if (rotatingFace.rotation[axis] >= Math.PI / 2 ||
        rotatingFace.rotation[axis] <= -Math.PI / 2) {
      this.finishAnimation(rotatingFace, id);
    }
  };

  // TODO: prototypify this on THREE.Color
  rubiksCube.prototype.colorToString = function (color) {
    if (color.equals(new THREE.Color(1, 1, 1)))  return 'U';
    if (color.equals(new THREE.Color(1, 0, 0)))  return 'R';
    if (color.equals(new THREE.Color(0, 1, 0)))  return 'F';
    if (color.equals(new THREE.Color(0, 0, 1)))  return 'D';
    if (color.equals(new THREE.Color(1, .5, 0))) return 'L';
    if (color.equals(new THREE.Color(1, 1, 0)))  return 'B';
  };

  rubiksCube.prototype.finishAnimation = function (rotatingFace, id) {
    cancelAnimationFrame(id);

    // Detach cubes from rotatingFace before removing rotatingFace from scene
    while (rotatingFace.children.length > 0) {
      THREE.SceneUtils.detach(rotatingFace.children[0], rotatingFace, scene);
    }
    scene.remove(rotatingFace);
    this.animating = false;
    this._updateSolveState();
  };

  rubiksCube.prototype.getColorsOfFace = function (face) {
    var cubesToRotate = this.captureCubes(
      this[face].vector.startPos.clone(),
      this[face].vector.rayDir,
      this[face].vector.sliceDir
    );
    var point = new THREE.Vector3();
    var cube, dir, ray, intersects;
    var colors = [];

    for (var i = 0; i < cubesToRotate.length; i++) {
      cube = cubesToRotate[i].position;
      point[this[face].axis] = (startPos + 300) * -  this[face].dir;
      dir = cube.clone().sub(point).normalize();
      ray = new THREE.Raycaster(point, dir);
      intersects = ray.intersectObjects(scene.children);
      colors.push(intersects[0].face.color);
    }

    return colors;
  };

  rubiksCube.prototype.move = function (name) {
    this.isSolved = false;
    this.animating = true;

    var axis, resetCallback;
    var dir = 1;
    var cubesToRotate = [];

    if (['up', 'down', 'right', 'left'].indexOf(name) > -1) {
      cubesToRotate = cubes;

      if (name === 'left') {
        axis = 'y';
      } else if (name === 'right') {
        axis = 'y';
        dir = -1;
      } else if (name === 'up') {
        axis = 'x';
      } else if (name === 'down') {
        axis = 'x';
        dir = -1;
      }

    } else {
      var face = name[0];
      axis = this[face].axis;
      dir = this[face].dir;
      if (name.indexOf('Prime') > -1) {
        dir *= -1;
      }

      if (['m', 'e', 's'].indexOf(face) > -1 && cubeDimensions % 2 === 0) {
        var rightMiddle = this[face].vector.startPos.clone();
        var leftMiddle = this[face].vector.startPos.clone();
        rightMiddle[this[face].axis] += cubieSize * this[face].dir;
        leftMiddle[this[face].axis] -= cubieSize * this[face].dir;

        cubesToRotate = this.captureCubes(
          rightMiddle,
          this[face].vector.rayDir,
          this[face].vector.sliceDir
        );
        moreCubesToRotate = this.captureCubes(
          leftMiddle,
          this[face].vector.rayDir,
          this[face].vector.sliceDir
        );
        cubesToRotate = cubesToRotate.concat(moreCubesToRotate);
      } else {
        cubesToRotate = this.captureCubes(
          this[face].vector.startPos.clone(),
          this[face].vector.rayDir,
          this[face].vector.sliceDir
        );
        if (name.indexOf('Double') > -1) {
          var startPos = this[face].vector.startPos.clone();
          startPos[this[face].axis] += cubieSize * this[face].dir;
          var doubleCubes = this.captureCubes(
            startPos,
            this[face].vector.rayDir,
            this[face].vector.sliceDir
          );

          if (doubleInclusive) {
            cubesToRotate = cubesToRotate.concat(doubleCubes);
          } else {
            cubesToRotate = doubleCubes;
          }
        }
      }
    }

    var rotatingFace = new THREE.Object3D();
    for (var i = 0; i < cubesToRotate.length; i++) {
      THREE.SceneUtils.attach(cubesToRotate[i], scene, rotatingFace);
    }
    scene.add(rotatingFace);
    this.animate(rotatingFace, axis, dir);
  };

  rubiksCube.prototype.oppositeMove = function (name) {
    if (name === 'left') return 'right';
    if (name === 'right') return 'left';
    if (name === 'up') return 'down';
    if (name === 'down') return 'up';

    var oppMove = name[0];
    if (name.indexOf('Double') > -1) {
      oppMove += 'Double';
    }
    if (name.indexOf('Prime') < 0) {
      oppMove += 'Prime';
    }
    return oppMove
  };

  rubiksCube.prototype.randomMove = function () {
    return this.possibleMoves[~~(Math.random() * this.possibleMoves.length)];
  };

  rubiksCube.prototype.solve = function () {
    return Cube.fromString(this.stringifyFaces());
    return cube.solve();
  };

  rubiksCube.prototype.stringifyFaces = function () {
    var u = this.getColorsOfFace('u');
    var r = this.getColorsOfFace('r');
    var f = this.getColorsOfFace('f');
    var d = this.getColorsOfFace('d');
    var l = this.getColorsOfFace('l');
    var b = this.getColorsOfFace('b');

    var uString = '';
    var rString = '';
    var fString = '';
    var dString = '';
    var lString = '';
    var bString = '';

    for (var i = 0; i < u.length; i++) {
      uString += this.colorToString(u[i]);
      rString += this.colorToString(r[i]);
      fString += this.colorToString(f[i]);
      dString += this.colorToString(d[i]);
      lString += this.colorToString(l[i]);
      bString += this.colorToString(b[i]);
    }
    return uString + rString + fString + dString + lString + bString;
  };

  rubiksCube.prototype.captureCubes = function (startPos, rayDir, sliceDir) {
    var allCaptures = [];
    var capturedCubes = [];
    var raycaster;

    for (var i = 0; i < cubeDimensions; i++) {
      raycaster = new THREE.Raycaster(startPos, rayDir);
      allCaptures = allCaptures.concat(raycaster.intersectObjects(scene.children));

      var newPos = (cubieSize + cubieOffset) * sliceDir.mag;
      startPos[sliceDir.axis] += newPos;
    }

    for (var i = 0; i < allCaptures.length; i++) {
      // make sure captured object is a 'cubie', no duplicates
      if (allCaptures[i].object.name === "cubie" &&
          capturedCubes.indexOf(allCaptures[i].object) === -1) {
        capturedCubes.push(allCaptures[i].object);
      }
    }
    return capturedCubes;
  };

  rubiksCube.prototype._updateSolveState = function () {
    if (this.animating) {
      this.isSolved = false;
    }
    var rightFace = this.getColorsOfFace('r');
    var upFace = this.getColorsOfFace('u');
    var frontFace = this.getColorsOfFace('f');

    if (this._colorsAreSame(rightFace) &&
        this._colorsAreSame(frontFace) &&
        this._colorsAreSame(upFace)) {
      this.isSolved = true;
    }
  };

  rubiksCube.prototype._colorsAreSame = function (colors) {
    var firstColor = colors[0];
    var testColor;
    for (var i = 1; i < colors.length; i++) {
      testColor = colors[i];

      if (!firstColor.equals(colors[i])) {
        return false;
      }
    }
    return true;
  };
})();
