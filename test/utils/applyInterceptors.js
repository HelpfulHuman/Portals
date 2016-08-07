const chai = require('chai');
const { expect } = chai;
const { mockXhr } = require('../factories');
const { spy, stub } = require('sinon');
const { utils: { applyInterceptors } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/applyInterceptors', function () {

  it('returns a promise that provides the initial value when no interceptors are set', function (done) {
    const val = {};
    const res = applyInterceptors([], null, val);

    expect(res).to.be.an.instanceof(Promise);

    res.then(function (_val) {
      expect(_val).to.equal(val);
      done();
    });
  });

  it('loops through each interceptor and provides the XHR object as the second argument', function (done) {
    const interceptor = stub().returns(null);
    const interceptors = [ interceptor, interceptor ];
    const xhr = mockXhr();
    const res = applyInterceptors(interceptors, xhr, null);

    res.then(function () {
      expect(interceptor).to.have.been.calledTwice
        .and.calledWith(null, xhr);
      done();
    });
  });

  it('pipes the output value from each interceptor into the next one following it', function () {
    const interceptor = spy(x => x + 5);
    const interceptors = [ interceptor, interceptor ];
    const res = applyInterceptors(interceptors, null, 0);

    res.then(function (val) {
      expect(interceptor).to.have.been.calledTwice;
      expect(interceptor.firstCall).to.have.been.calledWith(0);
      expect(interceptor.secondCall).to.have.been.calledWith(5);
      expect(val).to.equal(10);
      done();
    });
  });

  it('crashes the entire interceptor chain if a single interceptor fails');

});
