'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('slide service', function() {
  it('registered the slides service', () => {
    assert.ok(app.service('slides'));
  });
});
