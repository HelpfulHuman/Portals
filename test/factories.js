const { stub } = require('sinon');

function noop () {}

exports.noop = noop;

exports.mockXhr = function () {
  return {
    open: stub(),
    send: stub(),
    onload: noop,
    onerror: noop,
    withCredentials: false
  };
}
