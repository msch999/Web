The original Readme was changed, since it does not always make sense here.
----------------------------------------------------------------------------------

# Sokoban Level Generator (JavaScript)

[![npm](https://img.shields.io/npm/v/sokoban-generator.svg?maxAge=86400)](https://www.npmjs.com/package/sokoban-generator)

A procedural level generator for [Sokoban](https://en.wikipedia.org/wiki/Sokoban), written in JavaScript.
## Demo

[Play Sokoban created by this generator in action!](https://gamelets.anoxic.me/#sokoban-infinite)

The website above uses the default options for the generator, except that it specifies the initial position of the player. 

## Usage

```JavaScript 1.6
// es6
import {generateSokobanLevel} from sokoban-generator;
generateSokobanLevel();

The generator accepts an optional `options`, and can return either a [string representation of the level](http://sokobano.de/wiki/index.php?title=Level_format), or a [`grid`](https://github.com/AnoXDD/sokoban-generator-javascript/blob/master/src/grid.js) class. 

If will return `null` if no solution is found. Increasing `attempts` might help.

### Note

* Seed is only expected to generate the same map under the same options. This means, for example,  
`generateSokobanLevel({seed: 1, boxes: 2})`
and
`generateSokobanLevel({seed: 1, boxes: 3})`
will probably generate different levels.

## Performance

The time it takes to generate a level is greatly increased when the number of size and walls are increased. 

It took ~1 seconds to generate a result on default settings on a 2015 Ultrabook Laptop on Node, but it took only less than a second on [runkit](https://npm.runkit.com/sokoban-generator).

## License

GNU GPLv3