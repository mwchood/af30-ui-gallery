import { TopBar } from './Primitives';

export function ScreenShell({ children, title, back = true, trailing = null, className = '', onBack, onPointerDownCapture }) {
  return (
    <div className={`af-screen ${className}`} onPointerDownCapture={onPointerDownCapture}>
      {title ? <TopBar title={title} back={back} trailing={trailing} onBack={onBack} /> : null}
      {children}
    </div>
  );
}
