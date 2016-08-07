const { expect } = require('chai');
const { interceptors: { assumeContentType } } = require('../../');

describe('interceptors/assumeContentType', function () {

  it('leaves the Content-Type header alone if it doesn\'t know how to resolve it');

  it('sets the Content-Type header to multipart/form-data if the request body is a FormData instance');

  it('sets the Content-Type header to application/xml if the body is a string that starts with "<"');

});
