export function Button({ children, onClick, variant = "primary", className = "" }) {
  let baseStyle = "py-2 px-4 rounded transition-all";

  const variantStyles = {
    primary: "bg-[#1fabaa] text-white  hover:text-[#1fabaa]",
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
