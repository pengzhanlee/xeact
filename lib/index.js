'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configure = require('./configure');

Object.defineProperty(exports, 'configure', {
  enumerable: true,
  get: function get() {
    return _configure.configure;
  }
});

var _methods = require('./methods');

Object.defineProperty(exports, 'exposed', {
  enumerable: true,
  get: function get() {
    return _methods.exposed;
  }
});

var _attributes = require('./attributes');

Object.defineProperty(exports, 'observed', {
  enumerable: true,
  get: function get() {
    return _attributes.observed;
  }
});

var _events = require('./events');

Object.defineProperty(exports, 'dispatchEvent', {
  enumerable: true,
  get: function get() {
    return _events.dispatchEvent;
  }
});

var _register = require('./reactImpl/register');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _register.register;
  }
});