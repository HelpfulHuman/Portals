const chai = require('chai');
const { expect } = chai;
const { stub } = require('sinon');
const { utils: { invokeErrorHandlers } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/invokeErrorHandlers', function () {

  it('invokes each error handler with the given error as the first argument');

  it('invokes each error handler with the given XHR object as the second argument');

  it('returns a rejected promise that provides the error');

});
