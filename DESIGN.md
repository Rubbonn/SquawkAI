---
name: Cockpit Tech
colors:
  surface: '#001428'
  surface-dim: '#001428'
  surface-bright: '#253b53'
  surface-container-lowest: '#000f20'
  surface-container-low: '#031d34'
  surface-container: '#072138'
  surface-container-high: '#142b43'
  surface-container-highest: '#20364e'
  on-surface: '#d1e4ff'
  on-surface-variant: '#c5c6cd'
  inverse-surface: '#d1e4ff'
  inverse-on-surface: '#1b324a'
  outline: '#8f9097'
  outline-variant: '#45474d'
  surface-tint: '#bbc6e2'
  primary: '#bbc6e2'
  on-primary: '#263046'
  primary-container: '#1b263b'
  on-primary-container: '#828da7'
  inverse-primary: '#545e76'
  secondary: '#ffb86b'
  on-secondary: '#492900'
  secondary-container: '#ed9000'
  on-secondary-container: '#583300'
  tertiary: '#afc9ea'
  on-tertiary: '#17324d'
  tertiary-container: '#0a2742'
  on-tertiary-container: '#768fae'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#bbc6e2'
  on-primary-fixed: '#101b30'
  on-primary-fixed-variant: '#3c475d'
  secondary-fixed: '#ffdcbc'
  secondary-fixed-dim: '#ffb86b'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#683d00'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#afc9ea'
  on-tertiary-fixed: '#001d36'
  on-tertiary-fixed-variant: '#2f4865'
  background: '#001428'
  on-background: '#d1e4ff'
  surface-variant: '#20364e'
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
  technical-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  technical-xs:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the high-stakes environment of aeronautical navigation. It prioritizes rapid information processing, clarity under varying light conditions, and a sense of "mission-critical" reliability. 

The aesthetic is a hybrid of **Modern Minimalism** and **Functional Glassmorphism**. It evokes the feel of a modern glass cockpit—where every pixel has a purpose. The interface avoids decorative clutter, favoring structural hierarchy and subtle glowing affordances that guide the pilot's eye to active data streams. The emotional response is one of calm, technical authority and precision.

## Colors

The palette is optimized for "Night Mode" operations to reduce eye strain and preserve night vision. 

- **Primary (Deep Aviation Blue):** Used for structural elements, headers, and container backgrounds. It provides a stable, professional foundation.
- **Secondary (Safety Orange):** Reserved strictly for interactive affordances, active states, and critical alerts. Its high contrast against the blue base ensures immediate recognition.
- **Background (Dark Slate):** The deepest layer, providing maximum contrast for text and data overlays.
- **Text:** Pure white is used for primary data and headings, while light grey is utilized for secondary metadata and labels to establish a clear information hierarchy.

## Typography

Typography in this design system is divided into functional roles. **Hanken Grotesk** provides a sharp, contemporary look for headlines. **Inter** is the workhorse for chat interfaces and general documentation due to its exceptional legibility. 

**JetBrains Mono** is mandatory for all telemetry, coordinates, and system logs. The fixed character width ensures that numerical data (like altitude or airspeed) remains stable and readable even as values fluctuate rapidly. On mobile devices, headlines scale down by 20%, while technical data sizes remain constant to ensure safety standards are met.

## Layout & Spacing

The layout utilizes a **Fluid Grid** system designed for high-density information display. 

- **Desktop:** 12-column grid with 24px gutters. Sidebars are docked for quick access to chat and weather.
- **Tablet:** 8-column grid. The map remains the primary focus with collapsible panels.
- **Mobile:** 4-column grid. Bottom sheets are used for technical data to keep the thumb zone clear.

A 4px base unit (the "Click-Rhythm") governs all spacing. This ensures that touch targets are large enough for use in turbulent environments, while maintaining a compact, technical density.

## Elevation & Depth

This design system uses **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

- **Base Layer:** Background (#0D1B2A).
- **Surface Layer:** Deep Aviation Blue (#1B263B) with a 1px inner stroke of (#415A77) to define edges.
- **Overlay Layer (Glass):** Used for panels floating over the map. These utilize a background blur (12px) and 80% opacity of the Primary color.
- **Active State:** Elements in an "on" or "active" state feature a subtle outer glow (0px 0px 8px) using the Secondary Safety Orange color, mimicking illuminated cockpit switches.

## Shapes

The shape language balances modern software aesthetics with industrial hardware. All standard containers use a **0.5rem (8px)** corner radius. Larger card components and glass overlays use **1rem (16px)** to create a softer, more sophisticated look against the dark background. 

Input fields and buttons utilize the standard 8px radius, providing enough roundness to feel modern without losing the "technical" edge required by the brand personality.

## Components

- **Buttons:** Primary buttons are solid Safety Orange with black text for maximum visibility. Secondary buttons are outlined in Safety Orange with a transparent fill.
- **Data Chips:** Small, rectangular containers with JetBrains Mono text. Used for status indicators like "VFR", "IFR", or "GPS LOCKED". Use color-coding: Green for active, Orange for warning, Red for alert.
- **Technical Inputs:** Text fields should have a dark fill (#0D1B2A) and a 1px border. When focused, the border glows Safety Orange.
- **Instrument Cards:** Used for weather or engine data. These should feature a semi-transparent background when positioned over the map and include a small icon in the top-right for context.
- **Glass Overlays:** Used for the AI Chat interface. These must maintain a background blur to ensure text remains legible regardless of the map detail beneath it.
- **Icons:** Use thin-stroke, linear icons. Avoid filled icons unless they represent an active toggle state.