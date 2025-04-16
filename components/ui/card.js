export function Card({ children, className }) {
    return (
      <div className={`shadow-lg rounded-lg p-4 ${className}`}>
        {children}
      </div>
    );
  }
  