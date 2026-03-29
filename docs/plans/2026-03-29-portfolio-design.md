# Portfolio Design

Date: 2026-03-29

## Goal

Create a personal portfolio website that can be deployed directly to GitHub Pages with minimal setup.

## Constraints

- No existing Git repository in the workspace
- Only a standalone `index.html` existed before this task
- The site should work as a static deployment without a build step
- The design should feel intentional and distinctive rather than like a generic resume page

## Chosen Approach

Build a single-page static portfolio in `index.html` with:

- inline CSS for styling
- inline JavaScript for light data rendering and reveal animations
- a single `portfolioData` object for easy customization

This was chosen over a framework setup because it matches GitHub Pages best and reduces friction for first publish.

## Information Architecture

1. Hero
2. About
3. Selected Work
4. Approach
5. Contact

## Visual Direction

Use an editorial dossier style:

- serif display typography
- warm paper background
- structured grid lines
- asymmetrical composition
- restrained motion

The goal is to feel like a personal studio site rather than a standard developer template.

## Notes

- The previous page was preserved at `archive/youth-in-refraction.html`.
- The homepage currently includes placeholder portfolio content that should be replaced before publishing.
