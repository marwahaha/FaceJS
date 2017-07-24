(function (global) {
    "use strict";
    
    // IMPORT TXT

    function checkForImports() {
        return document.querySelector('link[rel="import"]').import;
        // returns true if load corectly
    }

    function fileToArray(number) {
        if (checkForImports()) {
            // check if imports are supported by browser
            // if not returns empty array
            var link = document.querySelectorAll('link[rel="import"]')[number],
            content = link.import,
            el = content.getElementsByTagName("rect"),
            rectArray = Array.prototype.slice.call(el), // make a true array
            container = [];

            rectArray.forEach(
                function (el) {
                    var id = el.id, // id for eg. "R23C109"
                        color = el.style.fill, // color rgb
                        rowNumber = "",
                        colNumber = "",
                        signNumber = 1,
                        obj = {
                            color: color,
                            row: "",
                            col: ""
                        };

                    while (signNumber < id.indexOf("C")) {
                        rowNumber += id[signNumber];
                        signNumber += 1;
                    }

                    colNumber = id.slice(signNumber + 1);

                    obj.row = Number(rowNumber);
                    obj.col = Number(colNumber);

                    container.push(obj);
                }
            );

            return container;
            
        } else {
            return [];
        }
    }

    var colorId = [fileToArray(0), fileToArray(1), fileToArray(2)],
        button = document.querySelector("button"),
        idNumber = -1, // because next method adds 1 

    // MAKE A TABLE ROW
        
        stringSum = function() {
            var text = "";
            for (var i = 0, length = arguments.length; i < length; i++) {
                i === length - 1 ? text += arguments[i] : text += arguments[i] + " ";
            }
            return text;
        },

        rectClass = "rect-class",
        rectBgClass = stringSum(rectClass, "rect-bg-class"),
        rectMainClass = stringSum(rectClass, "rect-main-class"),
        
        // Google Indigo colors
        color_o = ["#E8EAF6", // 50
                "#C5CAE9", // 100
                "#9FA8DA", // 200
                "#7986CB", // 300
                "#5C6BC0", // 400
                "#3F51B5", // 500
                "#3949AB", // 600
                "#303F9F", // 700
                "#283593", // 800
                "#1A237E", // 900
                 ],
        // Google Blue Gray colors
        color = ["#ECEFF1", // 50
                "#CFD8DC", // 100
                "#B0BEC5", // 200
                "#90A4AE", // 300
                "#78909C", // 400
                "#607D8B", // 500
                "#546E7A", // 600
                "#455A64", // 700
                "#37474F", // 800
                "#263238", // 900
                 ],
        colorLength = color.length,
        random =  function (number) {
            return Math.floor(Math.random() * number);
        };

    // DISPLAY

    global.Display = function Display(target) {
        this.target = target;
        this.container = document.createElement("div");
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;

        this.size = function () {
            var ghost = document.createElement("td");
            ghost.className = rectClass;
            this.target.appendChild(ghost);
            // create ghost element for calculations from CSS

            var rows = Math.floor(this.height / ghost.clientWidth),
                cols = Math.floor(this.width / ghost.clientWidth);

            this.target.removeChild(ghost); // delete ghost element

            return { rows: rows, cols: cols };
        }; // can't be a auto run function bcause of target witch doesn't egsist before creating a Object

    }

    Display.prototype.grid = [];

    Display.prototype.gridCreate = function (parent) {
            var rect,
                size = this.size();

            for (var row = 0; row < size.rows; row += 1) {
                var container = [];
                for (var col = 0; col < size.cols; col += 1) {
                    var node = parent.childNodes[row]
                                     .childNodes[col],
                        rect = new Rect(node, rectBgClass, color[random(colorLength)]);

                    rect.id = "R" + row + "C" + col; 
                    rect.row = row;
                    rect.col = col;
                    rect.apply();
                    rect.click();

                    container.push(rect);
                }
                this.grid.push(container);
            }
    }

    Display.prototype.create = function () {
        if (checkForImports()) {
        
            var size = this.size();

            for(var row = 0; row < size.rows; row += 1) {
                var rowEl = document.createElement("tr");
                for (var col = 0; col < size.cols; col += 1) {
                    var colEl = document.createElement("td");
                    colEl.className = rectMainClass;                
                    rowEl.appendChild(colEl);
                }
                this.container.appendChild(rowEl);
            }

            this.target.appendChild(this.container);
            this.gridCreate(this.container);

            return this;
            
        } else {
            // if browser desn't suppor imports:
            var textStyle = stringSum("position:relative;",
                                      "top:25%;",
                                      "font-family:Georgia, Arial, sans-serif;",
                                      "text-align:center;"),
                text = stringSum("Ups! browser IMPORT element problem.<br>",
                                 "It can be CORS policy or your browser doesn\'t support IMPORT elements.<br>",
                                 "Try to use newer browser or virtual server.<br>",
                                 "Insted of this long message I could render a image.");
            this.target.innerHTML = '<p style="' + textStyle+ '">' + text + '</p>';
        }
    };

    // Creates DOM from array with rect objects
    // I cannot use this.target because grid() is an object (function). I must declare
    // this variable ealier.

    Display.prototype.random = function () {
        var my = this;
        idNumber = -1;
        
            my.grid.forEach(function(el) {
                el.forEach(function(el) {
                    el.color = color[random(colorLength)];
                    el.rectClass = rectBgClass;
                    el.apply();
                });
            })
    };

    Display.prototype.next = function () {
            idNumber++;
            idNumber = idNumber % 3;
        
        var my = this,
            size = this.size(),
            colorArray = colorId[idNumber],
            numberOfElements = colorArray.length;
        
        for (var el = 0; el < numberOfElements; el += 1) {
            var row = colorArray[el].row,
                col = colorArray[el].col,
                actualRectangle = my.grid[row][col];
            
            // !!!!!!!! actual rectangle is somtimes
            // !!!!!!!! undefined, how to fix it ?
            // KNOW ISSUE: my.grid[row][col] somtimes
            // looks for not existing rectangle in actual
            // viewport
            
            // I need to check is actualRectangle exist
            // because in small resolutions window size
            // is smaller than actual size of picture
            // and my.grid[row][col] is undefined
                
            if (actualRectangle) {
                actualRectangle.color = colorArray[el].color
                actualRectangle.rectClass = rectMainClass;
                actualRectangle.apply();
            }
        }
    };

    // RECT

    function Rect(el, rectClass, color) {
        this.rectClass = rectClass;
        this.color = color;
        this.element = el;
        this.id = ""
        this.row;
        this.col;
    }

    // Rect constructor creates new rectangle as an "td" element with unique color and class

    Rect.prototype.apply = function() {
        this.element.style.backgroundColor = this.color;
        this.element.className = this.rectClass;
    }
    
    Rect.prototype.click = function() {
        var my = this;
        my.element.addEventListener("click", function() {
            var text = "id: " + my.id, //+ ", class: " + my.rectClass,
                styleText = stringSum("background-color:" + color[random(colorLength)] + ";"
                                     ),
                styleId = stringSum("position:absolute;",
                                  "font-family:Arial,sans-serif;",
                                  "font-size:10px;",
                                  "text-align:center;",
                                  "border:1px solid black;",
                                  "border-radius:3px;",
                                  "padding:3px;",
                                  "background-color:rgba(255,255,255,0.8);",
                                  "min-width:55px;");
            
            // !!! left and top doesn't work
            
            my.element.innerHTML = '<div style="' + styleText + '"></div>' + 
            '<p style="' + styleId + '">' + text + '</p>';
            
            setTimeout(function() {   
                my.element.innerHTML = "";
            }, 3000);
        });
    };

}(this));