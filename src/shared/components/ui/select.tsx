import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  error = false,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-colors',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          className
        )}
      >
        <span className={cn(
          'text-sm',
          selectedOption ? 'text-gray-900' : 'text-gray-400'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors',
                  option.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-50',
                  option.value === value && 'bg-primary/10 text-primary font-medium'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}