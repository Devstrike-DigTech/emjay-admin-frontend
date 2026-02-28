# Assets Folder

This folder contains all static assets for the Myswaap Admin Console.

## Structure

```
public/assets/
├── icons/          # Custom icon files (SVG, PNG)
├── images/         # General images (backgrounds, illustrations)
└── logos/          # Brand logos and variations
```

## Adding Custom Icons

### Method 1: Direct SVG Import
1. Place your SVG files in `public/assets/icons/`
2. Import and use in components:

```tsx
// In your component
<img src="/assets/icons/your-icon.svg" alt="Icon" className="w-6 h-6" />
```

### Method 2: React Component (Recommended)
1. Place SVG in `src/assets/icons/`
2. Import as component:

```tsx
import MyIcon from '@/assets/icons/my-icon.svg?react'

// In your component
<MyIcon className="w-6 h-6 text-myswaap-teal-500" />
```

### Method 3: Icon Helper Component
We've created a helper component for easier icon management:

```tsx
import { CustomIcon } from '@/components/ui/custom-icon'

// In your component
<CustomIcon name="dashboard" className="w-6 h-6" />
<CustomIcon name="users" size={24} />
```

## Icon Naming Convention

Please follow this naming pattern:
- `icon-name.svg` (lowercase, hyphenated)
- Examples: `dashboard-icon.svg`, `user-profile.svg`, `settings-gear.svg`

## Supported Formats

- **Icons:** SVG (preferred), PNG
- **Images:** JPG, PNG, WebP
- **Logos:** SVG (preferred), PNG with transparent background

## Usage Examples

### Logo
```tsx
<img src="/assets/logos/myswaap-logo.svg" alt="Myswaap" />
```

### Background Image
```tsx
<div 
  style={{ backgroundImage: 'url(/assets/images/auth-bg.jpg)' }}
  className="bg-cover bg-center"
>
  ...
</div>
```

### Icon in Button
```tsx
<Button>
  <img src="/assets/icons/plus.svg" className="w-4 h-4 mr-2" />
  Add User
</Button>
```

## Optimization Tips

1. **SVG Icons:** Keep them small (<10KB), remove unnecessary metadata
2. **Images:** Compress before adding (use tools like TinyPNG)
3. **Logos:** Provide multiple sizes for different use cases

## Current Assets

Once you add assets, list them here:
- [ ] Logo (main)
- [ ] Logo (white variant)
- [ ] Dashboard icon
- [ ] Users icon
- [ ] Schools icon
- [ ] Settings icon
- [ ] Auth background image
