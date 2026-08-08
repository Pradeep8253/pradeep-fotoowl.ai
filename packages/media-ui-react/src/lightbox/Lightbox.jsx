import React, { useEffect, useRef } from 'react';
import { useLightbox } from './useLightbox.js';

export function Lightbox({
  items,
  initialIndex,
  isOpen: controlledIsOpen,
  onClose,
  onActiveChange,
  renderItem,
  renderOverlay,
  renderCloseButton,
  renderNextButton,
  renderPreviousButton,
  rootProps = {},
}) {
  const {
    isOpen,
    activeIndex,
    activeItem,
    close,
    next,
    previous,
    getRootProps,
    getOverlayProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPreviousButtonProps,
  } = useLightbox({ items, initialIndex, onClose, onActiveChange });

  const isActuallyOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  
  // Manage focus trap
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isActuallyOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isActuallyOpen]);

  if (!isActuallyOpen || !activeItem) return null;

  return (
    <div 
      {...getRootProps(rootProps)} 
      ref={dialogRef}
      tabIndex={-1} 
      style={{ outline: 'none', ...rootProps.style }}
    >
      {renderOverlay && renderOverlay(getOverlayProps())}
      
      {renderItem && renderItem(activeItem, activeIndex)}

      {renderCloseButton && renderCloseButton(getCloseButtonProps())}
      {renderPreviousButton && renderPreviousButton(getPreviousButtonProps())}
      {renderNextButton && renderNextButton(getNextButtonProps())}
    </div>
  );
}
