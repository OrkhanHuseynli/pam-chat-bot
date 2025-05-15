import { useState, useRef, useEffect } from 'react';

const InfoPin = ({ text, content }: { text: string; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // Properly type the refs
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const updatePosition = () => {
        if (triggerRef === null || triggerRef.current === null || triggerRef.current.getBoundingClientRect === null) {
          return;
        }

        if (tooltipRef === null || tooltipRef.current === null || tooltipRef.current.getBoundingClientRect === null) {
          return;
        }

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        // Calculate center position above the trigger element
        const top = triggerRect.top - tooltipRect.height - 12; // 12px for arrow
        const left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Adjust position if tooltip would go off screen
        const adjustedLeft = Math.max(
          10, // Minimum padding from left edge
          Math.min(left, window.innerWidth - tooltipRect.width - 10) // Maximum position from right edge
        );

        setPosition({ top, left: adjustedLeft });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
    return () => {};
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className='ml-[2px] flex h-[12px] w-[12px] cursor-pointer items-center justify-center rounded-full border border-blue-300 text-[10px] leading-none text-blue-300 hover:bg-blue-50'
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label='Information'
      >
        i
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className='fixed z-50'
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          <div className='relative rounded-lg bg-gray-900 shadow-lg'>
            <div className='max-w-xs px-4 py-3'>
              <div className='mb-1 text-[14px] font-semibold capitalize text-white'>{text}</div>
              <div className='text-[14px] text-gray-200'>{content}</div>
            </div>

            {/* Arrow */}
            <div
              className='absolute left-1/2 -translate-x-1/2 transform'
              style={{
                bottom: '-6px',
                width: '12px',
                height: '6px',
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
              }}
            >
              <div className='h-full w-full bg-gray-900' />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoPin;
