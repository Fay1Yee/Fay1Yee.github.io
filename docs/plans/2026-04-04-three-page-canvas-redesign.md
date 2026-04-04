# Three-Page Canvas Redesign

Date: 2026-04-04

## Goal

Restructure the site into three pages:

- Home
- Works
- About

The Home page should borrow the hanging-text mouse interaction logic from the reference site while using the new content `Hi i am Faye Zhou`.

## Chosen Direction

- Home: full-screen canvas interaction with hanging text and mouse-based rope disturbance
- Works: minimal card grid with the existing public projects
- About: compact profile page with focus areas and links

## Notes

- The reference site appears to use a canvas-based homepage rather than simple DOM text.
- The implementation here aims for behavioral similarity, not a pixel clone.
- The interaction is built with a custom canvas physics loop to keep the static GitHub Pages setup simple.
