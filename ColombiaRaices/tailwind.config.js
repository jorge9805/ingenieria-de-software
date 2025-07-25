/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/src/**/*.{js,jsx,ts,tsx}",
    "./renderer/public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores basada en ColombiaRaicesLogo.png
        'colombia-yellow': '#F5D547',
        'colombia-gold': '#F4C430',
        'colombia-green': '#2C5F2D',
        'colombia-forest': '#1A4F1A',
        'colombia-blue': '#4A90E2',
        'colombia-sky': '#87CEEB',
        'colombia-orange': '#FF8C00',
        'colombia-sunset': '#FF6B47',
        'colombia-brown': '#8B4513',
        'colombia-earth': '#A0522D',
        'colombia-cream': '#FFF8DC',
        'colombia-warm-white': '#FAF0E6',
        'colombia-gray': '#6B7280',
        'colombia-light-gray': '#E5E7EB',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'colombia-gradient': 'linear-gradient(135deg, #F5D547 0%, #FF8C00 50%, #2C5F2D 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF6B47 0%, #F5D547 100%)',
        'forest-gradient': 'linear-gradient(135deg, #1A4F1A 0%, #2C5F2D 100%)',
      },
      boxShadow: {
        'colombia': '0 4px 14px 0 rgba(245, 213, 71, 0.39)',
        'green': '0 4px 14px 0 rgba(44, 95, 45, 0.39)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
