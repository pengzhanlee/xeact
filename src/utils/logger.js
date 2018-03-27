const formats = [{
  regex: /\*([^\*]+)\*/,
  replacer: function (m, p1) {
    return "%c" + p1 + "%c";
  },
  styles: function () {
    return ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', ''];
  }
}, {
  regex: /\_([^\_]+)\_/,
  replacer: function (m, p1) {
    return "%c" + p1 + "%c";
  },
  styles: function () {
    return ['font-weight: bold', ''];
  }
}, {
  regex: /\[c\=(?:\"|\')?((?:(?!(?:\"|\')\]).)*)(?:\"|\')?\]((?:(?!\[c\]).)*)\[c\]/,
  replacer: function (m, p1, p2) {
    return "%c" + p2 + "%c";
  },
  styles: function (match) {
    return [match[1], ''];
  }
}];

let logger = {};

const levels = ['debug', 'info', 'warn', 'error'];

levels.forEach((level) => {
  logger[level] = function () {
    let args;
    args = [];
    makeArray(arguments).forEach(function (arg) {
      if (typeof arg === 'string') {
        return args = args.concat(stringToArgs(arg));
      } else {
        return args.push(arg);
      }
    });

    let stack = new Error().stack;

    let line = stack.split('\n')[2];
    let infoIndex = line.indexOf("eval at ");
    let clean = line.slice(infoIndex + 8, line.length).split(' ')[0];

    return console[level].apply(console, makeArray(args));
  };
});

let makeArray = function (arrayLikeThing) {
  return Array.prototype.slice.call(arrayLikeThing);
};

let hasMatches = function (str) {
  let _hasMatches;
  _hasMatches = false;
  formats.forEach(function (format) {
    if (format.regex.test(str)) {
      return _hasMatches = true;
    }
  });
  return _hasMatches;
};

let getOrderedMatches = function (str) {
  let matches;
  matches = [];
  formats.forEach(function (format) {
    let match;
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

let stringToArgs = function (str) {
  let firstMatch, matches, styles;
  styles = [];
  while (hasMatches(str)) {
    matches = getOrderedMatches(str);
    firstMatch = matches[0];
    str = str.replace(firstMatch.format.regex, firstMatch.format.replacer);
    styles = styles.concat(firstMatch.format.styles(firstMatch.match));
  }
  return [str].concat(styles);
};

export default logger;

export let log = logger.debug;
