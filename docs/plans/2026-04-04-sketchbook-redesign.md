# Sketchbook Redesign

Date: 2026-04-04

## Goal

Preserve the current one-page portfolio structure while shifting the visual language toward a hand-drawn sketchbook style inspired by the referenced Xiaohongshu note.

## Constraints

- Keep the existing information architecture intact
- Maintain GitHub Pages compatibility
- Improve visual balance without reducing readability
- Add p5.js motion without overwhelming the page

## Visual Direction

- Paper-like neutral background
- Floating browser-window framing
- Heavy serif headlines with typewriter-style labels
- More asymmetrical distribution of content blocks
- Light pencil-line details around the page edges

## Layout Changes

- Added hero margin cards to balance the left column
- Converted the right hero panel into a browser-like paper window
- Reworked the projects area into an asymmetrical exhibition-style layout
- Reframed process/about sections as field notes instead of generic cards

## Motion

- Added a fixed p5.js canvas behind the content
- Motion is limited to contour lines, branch-like pencil strokes, and light hatching
- Motion respects `prefers-reduced-motion`

## Outcome

The site now feels closer to a sketchbook or digital dossier while keeping the original content model and deployment workflow intact.
