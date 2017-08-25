"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var formats = [{
    regex: /\*([^\*]+)\*/,
    replacer: function replacer(m, p1) {
        return "%c" + p1 + "%c";
    },
    styles: function styles() {
        return ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', ''];
    }
}, {
    regex: /\_([^\_]+)\_/,
    replacer: function replacer(m, p1) {
        return "%c" + p1 + "%c";
    },
    styles: function styles() {
        return ['font-weight: bold', ''];
    }
}, {
    regex: /\[c\=(?:\"|\')?((?:(?!(?:\"|\')\]).)*)(?:\"|\')?\]((?:(?!\[c\]).)*)\[c\]/,
    replacer: function replacer(m, p1, p2) {
        return "%c" + p2 + "%c";
    },
    styles: function styles(match) {
        return [match[1], ''];
    }
}];

var logger = {};

var levels = ['debug', 'info', 'warn', 'error'];

levels.forEach(function (level) {
    logger[level] = function () {
        var args = void 0;
        args = [];
        makeArray(arguments).forEach(function (arg) {
            if (typeof arg === 'string') {
                return args = args.concat(stringToArgs(arg));
            } else {
                return args.push(arg);
            }
        });

        var stack = new Error().stack;

        var line = stack.split('\n')[2];
        var infoIndex = line.indexOf("eval at ");
        var clean = line.slice(infoIndex + 8, line.length).split(' ')[0];

        return console[level].apply(console, makeArray(args));
    };
});

var makeArray = function makeArray(arrayLikeThing) {
    return Array.prototype.slice.call(arrayLikeThing);
};

var hasMatches = function hasMatches(str) {
    var _hasMatches = void 0;
    _hasMatches = false;
    formats.forEach(function (format) {
        if (format.regex.test(str)) {
            return _hasMatches = true;
        }
    });
    return _hasMatches;
};

var getOrderedMatches = function getOrderedMatches(str) {
    var matches = void 0;
    matches = [];
    formats.forEach(function (format) {
        var match = void 0;
        match = str.match(format.regex);
        if (match) {
            return matches.push({
                format: format,
                match: match
            });
        }
    });
    return matches.sort(function (a, b) {
        return a.match.index - b.match.index;
    });
};

var stringToArgs = function stringToArgs(str) {
    var firstMatch = void 0,
        matches = void 0,
        styles = void 0;
    styles = [];
    while (hasMatches(str)) {
        matches = getOrderedMatches(str);
        firstMatch = matches[0];
        str = str.replace(firstMatch.format.regex, firstMatch.format.replacer);
        styles = styles.concat(firstMatch.format.styles(firstMatch.match));
    }
    return [str].concat(styles);
};

exports.default = logger;
var log = exports.log = logger.debug;