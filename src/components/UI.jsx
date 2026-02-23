import React from 'react';

export const Card = ({ children, className = "", title }) => (
    <div className={`glass-card p-8 group transition-all duration-500 overflow-hidden relative ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-solana-purple/5 blur-[60px] rounded-full group-hover:bg-solana-purple/10 transition-all duration-700" />
        {title && (
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <h3 className="text-sm font-black text-gradient uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        )}
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

export const Button = ({ onClick, children, className = "", variant = "primary", disabled, loading }) => {
    const baseStyles = "px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group relative overflow-hidden active:scale-[0.98]";
    const variants = {
        primary: "btn-primary",
        secondary: "bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white shadow-lg",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/0 hover:shadow-red-500/10"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
            ) : (
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            )}
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
