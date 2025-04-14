// Helper function to handle localStorage operations
export const localStorageHelper = {
  getItem<T>(key: string, defaultValue: T): T {
    const savedItem = localStorage.getItem(key)
    if (savedItem) {
      try {
        return JSON.parse(savedItem) as T
      } catch {
        console.error(`Error parsing localStorage item with key "${key}"`)
      }
    }
    return defaultValue
  },

  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch {
      console.error(`Error stringifying value for key "${key}"`)
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}
