import { CopyIcon, CheckIcon } from './Icons';
import toast from 'react-hot-toast';

export const Card = ({ children, className = "", title, description, action }) => (
  <div className={`relative rounded-2xl bg-[#0d0f18]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-6 md:p-7 transition-all duration-200 hover:border-white/[0.12] ${className}`}>
    {(title || action) && (
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          {title && (
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    )}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const Button = ({
  onClick,
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled,
  loading,
  type = "button"
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold select-none cursor-pointer rounded-xl transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
    md: "text-sm px-4 py-2.5 gap-2 h-11",
    lg: "text-base px-6 py-3.5 gap-2.5 h-13"
  };

  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)]",
    secondary: "bg-white/[0.05] hover:bg-white/[0.09] active:bg-white/[0.04] text-white border border-white/[0.1] hover:border-white/[0.18]",
    outline: "bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] text-slate-200 border border-white/[0.12] hover:border-white/[0.24]",
    ghost: "bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-300 hover:text-white",
    danger: "bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-300 border border-red-500/20"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  helper,
  error,
  suffix,
  prefix,
  className = "",
  disabled = false,
  autoComplete = "off"
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <div className="flex justify-between items-center px-0.5">
        <label className="text-xs font-semibold text-slate-300">
          {label}
        </label>
        {helper && (
          <span className="text-[11px] text-slate-400">
            {helper}
          </span>
        )}
      </div>
    )}
    <div className="relative flex items-center">
      {prefix && (
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full bg-[#11131f]/90 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-2.5 border transition-all duration-150 ease-out focus:outline-none ${
          prefix ? 'pl-10' : ''
        } ${suffix ? 'pr-20' : ''} ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-white/[0.08] hover:border-white/[0.14] focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15'
        } disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      />
      {suffix && (
        <div className="absolute right-2.5 flex items-center">
          {suffix}
        </div>
      )}
    </div>
    {error && (
      <span className="text-[11px] text-red-400 font-medium px-0.5 animate-fadeIn">
        {error}
      </span>
    )}
  </div>
);

export const Badge = ({ children, variant = "neutral", className = "" }) => {
  const variants = {
    neutral: "bg-white/[0.06] text-slate-300 border-white/[0.08]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    info: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const CopyButton = ({ text, label = "Copy", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-150 cursor-pointer active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
