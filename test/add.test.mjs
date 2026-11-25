import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add } from '../src/add.mjs';

test('add', () => {
  assert.equal(add(2, 3), 5);
});

// Check for gate 0.6.0: a test that fails must give the verdict fail.
test('add of negatives (fails on purpose)', () => {
  assert.equal(add(-2, -3), 5);
});
