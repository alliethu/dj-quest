export const colors = {
  bg: '#07001a',
  bgLight: '#0f0030',
  pink: '#ff6b9d',
  yellow: '#ffd93d',
  green: '#6bcb77',
  blue: '#4d96ff',
  purple: '#b04dff',
  white: '#ffffff',
  whiteAlpha: 'rgba(255, 255, 255, 0.1)',
  whiteAlpha2: 'rgba(255, 255, 255, 0.2)',
  whiteAlpha6: 'rgba(255, 255, 255, 0.6)',
};

export const padColors = {
  KICK: colors.pink,
  SNARE: colors.yellow,
  'HI-HAT': colors.green,
  FX: colors.blue,
};

export const fonts = {
  display: "'Fredoka One', cursive",
  body: "'Nunito', sans-serif",
};

export const shared = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    background: `linear-gradient(135deg, ${colors.pink}, ${colors.yellow}, ${colors.green}, ${colors.blue}, ${colors.purple})`,
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'rainbow 4s ease infinite',
    marginBottom: '10px',
    textAlign: 'center',
  },
  button: {
    fontFamily: fonts.display,
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    padding: '14px 36px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.white,
    letterSpacing: '1px',
  },
  primaryButton: {
    background: `linear-gradient(135deg, ${colors.pink}, ${colors.purple})`,
    boxShadow: `0 0 20px ${colors.pink}44, 0 4px 15px rgba(0,0,0,0.3)`,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  screenAnimation: {
    animation: 'fadeIn 0.4s ease',
  },
};
