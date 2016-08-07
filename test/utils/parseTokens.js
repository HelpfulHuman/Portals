const { expect } = require('chai');
const { utils: { parseTokens } } = require('../../');

describe('utils/parseTokens', function () {

  it('leaves the token in place if a matching key/value could not be found', function () {
    const res = parseTokens('Hello {name}', {});

    expect(res).to.equal('Hello {name}');
  });

  it('replaces a single token with the value from the matching object key', function () {
    const res = parseTokens('Hello {name}', { name: 'World' });

    expect(res).to.equal('Hello World');
  });

  it('replaces multiple tokens with the same name/key with the value from the matching object key', function () {
    const res = parseTokens('Hello {name} and {name}', { name: 'World' });

    expect(res).to.equal('Hello World and World');
  });

  it('replaces a multiple unique tokens with the values from the matching object keys', function () {
    const res = parseTokens('{greeting} {name}', {
      greeting: 'Hello',
      name: 'World'
    });

    expect(res).to.equal('Hello World');
  });

  it('resolves tokens with no spaces or many spaces in between the token brackets and the token name', function () {
    const res = parseTokens('{one} { two} {three } {  four  }', {
      one: 1, two: 2, three: 3, four: 4
    });

    expect(res).to.equal('1 2 3 4');
  });

});
