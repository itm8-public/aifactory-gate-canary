import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add } from '../src/add.mjs';

test('add', () => {
  assert.equal(add(2, 3), 5);
});

// Check for gate 0.6.0: tests that never finish. The tests job stops at its 30-minute timeout and
// the verdict must not be pass.
test('add, slowly (never finishes)', async () => {
  await new Promise((resolve) => setTimeout(resolve, 45 * 60 * 1000));
  assert.equal(add(2, 3), 5);
});
