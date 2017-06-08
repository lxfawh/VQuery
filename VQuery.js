function bindEvent(ele, ev, handler) {
    if (ele.addEventListener) {
        ele.addEventListener(ev, handler);
    } else {
        ele.attachEvent('on' + ev, function () {
            handler.call(ele);
        }, false);
    }
}

function getByClass(parent, className) {
    var result = [];
    var childens = parent.getElementsByTagName('*');
    for (var i = 0; i < childens.length; i++) {
        if (childens[i].className == className) {
            result.push(childens[i]);
        }
    }
    return result;
}
function getStyle(ele, attr) {

    if (ele.currentStyle) {
        return ele.currentStyle[attr];
    } else if (getComputedStyle) {
        return getComputedStyle(ele)[attr];
    } else {
        return false;
    }

}
function addArr(arr1, arr2) {
    for (var i in arr2) {
        arr1.push(arr2[i]);
    }
}




function VQuery(args) {

    this.elements = [];
    switch (typeof args) {
        case 'function':
            bindEvent(window, 'load', args);
            break;
        case 'string':
            switch (args.charAt(0)) {
                case '#':
                    var ele = document.getElementById(args.substring(1));
                    this.elements.push(ele);
                    break;
                case '.':
                    this.elements = getByClass(document, args.substring(1));
                    break;
                default:
                    this.elements = document.getElementsByTagName(args);
                    break;
            }
            break;
        case 'object':
            this.elements.push(args);
            break;

    }
}

VQuery.prototype.on = function (ev, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        bindEvent(this.elements[i], ev, fn);
    }
    return this;
}
VQuery.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
}
VQuery.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
}
VQuery.prototype.hover = function (fnOver, fnOut) {
    for (var i = 0; i < this.elements.length; i++) {
        bindEvent(this.elements[i], 'mouseover', fnOver);
        bindEvent(this.elements[i], 'mouseout', fnOut);
    }
    return this;
}
VQuery.prototype.toggle = function (fn1, fn2) {
    var _args = arguments;
    for (var i = 0; i < this.elements.length; i++) {
        addToggle(this.elements[i]);
    }
    function addToggle(ele) {
        var count = 0;
        bindEvent(ele, 'click', function () {
            _args[count % _args.length].call(ele);
            count++;
        });
    }
    return this;
}
VQuery.prototype.attr = function (attr, val) {
    if (arguments.length == 2) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i][attr] = val;
        }
    } else {
        return this.elements[0][attr];
    }
    return this;
}
VQuery.prototype.css = function (attr, val) {
    if (arguments.length == 2) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = val;
        }
    } else {
        if (typeof attr == 'string') {
            return getStyle(this.elements[0], attr);
        } else {
            for (var i = 0; i < this.elements.length; i++) {
                for (var x in attr) {
                    this.elements[i].style[x] = attr[x];
                }
            }

        }

    }
    return this;
}

VQuery.prototype.eq = function (num) {
    return $(this.elements[num]);

}

VQuery.prototype.find = function (str) {
    var result = [];
    for (var i = 0; i < this.elements.length; i++) {
        switch (str.charAt(0)) {
            case '#':
                var ele = document.getElementById(str.substring(1));
                result.push(ele);
                break;
            case '.':
                var ele = getByClass(document, str.substring(1));
                addArr(result, ele);
                break;
            default:
                var ele = document.getElementsByTagName(str);
                addArr(result, ele);
                break;
        }
    }
    var $result = $();
    $result.elements = result;
    return $result;
}
VQuery.prototype.index = function () {
    var parent = this.elements[0].parentNode.children;
    for (var i = 0; i < parent.length; i++) {
        if (parent[i] == this.elements[0]) {
            return i;
        }
    }
}

// window.$ = VQuery;
function $(args) {
    return new VQuery(args);
}