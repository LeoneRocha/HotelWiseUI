// sessionManager.test.ts
import { getFromSession, removeFromSession, saveToSession } from "../../services/sessionManagerService";

describe('sessionManagerService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('should save data to session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    saveToSession(key, value);

    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });

  test('should retrieve data from session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    sessionStorage.setItem(key, JSON.stringify(value));

    const retrievedValue = getFromSession<typeof value>(key);
    expect(retrievedValue).toEqual(value);
  });

  test('should return null if key does not exist in session storage', () => {
    const key = 'nonExistentKey';
    const retrievedValue = getFromSession(key);
    expect(retrievedValue).toBeNull();
  });

  test('should remove data from session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    sessionStorage.setItem(key, JSON.stringify(value));

    removeFromSession(key);
    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBeNull();
  });
});
