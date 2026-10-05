import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right', className = '', closeOnClick = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 origin-top-right rounded-xl bg-surface dark:bg-[#292622] border-[1.5px] border-border-dark dark:border-[#575048] shadow-doodle focus:outline-none transition-all duration-150 motion-reduce:transition-none overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'} ${className || 'w-56'}`}>
          <div onClick={closeOnClick ? () => setIsOpen(false) : undefined}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}