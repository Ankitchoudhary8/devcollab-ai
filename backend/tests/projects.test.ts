import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';

// Basic Phase 1 smoke tests. API integration tests come in Phase 2.
test('demo projects use distinct positive IDs', () => {
  const ids = projects.map((p) => p.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(ids.every((id) => Number.isInteger(id) && id > 0));
});

test('demo projects describe open roles and required skills', () => {
  assert.ok(projects.length >= 3);
  assert.ok(projects.every((p) => p.openRoles >= 0 && p.skills.length > 0));
});
