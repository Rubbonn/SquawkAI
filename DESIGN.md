---
name: Cockpit Tech
colors:
  bg-app: '#001428'
  bg-sidebar: '#031d34'
  bg-surface: '#072138'
  bg-elevated: '#1b263b'
  text-primary: '#d1e4ff'
  text-secondary: '#c5c6cd'
  text-muted: '#828da7'
  accent: '#ffb86b'
  accent-strong: '#ed9000'
  accent-on: '#2c1700'
  border-default: '#45474d'
  border-strong: '#8f9097'
  error: '#ffb4ab'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  technical:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 4px
  md: 8px
  lg: 1rem
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
---

## Brand & Style

Cockpit Tech is a compact dark UI for fast scanning and operational clarity. The visual language is technical and calm: dark layers for structure, orange only for interaction, and monospaced typography for telemetry.

## Rules

- Use semantic color tokens only from this file. Avoid hardcoded hex values in feature components.
- Keep interaction states consistent: hover, focus, active always derive from accent tokens.
- Use 4px spacing rhythm (`xs/sm/md/lg/xl`) and only three radii (`sm/md/lg`).
- Use `Inter` for regular UI text, `Hanken Grotesk` for titles, and `JetBrains Mono` for technical values.

## Components

- Buttons:
  - Primary: solid `accent`, text `accent-on`, hover `accent-strong`.
  - Secondary: transparent background, 1px `accent` border, text `accent`.
- Inputs:
  - Background `bg-elevated`, border `border-default`, text `text-secondary`.
  - Focus: border `accent` + soft focus ring.
- Menu items:
  - Default text `text-secondary`.
  - Hover background `bg-elevated`.
  - Active background `accent-strong`, text `accent-on`, subtle orange glow.
- Cards:
  - Background `bg-surface`, 1px `border-default`, radius `lg`, padding `md`.
- Highlights:
  - Light orange tint + left border in `accent`.