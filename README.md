# befunge-93-interpreter

A javascript interpreter for the Befunge-93 programming language. Originally written as a solution to a codewars challenge.

According to the language's documentation, Befunge-93 is a, "Twisted, Deranged Programming Language in the Tradition of brainfuck and FALSE". The source code is a series of single character commands written on a 2d plane. This means unlike traditional languages where code is read left to right, in Befunge-93 code can be read in any direction on the 2d plane (up, down, left, right) depending on which direction commands are given. Read the languages full documentation at: https://github.com/catseye/Befunge-93/blob/master/doc/Befunge-93.markdown

The interpreter is in the form of a nodejs javascript module. Once required the interpreter has a single function 'execute' which takes a string containing the Befunge-93 source code, and returns the output in the form of a string. The following will return "Hello world!"

```javascript
var befunge = require('befunge-93-interpreter');
befunge.execute('"!dlrow olleH">,:v' + "\n" + '              ^  _@');
````
