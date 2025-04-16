export function Button({ children, onClick, variant = "primary", className = "" }) {
  let baseStyle = "py-2 px-4 rounded transition-all";

  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
}
