import {test, expect} from "vitest"
import {updateMu, updateSigma2} from "./bandit";

test('test negative rewards decrease mu', () => {
  expect(
      updateMu([0, 0], [1, 1], [1, 0], -1)[0]
  ).to.be.lessThan(0);
});

test('test positive rewards increase mu', () => {
    expect(
        updateMu([0, 0], [1, 1], [1, 0], 1)[0]
    ).to.be.greaterThan(0);
});

test('test updates decrease variance', () => {
    expect(
        updateSigma2([0, 0], [1, 1], [1, 0], -1)[0]
    ).to.be.lessThan(1);
    expect(
        updateSigma2([0, 0], [1, 1], [1, 0], 1)[0]
    ).to.be.lessThan(1);
});
