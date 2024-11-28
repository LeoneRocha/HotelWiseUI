// sessionManager.ts

export const saveToSession = <T>(key: string, value: T): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  
  export const getFromSession = <T>(key: string): T | null => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
  
  export const removeFromSession = (key: string): void => {
    sessionStorage.removeItem(key);
  };
  