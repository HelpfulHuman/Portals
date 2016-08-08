const chai = require('chai');
const { expect } = chai;
const { stub } = require('sinon');
const { mockXhr } = require('../factories');
const { utils: { invokeErrorHandlers } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/invokeErrorHandlers', function () {

  it('invokes each error handler with the given error as the first argument', function () {
    const h = stub();
    const err = new Error('Failure...');
    const output = invokeErrorHandlers([h,h,h], null, err);

    expect(h).to.have.been.calledThrice.and.calledWith(err);
  });

  it('invokes each error handler with the given XHR object as the second argument', function () {
    const h = stub();
    const xhr = mockXhr();
    const output = invokeErrorHandlers([h,h,h], xhr, null);

    expect(h).to.have.been.calledThrice.and.calledWith(null, xhr);
  });

  it('returns a rejected promise that provides the error', function () {
    const h = stub();
    const err = new Error('Failure...');
    const output = invokeErrorHandlers([h,h,h], null, err);

    return output.catch(function (_err) {
      expect(_err).to.equal(err);
    });
  });

});
