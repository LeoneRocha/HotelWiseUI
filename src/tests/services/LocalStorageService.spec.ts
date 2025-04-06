import LocalStorageService from "../../services/general/localStorageService";

 

describe('LocalStorageService', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should save an item to localStorage', () => {
    LocalStorageService.setItem('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
  });

  test('should get an item from localStorage', () => {
    localStorage.setItem('key', 'value');
    const item = LocalStorageService.getItem('key');
    expect(item).toBe('value');
  });

  test('should remove an item from localStorage', () => {
    localStorage.setItem('key', 'value');
    LocalStorageService.removeItem('key');
    expect(localStorage.getItem('key')).toBeNull();
  });

  test('should check if an item exists in localStorage', () => {
    localStorage.setItem('key', 'value');
    const exists = LocalStorageService.hasItem('key');
    expect(exists).toBe(true);

    const notExists = LocalStorageService.hasItem('nonExistentKey');
    expect(notExists).toBe(false);
  });

  test('should clear all items from localStorage', () => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    LocalStorageService.clear();
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });
});
