const chai = require('chai');
const { expect } = chai;
const { stub } = require('sinon');
const { mockXhr } = require('../factories');
const { utils: { sendRequest } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/sendRequest', function () {

  beforeEach(function () {
    this.xhr = mockXhr();
    this.req = { method: 'GET', url: '/', headers: {} };
  });

  it('fails if a valid XHR object is not provided');

  it('runs the given request object through the list of request interceptors before opening and sending the XHR request');

  it('validates the result of the request object before opening and sending the XHR request');

  it('sends the XHR object\'s response to the response middleware chain');

  it('invokes the error middleware if an error occurs anywhere in the request chain before calling the subscribed .catch() function');

});
