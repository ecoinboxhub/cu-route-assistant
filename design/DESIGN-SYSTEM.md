---
name: Academic Institutional
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404942'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707a72'
  outline-variant: '#bfc9c0'
  surface-tint: '#206b48'
  primary: '#004429'
  on-primary: '#ffffff'
  primary-container: '#0b5d3b'
  on-primary-container: '#8ad4a8'
  inverse-primary: '#8dd6ab'
  secondary: '#52606e'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4f5'
  on-secondary-container: '#586674'
  tertiary: '#5b2f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c4300'
  on-tertiary-container: '#ffb575'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a8f3c6'
  primary-fixed-dim: '#8dd6ab'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#005232'
  secondary-fixed: '#d5e4f5'
  secondary-fixed-dim: '#b9c8d8'
  on-secondary-fixed: '#0e1d29'
  on-secondary-fixed-variant: '#3a4856'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Source Sans 3
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Source Sans 3
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-md:
    fontFamily: Source Sans 3
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, institutional aesthetic engineered for official university communication and operational guidance. Tailored for students, faculty, staff, and external stakeholders navigating the academic ecosystem, the interface prioritizes immediate clarity, verifiable routing paths, and rigorous functional trust.

The visual style blends **Corporate Modern** with **Institutional Functionalism**:

- Zero superfluous decorative graphics, gradients, floating shapes, or marketing hyperbole.
- High-density, structured information hierarchies that treat every response as an official departmental record.
- Strict reliance on systematic typography, fine 1px structural framing, and calm, academic contrast ratios meeting WCAG AAA for all essential text and WCAG AA for secondary metadata.
- An interface tone that is composed, objective, and scholarly — reassuring the user through precision, explicit source attributions, and structured action routes.

## Colors

The palette grounds the interface in classic collegiate sobriety, balancing a deep institutional green with deliberate architectural slates and rigorous semantic indicators.

### Key Roles

- **Primary Brand Green (`#0B5D3B`)**: Represents official university authorization. Used strictly for verified departmental markers, primary routing triggers, active tabs, and certified confirmation states.
- **Deep Slate / Secondary (`#2C3A47`)**: Structural foundation. Governs major system framing, primary section headers, formal metadata keys, and secondary navigation elements.
- **Warning & Abstention Amber (`#8A4B00`)**: Indicates unverified routing, off-hours inquiry status, pending deanery approval, or abstention protocols where an AI cannot verify canonical directory facts. Paired exclusively with `#FFFBEB` tint containers.
- **Neutral Dark (`#1F2937`)**: Reserved for standard body typography, conversational text streams, and interactive input characters to guarantee maximum legibility.

### Surface & Border Hierarchy

- **App / View Canvas**: `#F6F8FA` provides an eye-resting, glare-free institutional matte ground.
- **Component Surface**: `#FFFFFF` cards establish crisp elevation solely through separation and boundary line.
- **Structural Lines & Dividers**: `#E2E8F0` defines card shells, cell divisions, and field perimeters. `#D1D5DB` is reserved for hover or focus boundaries.
- **Muted Metadata**: `#64748B` applies to citations, timestamps, office numbers, and auxiliary instructional notes.

## Typography

The type system is powered entirely by **Source Sans 3** for its humanist clarity, institutional gravitas, and legibility across dense data tables, routing cards, and mobile screens. **JetBrains Mono** is utilized strictly as an auxiliary token for machine-readable records, tracking identifiers, reference codes, and direct routing hashes.

### Rules of Implementation

- **Case Conventions**: `label-sm` utilizes strict uppercase styling with positive letter spacing (`0.05em`) for taxonomy tags, source verification pills, and table headers.
- **Line Length Discipline**: Body passages are capped at a maximum of `68ch` to maintain optimum academic readability.
- **Hierarchy Enforcement**: Do not skip typography scales. Major administrative units use `headline-lg`, department sub-headers use `headline-md`, and conversational routing answers default to `body-lg`.

## Layout & Spacing

The layout philosophy uses a structured **Fixed-Max Fluid Grid** constrained to a centered application column (maximum `1200px` for directory indexes; maximum `840px` for focused conversational routing queries).

### Grid and Structural Rules

- **Breakpoints**:
  - **Mobile** (< 640px): 4-column layout, `margin`: `1rem`, `gutter`: `1rem`. Bottom action sheets replace split modal panels.
  - **Tablet** (640px – 1024px): 8-column layout, `margin-md`: `1.5rem`, `gutter`: `1rem`. Secondary sidebar collapses to drawer.
  - **Desktop** (> 1024px): 12-column layout, `margin-lg`: `2.5rem`, `gutter-lg`: `1.5rem`. Fixed dual-pane configuration: routing navigation left (35%), conversational citations right (65%).
