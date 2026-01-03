import { useEffect } from 'react';

export function useSecurityProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Element inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection (optional - can be intrusive)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection in inputs and textareas
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
    };

    // Detect DevTools open (basic detection)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools might be open - you can add custom behavior here
        console.clear();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable console methods in production
    if (import.meta.env.PROD) {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.info = () => {};
      console.debug = () => {};
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);
}
