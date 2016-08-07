const { expect } = require('chai');
const { interceptors: { assumeContentType } } = require('../../');

describe('interceptors/assumeContentType', function () {

  before(function () {
    global.FormData = function FormData () {}
  });

  after(function () {
    delete global.FormData;
  });

  it('leaves the Content-Type header alone if it doesn\'t know how to resolve it', function () {
    const input = { headers: {}, body: '' };
    const output = assumeContentType(input);

    expect(output).to.equal(input);
  });

  it('sets the Content-Type header to multipart/form-data if the request body is a FormData instance', function () {
    const form = new FormData();
    const input = { headers: {}, body: form };
    const output = assumeContentType(input);

    expect(output.headers['Content-Type']).to.equal('multipart/form-data');
  });

  it('sets the Content-Type header to application/xml if the body is a string that starts with "<"', function () {
    const input = { headers: {}, body: '<?xml>' };
    const output = assumeContentType(input);

    expect(output.headers['Content-Type']).to.equal('application/xml');
  });

});
