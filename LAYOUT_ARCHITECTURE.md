# Layout Architecture

## Page Grid System

### Desktop View (1200px+)
```
┌─────────────────────────────────────┬──────────┐
│                                     │          │
│         OESearch Component          │          │
│    (grid-column: 1, grid-row: 1)    │ Sidebar  │
│                                     │ (sticky) │
├─────────────────────────────────────┤          │
│                                     │          │
│      Main Upload Card               │          │
│    (grid-column: 1, grid-row: 2)    │          │
│                                     │          │
│  - File Upload Dropzone             │          │
│  - Keyword Input                    │          │
│  - Action Buttons                   │          │
│  - Progress Bar                     │          │
│  - Alerts                           │          │
│                                     │          │
└─────────────────────────────────────┴──────────┘
```

### Tablet View (1024px - 768px)
```
┌──────────────────────────────────────┐
│                                      │
│      OESearch Component              │
│   (Full width, top position)         │
│                                      │
├──────────────────────────────────────┤
│                                      │
│       Main Upload Card               │
│     (Full width)                     │
│                                      │
│  - File Upload Dropzone              │
│  - Keyword Input                     │
│  - Action Buttons                    │
│  - Progress Bar                      │
│  - Alerts                            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Instructions (stacked)              │
│                                      │
└──────────────────────────────────────┘
```

### Mobile View (< 640px)
```
┌──────────────────────────────────────┐
│          Header (Compact)            │
├──────────────────────────────────────┤
│                                      │
│      OESearch Component              │
│   (Smaller padding)                  │
│                                      │
├──────────────────────────────────────┤
│                                      │
│       Main Upload Card               │
│       (Reduced padding)              │
│                                      │
│  - File Upload Dropzone              │
│  - Keyword Input                     │
│  - Action Buttons (stacked)          │
│  - Progress Bar                      │
│  - Alerts                            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Instructions                        │
│  (Not displayed on mobile)           │
│                                      │
├──────────────────────────────────────┤
│  Footer (Compact, Centered)          │
└──────────────────────────────────────┘
```

## Component Hierarchy

```
App Container
├── Header (sticky, z-index: 100)
│   ├── Logo (56px, gradient background)
│   └── Title (with gradient text)
│
├── Main Content
│   ├── Page Container (max-width: 1200px)
│   │   ├── OESearch Section (grid-row: 1)
│   │   │   ├── Title (gradient blue to cyan)
│   │   │   ├── Search Input
│   │   │   ├── Search Button
│   │   │   ├── Error Messages
│   │   │   └── Results Display (YV badges)
│   │   │
│   │   ├── Main Card (grid-row: 2)
│   │   │   ├── FileUpload Section
│   │   │   ├── Divider
│   │   │   ├── KeywordInput Section
│   │   │   ├── Divider
│   │   │   ├── Actions Section
│   │   │   ├── Progress Bar
│   │   │   └── Alert
│   │   │
│   │   └── Instructions Sidebar (grid-row: 1/3, sticky)
│   │       ├── Title
│   │       ├── Instructions List
│   │       └── Contact Footer
│   │
│   └── Footer (margin-top: auto)
│       ├── Copyright
│       └── Contact Link
```

## CSS Grid Template Areas

### Desktop
```css
.page-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  grid-auto-rows: max-content;
}

Rows assigned:
- OESearch: row 1, col 1
- Main Card: row 2, col 1
- Sidebar: row 1-3, col 2
```

### Tablet (1024px-)
```css
.page-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

Rows assigned:
- OESearch: row 1, col 1
- Main Card: row 2, col 1
- Sidebar: row 3, col 1 (visible)
```

### Mobile (640px-)
```css
.page-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

Same structure, reduced gaps and padding
```

## Breakpoints

- **1024px**: Desktop to tablet transition
  - Sidebar moves below content
  - Grid changes to single column
  - Gaps reduce from 24px to 20px

- **768px**: Medium tablet
  - Card padding reduces from 24px to 16px
  - Font sizes slightly reduced

- **640px**: Small devices
  - Card padding reduces to 12px
  - Main content padding reduces to 10px
  - Multi-column layouts become single column
  - Action buttons stack vertically
  - Keyword inputs stack vertically

## Sticky Positioning

### Header
- Position: sticky
- Top: 0
- Z-index: 100
- Always visible

### Instructions Sidebar (Desktop only)
- Position: sticky
- Top: 100px (below header)
- Height: fit-content
- Displays only above 1024px

## Spacing System

### Vertical Spacing
- Gap between major sections: 24px (desktop), 20px (tablet), 12px (mobile)
- Padding within cards: 24px (desktop), 16px (tablet), 12px (mobile)
- Section margins: 16px
- Component gaps: 12px, 10px, 8px

### Horizontal Spacing
- Page container max-width: 1200px
- Sidebar width: 320px
- Main content width: calc(100% - 344px) on desktop
- Mobile padding: 10px sides

## Transitions & Animations

### Global
- Default transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)

### Component-Specific
- OESearch results: slideIn 0.3s ease-out
- Buttons: translateY(-1px) on hover
- Links: width animation on hover (0.3s)
- Progress bar: width 0.4s cubic-bezier

## Color System in Use

### Backgrounds
- Primary bg: #0a0e1a
- Cards: rgba(15, 19, 32, 0.8) with gradient overlay
- Overlays: Semi-transparent with blur

### Text
- Primary text: #e0e3e8
- Secondary text: #b4bac5
- Muted text: #8b95a7

### Accents
- Primary action: #2563eb (blue)
- Success: #10b981 (green)
- Error: #ef4444 (red)
- Borders: #1a1f2e

### Gradients
- Primary to cyan: #2563eb to #60a5fa
- Success: #10b981 to #059669
- Text: --text to --text-secondary
