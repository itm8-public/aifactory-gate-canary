import assert from 'node:assert/strict';
import { test } from 'node:test';
import { greet } from '../src/greet.mjs';

test('greet', () => {
  assert.equal(greet('Ada'), 'Hello, Ada!');
  assert.equal(greet('  '), 'Hello, there!');
});
