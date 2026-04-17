---
name: "TDD Workflow"
description: "Use when writing or modifying application code with TDD in backend or frontend. Covers Red Green Refactor, minimal implementation, TPP, and anti-patterns to avoid."
applyTo: "apps/**/*.{ts,tsx,js,jsx}"
---

# TDD Workflow

- Work in this order: REASON -> RED -> GREEN -> REFACTOR -> RE-EVALUATE.
- Start from the smallest meaningful behavior.
- Write one new test per cycle.
- In RED, make the test fail for the correct reason.
- Add only the minimum code needed to compile in RED.
- In GREEN, implement the simplest solution that makes the current test pass.
- Prefer the smallest TPP step available instead of jumping to a generalized design.
- In REFACTOR, improve naming, structure, and duplication only with tests green.
- Do not invent requirements that are not present in the request or code.
- Do not write production code before the test.
- Do not keep more than one new failing test at the same time.
- Do not introduce performance optimizations unless they are justified by measurement.
- Do not introduce mocks without approval.

## Quick checks

- Is this the smallest next test?
- Does the test fail or pass for the right reason?
- Did I add behavior the current test does not require?
- Am I refactoring for clarity rather than preference?