- **Vertical Spacing Rhythm**: All layout offsets adhere rigidly to 4px and 8px baseline increments. Dense contact units favor `space-sm` internal padding, while section divisions demand `space-xl` breathing room to maintain institutional authority.

## Elevation & Depth

This system intentionally eliminates traditional drop shadows, skeuomorphic bevels, and atmospheric blurs in favor of **Structural Outlines & Tonal Planes**.

- **Elevation 0 (Canvas Base)**: `#F6F8FA`. Serves as the primary viewport backing.
- **Elevation 1 (Card & Module Shells)**: Surface `#FFFFFF` enclosed by a continuous 1px solid border (`#E2E8F0`). Flat appearance; no shadow.
- **Elevation 2 (Floating Popovers, Routing Tooltips, Copy Confirmations)**: Surface `#FFFFFF`, 1px solid border (`#D1D5DB`), paired with an ultra-subtle, sharp ambient drop shadow (`0 2px 4px rgba(44, 58, 71, 0.06), 0 1px 2px rgba(44, 58, 71, 0.04)`).
- **Elevation 3 (Modal Dialogues & Verification Overlays)**: Surface `#FFFFFF` with a static 1px border (`#2C3A47`), set against a darkened institutional backdrop barrier (`rgba(44, 58, 71, 0.40)`).

## Shapes

The design system adopts a **Soft (`1`)** shape logic (4px default radii). This small, precise radius softens harsh technical edges while avoiding the casual, consumer-app tone of heavily pill-shaped or bubble containers.

- **Base Radius (`0.25rem` / 4px)**: Standard buttons, text inputs, status chips, dropdown triggers, and verification source tags.
- **Card Radius (`0.5rem` / 8px)**: Department overview modules, conversation query cards, and routing result containers.
- **Modal Radius (`0.75rem` / 12px)**: High-level routing modal surfaces and directory filter dialogs.
- **Pills / Fully Circular (9999px)**: Prohibited across all controls, with the sole exception of static counter dots and avatar presence monograms.

## Components

### Buttons

- **Primary Action**: Solid `#0B5D3B` background, `#FFFFFF` text, 4px border radius. Hover state transitions to `#08492E`. Minimum height: 40px (desktop), 44px (mobile touch target).
- **Secondary Action**: Solid `#FFFFFF` background, 1px solid `#2C3A47` border, `#2C3A47` text. Focus visible: 2px outline offset with `#0B5D3B`.
- **Tertiary / Utility Link**: Flat styling, no outline. `#0B5D3B` text with an underline on hover. Accompanied by inline directional chevron (no emojis).

### Routing & Contact Cards

- **Department & Official Cards**: Contained within 1px `#E2E8F0` border on `#FFFFFF` ground.
- **Copyable Contact Rows**: Split row presentation featuring telephone, email, or desk extensions. A distinct, secondary 1-click "Copy" micro-action sits right-aligned (labeled clearly with "Copy Phone" or "Copy Email", displaying a brief 2-second check state: `#0B5D3B` text reading "Copied to clipboard").
- **Physical Office Metadata**: Office locations (e.g., "Senate Building, Block B, Floor 2, Room 204") formatted using `JetBrains Mono` at `body-code` with an adjacent plain-text routing route indicator.

### Status Badges & Citation Sources

- **Official Source Badge**: `#F6F8FA` background, 1px solid `#CBD5E1` border, uppercase `label-sm` text in `#2C3A47`. Example: `SOURCE: 2024/2025 FACULTY HANDBOOK §4.2`.
- **Abstention / Caution Container**: Solid `#FFFBEB` background, 1px solid `#FDE68A` border, left-accented by a 3px vertical border in `#8A4B00`. Copy clearly articulates that the assistant lacks official verification and points to the manual registrar desk.

### Form Inputs & Query Fields

- **Search & Inquiry Inputs**: Single or multi-line containers styled with `#FFFFFF` background, 1px `#CBD5E1` border, `#1F2937` input text, and `#64748B` placeholder copy. Focused state activates a crisp, non-blurred 1px outer ring in `#0B5D3B`.
- **Checkboxes & Radios**: 16px square (checkbox) or circle (radio) with a 1px solid `#94A3B8` frame. Selected state turns `#0B5D3B` with a high-contrast `#FFFFFF` core check/dot.

### Verification Indicators

- Pure text-and-rule verification lines at the foot of each generated routing card:
  - Validated by Directory Registry: Green checkmark glyph (`✓`) in `#0B5D3B` followed by "Verified against Cosmopolitan University Official Directory".

---

> The original Stitch screen prototypes (desktop and mobile) were reference
> material only. This document is the retained source of truth for the
> interface: palette, type scale, spacing, elevation, and component rules.
