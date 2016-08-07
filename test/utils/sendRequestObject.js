const chai = require('chai');
const { expect } = chai;
const { mockXhr } = require('../factories');
const { utils: { sendRequestObject } } = require('../../');

chai.use(require('sinon-chai'));

describe('utils/sendRequestObject', function () {

  it('returns a promise when given (only) a valid XHR object shape', function () {
    const xhr = mockXhr();
    const req = {};
    const res = sendRequestObject(xhr, req);

    expect(res).to.be.instanceof(Promise);
  });

  it('calls the XHR object\'s open() method with the request\'s url and method and sets the XHR object\'s withCredentials property', function () {
    const xhr = mockXhr();
    const req = {
      method: 'GET',
      url: 'http://test.com',
      withCredentials: true
    };
    const res = sendRequestObject(xhr, req);

    expect(xhr.open).to.have.been.calledWith(req.method, req.url);
    expect(xhr.withCredentials).to.equal(req.withCredentials);
  });

  it('invokes the send() method of the given xhr object with the request\'s body', function () {
    const xhr = mockXhr();
    const req = { body: 'oh shit whaddup' };
    const res = sendRequestObject(xhr, req);

    expect(xhr.send).to.have.been.calledWith(req.body);
  });

  it('assigns the xhr.onload() method to accept the promise with the xhr object', function (done) {
    const xhr = mockXhr();
    const res = sendRequestObject(xhr, {});

    res.then(function (_xhr) {
      expect(_xhr).to.equal(xhr);
      done();
    });

    xhr.onload();
  });

  it('assigns the xhr.onerror() method to reject the promise with the error object', function (done) {
    const xhr = mockXhr();
    const res = sendRequestObject(xhr, {});

    res.catch(function (err) {
      expect(err).to.be.instanceof(Error);
      done();
    });

    xhr.onerror();
  });

});
