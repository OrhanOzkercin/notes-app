# Notes App Design System

This document outlines the design system for our collaborative note-taking platform. It serves as a guide for maintaining consistency in design and development across the application.

## Typography

### Font Families
- **Headings**: Cal Sans (`var(--font-cal)`)
- **Body**: Inter (`var(--font-inter)`)

### Type Scale
#### Headings
- `h1`: text-4xl (2.25rem)
- `h2`: text-3xl (1.875rem)
- `h3`: text-2xl (1.5rem)
- Weight: semibold

#### Body Text
- Default: text-base (1rem)
- Large: text-lg (1.125rem)
- Small: text-sm (0.875rem)
- Extra Small: text-xs (0.75rem)

#### Line Heights
- Default: 1.5
- Content: 1.625 (for better readability in note content)

### Usage Guidelines
- Note Content: Use body default with content line height
- Metadata: Use small text
- UI Elements: Use default text
- Buttons: Use default text
- Captions: Use extra small text

## Colors

### Primary Colors
**Usage**: Brand color, main interactive elements
- Primary buttons
- Important links
- Active states
- Brand elements

### Accent Colors
**Usage**: Complementary color for emphasis
- Highlights
- Secondary actions
- Success states
- Progress indicators

### Secondary Colors
**Usage**: Supporting UI elements
- Backgrounds
- Borders
- Less important UI elements
- Disabled states

### Neutral Colors
**Usage**: Text and background colors
- Body text
- Backgrounds
- Borders
- Dividers

### Dark Mode Strategy
- Maintain brand colors consistency
- Ensure WCAG AA contrast ratios
- Adjust background/text colors for readability
- Use darker shades for elevated surfaces

## Spacing

### Scale
Base unit: 4px (0.25rem)
Scale progression: Multiply by 2 for each step (4px, 8px, 16px, etc.)

### Layout Usage
#### Container
- Max width: 1280px
- Padding:
  - Mobile: 16px (spacing.4)
  - Desktop: 24px (spacing.6)

#### Grid
- Gap:
  - Mobile: 16px (spacing.4)
  - Desktop: 24px (spacing.6)

### Component Spacing
#### Padding
- Buttons: 8px 16px
- Cards: 16px
- Sections: 24px

#### Margins
- Between sections: 32px
- Between elements: 16px

#### Gaps
- Form fields: 16px
- List items: 8px

## Layout

### Containers
#### Note Editor
- Max width: 800px
- Padding: 24px

#### Note List
Grid layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 24px

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Components

We use shadcn/ui as our primary component library. Here's how to use common components:

### Buttons
- Primary: `<Button variant="default">`
- Secondary: `<Button variant="secondary">`
- Destructive: `<Button variant="destructive">`
- Ghost: `<Button variant="ghost">` (for subtle actions)

### Inputs
- Text: Use `Input` component with proper aria-labels
- Textarea: Use `Textarea` for multi-line content
- Select: Use `Select` for dropdowns

### Dialogs
- Default: Use `Dialog` for modals
- Alerts: Use `AlertDialog` for destructive actions

### Cards
- Note: Use `Card` with 16px padding
- Preview: Use `Card` with hover state

### Component Customization Guidelines
When customizing shadcn components:
1. Extend existing variants instead of creating new ones
2. Use design tokens for colors and spacing
3. Maintain accessibility features
4. Document any customizations in the component

## Usage Examples

```tsx
// Button examples
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>

// Card example
<Card className="p-4">
  <CardHeader>
    <CardTitle>Note Title</CardTitle>
    <CardDescription>Last edited 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>Note content here</CardContent>
</Card>

// Container example
<div className="container mx-auto px-4 lg:px-6">
  Content here
</div>
```

## Accessibility

- All components should maintain WCAG AA standards
- Use proper heading hierarchy
- Ensure sufficient color contrast
- Maintain proper focus states
- Include proper ARIA labels 