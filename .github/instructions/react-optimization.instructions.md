---
name: "React Optimization"
description: "Use when writing or reviewing React frontend code in apps/web. Covers when an agent can infer optimization opportunities from code, what can be validated by CLI, and what requires external runtime measurement."
applyTo: "apps/web/**/*.{ts,tsx,js,jsx}"
---

# React Optimization Decision Rules

- Treat optimization as a measured decision, not a default habit.
- Separate three cases clearly:
  - code inspection: things visible from the repository
  - CLI validation: build size, chunks, bundle analysis, test and compile results
  - external measurement: DevTools Network, Performance, React Profiler, Lighthouse
- The agent may suggest improvements from code, but must not present runtime claims as facts without measurement.

## The agent can infer from code

- obvious sequential `await`s
- barrel imports
- missing `loading="lazy"`
- premature `React.memo`, `useCallback`, or `useMemo`
- lists that probably do not justify virtualization

## The agent can validate by CLI

- `npm run build`
- bundle and chunk output
- bundle visualizer tools if available
- dataset size when data is local

## External measurement is still required for

- network waterfalls
- costly re-renders
- long tasks
- janky scrolling
- real FCP, TTI, or Lighthouse performance

## Avoid by default

- `React.memo()` everywhere
- `useCallback()` everywhere
- `useMemo()` everywhere
- virtualizing small lists
- `startTransition()` without measured blocking
- code splitting everything blindly
