const chai = require('chai');
const { expect } = chai;
const { stub } = require('sinon');
const { utils: { createRequestObject } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/createRequestObject', function () {

  beforeEach(function () {
    this.XMLHttpRequest = XMLHttpRequest;
  });

  afterEach(function () {
    global.XMLHttpRequest = this.XMLHttpRequest;
  });

  it('returns an XMLHttpRequest instance when the XMLHttpRequest constructor implements the withCredentials property');

  it('returns an XMLHttpRequest instance when the XMLHttpRequest constructor does not implement the withCredentials property and the XDomainRequest constructor is not available');

  it('returns an XDomainRequest instance when the XMLHttpRequest constructor does not implement the withCredentials property and the XDomainRequest constructor is available');

});
