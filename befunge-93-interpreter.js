//Private variables

var instructionSet = {};
var DIRECTION_LEFT = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_UP = 2;
var DIRECTION_DOWN = 3;

var MODE_STANDARD = 0;
var MODE_STRING = 1;

//Public functions

function BefungeInterpreter() {
	init.call(this);
}

BefungeInterpreter.prototype.execute = function (str) {
	this.instructions = getInstructions(str);
	while(!this.executionComplete) {
    if(this.mode === MODE_STRING) {
      if(this.instructions[this.y][this.x] === '"') {
        instructionSet[this.instructions[this.y][this.x]].call(this);
      } else {
        this.stack.push(this.instructions[this.y][this.x].charCodeAt(0));
      }
      
    }
		else {
      instructionSet[this.instructions[this.y][this.x]].call(this);
    }
		moveToNextPosition.call(this);
	}
  
  var output = this.output;
	init.call(this);

	return output;
};

//Private functions

function init () {
  this.stack = [];
  this.direction = DIRECTION_RIGHT;
  this.mode = MODE_STANDARD;
  this.x = 0;
  this.y = 0;
  this.output = '';
  this.executionComplete = false;
	this.instructions = [];
}

function getInstructions (str) {
  var instructions = [[]];
  var currentInstructionList = instructions[0];
  var inputChars = str.split('');
  while(inputChars.length > 0) {
    var currentChar = inputChars.shift();
    var isValidInstruction = false;
    if(currentChar === "\n") {
      instructions.push([]);
      currentInstructionList = instructions[instructions.length - 1];
    } else {
      currentInstructionList.push(currentChar);
    }
  }
  
  return instructions;
}

function moveToNextPosition () {
  var width = this.instructions[this.y].length - 1;
  var height = this.instructions.length - 1;
  switch(this.direction) {
  case DIRECTION_RIGHT:
    this.x = (this.x === width ? 0 : this.x + 1);
    break;
  case DIRECTION_LEFT:
    this.x = (this.x === 0 ? width : this.x - 1);
    break;
  case DIRECTION_DOWN:
    this.y = (this.y === height ? 0 : this.y + 1);
    break;
  case DIRECTION_UP:
    this.y = (this.y === 0 ? height : this.y - 1);
    break;
  }
};

function addInstruction(symbol, executor) {
	instructionSet[symbol] = executor;
}

for(var i = 0; i <= 9; i++) {
  (function (i) {
    addInstruction(i.toString(), function () {
      this.stack.push(i);
    });      
  } (i));
}
addInstruction('+', function () {
  this.stack.push(this.stack.pop() + this.stack.pop());
});
addInstruction('-', function () {
  var a = this.stack.pop();
  var b = this.stack.pop();
  this.stack.push(b - a);
});
addInstruction('*', function () {
  this.stack.push(this.stack.pop() * this.stack.pop());
});
addInstruction('/', function () {
  var a = this.stack.pop();
  var b = this.stack.pop();
  if(a === 0) {
    this.stack.push(0);
  } else {
    this.stack.push(Math.floor(b / a));
  }
});
addInstruction('%', function () {
  var a = this.stack.pop();
  var b = this.stack.pop();
  if(a === 0) {
    this.stack.push(0);
  } else {
    this.stack.push(b % a);
  }
});
addInstruction('!', function () {
  this.stack.push(this.stack.pop() === 0 ? 1 : 0);
});
addInstruction('`', function () {
  var a = this.stack.pop();
  var b = this.stack.pop();
  this.stack.push(b > a ? 1 : 0);
});
addInstruction('>', function () {
  this.direction = DIRECTION_RIGHT;
});
addInstruction('<', function () {
  this.direction = DIRECTION_LEFT;
});
addInstruction('^', function () {
  this.direction = DIRECTION_UP;
});
addInstruction('v', function () {
  this.direction = DIRECTION_DOWN;  
});
addInstruction('?', function () {
  this.direction = (Math.floor(Math.random() * 4));
});
addInstruction('_', function () {
  this.direction = (this.stack.pop() === 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
});
addInstruction('|', function () {
  this.direction = (this.stack.pop() === 0 ? DIRECTION_DOWN : DIRECTION_UP);
});
addInstruction('"', function () {
  this.mode = (this.mode === MODE_STANDARD ? MODE_STRING : MODE_STANDARD);
});
addInstruction(':', function () {
  if(this.stack.length === 0) {
    this.stack.push(0);
  } else {
    this.stack.push(this.stack[this.stack.length - 1]);
  }
});
addInstruction('\\', function () {
  var a = this.stack[this.stack.length - 1];
  var b = (typeof this.stack[this.stack.length - 2] === 'undefined' ? 0 : this.stack[this.stack.length - 2]);
  this.stack[this.stack.length - 1] = b;
  this.stack[this.stack.length - 2] = a;
});
addInstruction('$', function () {
  this.stack.pop();
});
addInstruction('.', function () {
  this.output += this.stack.pop().toString();
});
addInstruction(',', function () {
  this.output += String.fromCharCode(this.stack.pop());
});
addInstruction('#', function () {
  moveToNextPosition.call(this);
});
addInstruction('p', function () {
  var y = this.stack.pop();
  var x = this.stack.pop();
  var v = this.stack.pop();
  
  var value = String.fromCharCode(v);
  
  //We store ints as ints not strings, so need to know if
  //value is an integer or not
  if(parseInt(value) == value) {
    this.instructions[y][x] = parseInt(value);
  } else {
    this.instructions[y][x] = value;
  }
});
addInstruction('g', function () {
  var y = this.stack.pop();
  var x = this.stack.pop();
  var char = this.instructions[y][x];
  
  this.stack.push(char.charCodeAt(0));
});
addInstruction('@', function () {
  this.executionComplete = true;
});
addInstruction(' ', function () {});

module.exports = new BefungeInterpreter();
  

