---
name: FinanceAI
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464554'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#944a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd933d'
  on-secondary-container: '#693300'
  tertiary: '#712ae2'
  on-tertiary: '#ffffff'
  tertiary-container: '#8a4cfc'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  value-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  value-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is built to transform the often intimidating world of financial analysis into an engaging, motivational, and humanized experience. The brand personality is "The Encouraging Expert"—highly intelligent and data-driven, yet approachable and supportive. 

The aesthetic blends **Modern Corporate** precision with **Playful Minimalism**. It utilizes generous whitespace, soft-touch surfaces, and vibrant accent colors to guide the user through their financial journey. The UI avoids the cold, dense nature of traditional fintech, instead opting for a "dashboard-as-a-story" approach where every metric feels like a milestone toward a goal. Emotional responses should range from clarity and relief to excitement and achievement.

## Colors
The palette is anchored by a vibrant **Indigo (#6366F1)** which represents intelligence and stability. To inject energy and "gamification," a **Warm Coral (#FB923C)** is used for primary actions and motivational triggers.

- **Backgrounds:** Use a very soft grey (`#F9FAFB`) for the main canvas to allow white cards to pop with subtle depth.
- **Data Visualization:** Use the semantic palette (Green, Amber, Coral Red) strictly for performance indicators.
- **Accents:** Use the secondary Tertiary Indigo (`#7C3AED`) for hovered states or deep-link interactions to maintain a sophisticated gradient feel.

## Typography
This design system utilizes **Plus Jakarta Sans** (as a high-quality alternative to Poppins) for main titles to maintain a friendly, rounded geometric feel. **Inter** handles the heavy lifting for secondary headers and body text due to its exceptional legibility. 

A critical distinction in this system is the use of **JetBrains Mono** (as a high-performance alternative to DM Mono) for all financial values and currency strings. This monospaced choice ensures that numbers align perfectly in vertical stacks and conveys a sense of technical precision amidst the friendly brand style.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a max-width container for desktop viewing. 
- **The Card-First Philosophy:** Instead of dense tables, information is grouped into semantic cards. 
- **Grid:** On desktop, use a 12-column grid. On mobile, use a single column with a 16px side margin.
- **Rhythm:** Spacing follows a 4px baseline. Use `lg` (24px) for padding within cards and `xl` (32px) for vertical gap between dashboard sections.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows**. 
- **Level 0 (Background):** `#F9FAFB`.
- **Level 1 (Cards):** Pure `#FFFFFF` with a very soft, diffused shadow (`0px 4px 20px rgba(0, 0, 0, 0.05)`).
- **Level 2 (Modals/Popovers):** Pure `#FFFFFF` with a slightly more pronounced shadow and a 1px border of `#F3F4F6`.
- **Interactions:** When a user hovers over a card, it should subtly lift (shadow increases) and the border color should shift to a light Primary Indigo tint.

## Shapes
The shape language is consistently **Rounded**, reinforcing the friendly and motivational tone. 
- **Standard Cards/Containers:** 0.5rem (8px).
- **Buttons and Inputs:** 0.5rem (8px) for a modern, approachable look.
- **Chips and Badges:** Full-pill (999px) to contrast against the structured cards and signify status at a glance.

## Components
- **Buttons:** Primary buttons use a gradient from Indigo to Purple or solid Indigo with white text. Secondary buttons use the Coral Orange to highlight "Growth" or "Reward" actions.
- **Cards:** The core of the UI. Cards must have a clear hierarchy: a label-sm top-left, a value-lg center, and a progress bar or indicator badge at the bottom.
- **Progress Bars:** Use a thick 8px height with rounded caps. Background should be a 10% opacity version of the track color.
- **Status Badges:** Small, pill-shaped indicators using the semantic palette with 10% background fills and 100% text color (e.g., Green text on light green background).
- **Skeletal Loading:** Use a pulsing light grey (`#F3F4F6` to `#E5E7EB`) with the same roundedness as the cards they represent.
- **Inputs:** Clean, white fills with a subtle 1px border. On focus, the border transitions to Primary Indigo with a soft outer glow.