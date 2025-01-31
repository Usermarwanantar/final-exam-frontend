const Button = ({ children, onClick, className = '' }) => {
  return (
    <button 
      className={`modern-button fade-in ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 