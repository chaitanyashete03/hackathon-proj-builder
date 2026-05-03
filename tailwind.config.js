/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { 
    extend: {
      colors: {
        void: {
          black: "#05050A",
          deep: "#08081A",
        },
        glass: {
          base: "rgba(11, 19, 32, 0.50)",
          hover: "rgba(11, 19, 32, 0.65)",
          border: "rgba(255, 255, 255, 0.10)",
        },
        accent: {
          cerulean: "#2B90D9",
          cerise: "#D93B76",
          violet: "#7C3AED",
          cyan: "#06B6D4",
        },
        text: {
          primary: "#F0F2F5",
          secondary: "#6B7A90",
          muted: "#3D4A5C",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        glass: '20px',
        pill: '9999px',
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        'glass': 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.40)',
        'glass-hover': 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 12px 48px rgba(0,0,0,0.50)',
        'glow-cerulean': '0 0 30px rgba(43,144,217,0.30)',
        'glow-cerise': '0 0 30px rgba(217,59,118,0.30)',
        'glow-violet': '0 0 30px rgba(124,58,237,0.25)',
        'spatial-rest': '0 4px 20px rgba(0,0,0,0.40)',
        'spatial-press': '0 2px 8px rgba(0,0,0,0.50)',
      },
      animation: {
        'orb-1': 'orb-drift-1 60s ease-in-out infinite',
        'orb-2': 'orb-drift-2 60s ease-in-out infinite',
        'orb-3': 'orb-drift-3 60s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'grain': 'grain-shift 8s steps(10) infinite',
      },
      backgroundImage: {
        'void-radial': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(43,144,217,0.08) 0%, transparent 60%)',
        'cerulean-glow': 'radial-gradient(circle, rgba(43,144,217,0.30) 0%, transparent 70%)',
        'cerise-glow': 'radial-gradient(circle, rgba(217,59,118,0.30) 0%, transparent 70%)',
        'violet-glow': 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
        'gradient-cta': 'linear-gradient(135deg, #2B90D9, #7C3AED, #D93B76)',
        'gradient-cta-hover': 'linear-gradient(135deg, #3BA0E9, #8C4AFD, #E94B86)',
      },
    } 
  },
  plugins: [],
};
