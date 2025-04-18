export const baseClasses = {
  default: 'font-medium hover:underline',
  underlined: 'font-medium underline',
  button: 'px-5 h-10 rounded-full inline-flex items-center justify-center',
  subtle: 'text-opacity-80 hover:text-opacity-100 transition-all duration-200',
  icon: 'inline-flex items-center justify-center'
};

// Color classes
export const colorClasses = {
  primary: {
    default: 'text-primary-500',
    underlined: 'text-primary-500',
    button: 'bg-primary-600 text-white hover:bg-primary-500 transition-all duration-200 w-full',
    subtle: 'text-primary-500',
    icon: 'text-primary-500'
  },
  accent: {
    default: 'text-accent-500',
    underlined: 'text-accent-500',
    button: 'bg-accent-500 text-white hover:bg-accent-600 transition-all duration-200 w-full',
    subtle: 'text-accent-500',
    icon: 'text-accent-500'
  },
  warn: {
    default: 'text-warn-500',
    underlined: 'text-warn-500',
    button: 'bg-warn-500 text-white hover:bg-warn-600 transition-all duration-200 w-full',
    subtle: 'text-warn-500',
    icon: 'text-warn-500'
  },
  neutral: {
    default: 'text-gray-700',
    underlined: 'text-gray-700',
    button: 'bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200 w-full',
    subtle: 'text-gray-600',
    icon: 'text-gray-700'
  }
};
