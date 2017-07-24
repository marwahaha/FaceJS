# FaceJS
Retro screen display

At first I prepered pictures in SVG in Inkscape. I made txt file with only <rect> tags.
In js I import TXT and take fill color and make from it an array. Then in create() method I make table rows and cols depends of size of parent. This create DOM structure. In gridCreate(parent) method take all Child structure from just created table and make an array of objects with fill color, actual element in DOM and some extra methods().

When I invoke next() method I just take colors from colorId array and paste it to DOM element style. I don't need to call for an specyfic DOM element because i store it in my objects.

This is why it is so fast in opposite to method with JQuery witch i used to made.

# CSS

Idea was to put all stiling elements to css. It is possible to change size of rectangles and animations only by use of CSS. Unfortunately in can't be done with fill colors (for now it is just too complicated, but possible).

# TO CREATE USE:
new Display(TARGET_ELEMENT).create();

Import ideas from article:
https://www.html5rocks.com/en/tutorials/webcomponents/imports/

# Some known issues
+ To use it correctly it must be done with virtual server. Imports doesn't work in   local.
+ Somehow first loaded txt return a error with undefined:
  my.grid[row][col] somtimes looks for not existing rectangle in actual viewport
  somehow I need to check is actualRectangle exist because in small resolutions window size is smaller than actual size of picture and my.grid[row][col] is undefined.

# Ideas
+ Could I make a import dynamically by creating object <link>
    - That need to be done with "load" method on window object
    - Ideas form article: if load dinamically uselink.onload and link.onerror think abotu async el.setAttribute("async, "")
+ Make true boolen from checkForImports() ??
+ save in coocies local storage of colors, it Will works faster if someone will enter site again.
+ change name of Display to be unique, because of the future reuse of this code.