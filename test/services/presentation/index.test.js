'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('presentation service', function() {
  it('registered the presentations service', () => {
    assert.ok(app.service('presentations'));
  });
});
