import React, { ReactElement } from 'react';

export function Dialog({ children, width, visible }: DialogProps) {
  let { innerWidth } = window;
  width = width ? width : 600;
  let remainingSpace = innerWidth - width;
  return (
    <div
      style={{
        position: 'fixed',
        top: 100,
        bottom: 0,
        left: remainingSpace / 2,
        right: remainingSpace / 2,
        zIndex: 1000,
        outline: 0,
        width,
        height: '600px',
        borderRadius: 12,
        backgroundColor: `rgba(255, 255, 255, 1)`,
      }}
    >
      {children}
    </div>
  );
}

export interface DialogProps {
  children: ReactElement | ReactElement[] | null;
  visible: boolean;
  width?: number;
}
