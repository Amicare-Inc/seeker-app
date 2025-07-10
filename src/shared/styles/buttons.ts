// Consistent button styles using Tailwind classes
export const buttonStyles = {
  // Base styles
  base: 'rounded-lg font-medium transition-colors',
  
  // Sizes
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
  
  // Variants
  variants: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  },
  
  // States
  states: {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'cursor-wait',
  },
} as const;

// Helper to combine button classes
export const getButtonClasses = (
  variant: keyof typeof buttonStyles.variants = 'primary',
  size: keyof typeof buttonStyles.sizes = 'md',
  disabled = false,
  className = ''
) => {
  return [
    buttonStyles.base,
    buttonStyles.sizes[size],
    buttonStyles.variants[variant],
    disabled && buttonStyles.states.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}; 