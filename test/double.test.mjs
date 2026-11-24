import assert from 'node:assert/strict';
import { test } from 'node:test';
import { double } from '../src/double.mjs';

test('double', () => {
  assert.equal(double(21), 42);
});
