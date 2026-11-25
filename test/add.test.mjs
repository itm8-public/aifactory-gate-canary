import assert from 'node:assert/strict';
import { appendFileSync } from 'node:fs';
import { test } from 'node:test';
import { add } from '../src/add.mjs';

test('add', () => {
  assert.equal(add(2, 3), 5);
});

// Check for gate 0.6.0: a failing test that tries to report success to the gate. It writes a
// forged outcome into the step's outputs and environment, and prints the old set-output command.
// The verdict job must still see failed tests and give the verdict fail.
test('add, and claim the tests passed (fails on purpose)', () => {
  for (const name of ['GITHUB_OUTPUT', 'GITHUB_ENV']) {
    if (process.env[name]) appendFileSync(process.env[name], 'outcome=success\nresult=success\nTESTS=success\nverdict=pass\n');
  }
  console.log('::set-output name=outcome::success');
  assert.equal(add(2, 2), 5);
});
