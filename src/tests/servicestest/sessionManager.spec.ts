// sessionManager.test.ts
import SessionManagerService from "../../services/general/sessionManagerService";

describe('sessionManagerService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('should save data to session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    SessionManagerService.saveToSession(key, value);

    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });

  test('should retrieve data from session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    sessionStorage.setItem(key, JSON.stringify(value));

    const retrievedValue = SessionManagerService.getFromSession<typeof value>(key);
    expect(retrievedValue).toEqual(value);
  });

  test('should return null if key does not exist in session storage', () => {
    const key = 'nonExistentKey';
    const retrievedValue = SessionManagerService.getFromSession(key);
    expect(retrievedValue).toBeNull();
  });

  test('should remove data from session storage', () => {
    const key = 'testKey';
    const value = { name: 'Test User', age: 30 };
    sessionStorage.setItem(key, JSON.stringify(value));

    SessionManagerService.removeFromSession(key);
    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBeNull();
  });
});
