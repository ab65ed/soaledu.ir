import React from 'react';

interface SelectProps {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className = '' }) => {
  return (
    <button
      type="button"
      className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </button>
  );
};

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {children}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ children }) => {
  return (
    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
      {children}
    </div>
  );
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <span className="text-gray-500">{placeholder}</span>;
};

export { SelectTrigger, SelectContent, SelectItem, SelectValue };
export default Select; 