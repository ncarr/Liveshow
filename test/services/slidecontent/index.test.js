'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('slidecontent service', function() {
  it('registered the slidecontents service', () => {
    assert.ok(app.service('slidecontents'));
  });
});
