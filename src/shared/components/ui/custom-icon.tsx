import { ImgHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

export interface CustomIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Icon name (without extension) */
  name: string
  /** Size in pixels (applies to both width and height) */
  size?: number
  /** Custom className */
  className?: string
}

/**
 * CustomIcon Component
 * 
 * Helper component for loading custom icon assets from the public folder
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CustomIcon name="dashboard" size={24} />
 * 
 * // With custom styling
 * <CustomIcon name="users" className="text-blue-500" size={20} />
 * 
 * // Responsive sizing
 * <CustomIcon name="settings" className="w-6 h-6 md:w-8 md:h-8" />
 * ```
 */
export function CustomIcon({ 
  name, 
  size = 24, 
  className,
  alt,
  ...props 
}: CustomIconProps) {
  const iconPath = `/assets/icons/${name}.svg`

  return (
    <img
      src={iconPath}
      alt={alt || name}
      width={size}
      height={size}
      className={cn('inline-block', className)}
      {...props}
    />
  )
}

/**
 * Logo Component
 * 
 * Helper component for loading the Myswaap logo
 * 
 * @example
 * ```tsx
 * <Logo variant="main" size={120} />
 * <Logo variant="white" className="h-8" />
 * ```
 */
export interface LogoProps {
  /** Logo variant */
  variant?: 'main' | 'white' | 'icon'
  /** Size in pixels */
  size?: number
  /** Custom className */
  className?: string
}

export function Logo({ size, className }: LogoProps) {
  // const logoPath = `/assets/logos/myswaap-logo-${variant}.svg`
  const logoPath = `/assets/logos/emjay-logo.svg`

  return (
    <img
      src={logoPath}
      alt="Myswaap"
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback to text logo if image not found
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const parent = target.parentElement
        if (parent) {
          parent.innerHTML = `
            <div class="font-bold text-2xl ${className || ''}">
              mysw<span class="text-myswaap-teal-500">aa</span>p
            </div>
          `
        }
      }}
    />
  )
}
