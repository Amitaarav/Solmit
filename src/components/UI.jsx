import React from 'react';

export const Card = ({ children, className = "", title }) => (
    <div className={`glass-card p-6 ${className}`}>
        {title && <h3 className="text-xl font-bold mb-4 text-gradient">{title}</h3>}
        {children}
    </div>
);

export const Button = ({ onClick, children, className = "", variant = "primary", disabled, loading }) => {
    const baseStyles = "px-6 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
    const variants = {
        primary: "btn-primary",
        secondary: "bg-white/10 hover:bg-white/20 text-white",
        danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : children}
        </button>
    );
};

export const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full input-field px-4 py-3 rounded-xl mb-4 ${className}`}
    />
);
