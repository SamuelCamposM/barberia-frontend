import React, { useRef, MouseEvent } from 'react';

interface DraggableProps {
  children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: MouseEvent) => {
    const draggable = ref.current;
    if (!draggable) return;

    const rect = draggable.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      draggable.style.left = `${moveEvent.clientX - offsetX}px`;
      draggable.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={ref} 
      onMouseDown={handleMouseDown}
      style={{ position: 'absolute' }} // Agrega esta línea
    >
      {children}
    </div>
  );
};

export default Draggable;
