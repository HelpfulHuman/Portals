global.expect  = require('chai').expect;
global.sinon   = require('sinon');
global.portals = require('../portals')

/**
 * @beforeEach
 */
beforeEach(function () {
  // stub xhr
  this.xhr = sinon.useFakeXMLHttpRequest();
  global.XMLHttpRequest = this.xhr;

  // array for storing made requests
  this.requests = [];

  // push requests onto our requests array
  this.xhr.onCreate = function (xhr) {
    this.requests.push(xhr);
  }.bind(this);
});

/**
 * @afterEach
 */
afterEach(function () {
  // put xhr back
  delete global.XMLHttpRequest;
  this.xhr.restore();
});
