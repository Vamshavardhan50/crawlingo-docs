// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx,js,jsx,mdx}',
    './src/components/**/*.{ts,tsx,js,jsx,mdx}',
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  prefix: '',
  theme: {
    extend: {
      colors: {
        // Design token aliases → CSS vars
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        // Brand palette
        brand: {
          navy:   '#0B1220',
          orange: '#FF6B35',
          'orange-light': '#FF8A5C',
          'orange-dark':  '#E8541A',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          teal:   '#14B8A6',
        },
        surface:    'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        // Semantic
        success: '#10B981',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '3xs': ['0.5rem',   { lineHeight: '0.75rem' }],
        'display-2xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        xs:  'var(--radius-xs)',
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'xs':     'var(--shadow-xs)',
        'sm':     'var(--shadow-sm)',
        'md':     'var(--shadow-md)',
        'lg':     'var(--shadow-lg)',
        'xl':     'var(--shadow-xl)',
        '2xl':    'var(--shadow-2xl)',
        'orange': 'var(--shadow-orange)',
        'indigo': 'var(--shadow-indigo)',
        'inner':  'inset 0 2px 4px rgb(0 0 0 / 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'docs':  '720px',
        'prose': '65ch',
        '8xl':   '88rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring':   'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '50':  '50ms',
        '120': '120ms',
        '350': '350ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.2)' },
        },
        'shimmer': {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition: '200% center' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to:   { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to:   { height: '0', opacity: '0' },
        },
        'caret-blink': {
          '0%, 100%': { opacity: '0' },
          '50%':      { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 53, 0)' },
          '50%':      { boxShadow: '0 0 20px 4px rgba(255, 107, 53, 0.15)' },
        },
      },
      animation: {
        'fade-in':       'fade-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':      'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right':'slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'float':         'float 4s ease-in-out infinite',
        'pulse-dot':     'pulse-dot 2s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s linear infinite',
        'spin-slow':     'spin-slow 8s linear infinite',
        'accordion-down':'accordion-down 0.2s ease-out',
        'accordion-up':  'accordion-up 0.2s ease-out',
        'caret-blink':   'caret-blink 1.2s ease-out infinite',
        'glow-pulse':    'glow-pulse 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%)',
        'gradient-brand':  'linear-gradient(135deg, #FF6B35 0%, #6366F1 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(255,107,53,0.05) 100%)',
        'gradient-card':   'linear-gradient(145deg, var(--card) 0%, var(--surface) 100%)',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      addUtilities({
        '.font-display':   { fontFamily: theme('fontFamily.display') },
        '.font-mono':      { fontFamily: theme('fontFamily.mono') },
        '.text-balance':   { textWrap: 'balance' },
        '.text-pretty':    { textWrap: 'pretty' },
        '.backdrop-blur-xs': { backdropFilter: 'blur(2px)' },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #FF6B35 0%, #6366F1 60%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        '.gradient-text-orange': {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border-strong) transparent',
        },
        '.scrollbar-none': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      });
    },
    require('tailwindcss-animate'),
  ],
};