import { URL_DOMAIN } from '../common/apiKey'

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

export const getUrlImage = (routeName: string, path: string) => {
  return `${URL_DOMAIN}/uploads/${path}/${routeName}`
}

export const handleDownload = (url: string, fileName?: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'downloaded-file'
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('Error fetching the file:', error)
    })
}
