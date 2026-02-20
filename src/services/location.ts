export interface Location {
  latitude: number
  longitude: number
  name: string
}

export async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'FishingForecastApp/1.0',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Geocoding failed')
    }
    
    const data = await response.json()
    
    const name = 
      data.address?.city || 
      data.address?.town || 
      data.address?.village || 
      data.address?.municipality ||
      data.address?.county ||
      data.name ||
      'Unknown Location'
    
    return name
  } catch {
    return 'Your Location'
  }
}

export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const name = await getLocationName(latitude, longitude)

        resolve({ latitude, longitude, name })
      },
      (error) => {
        reject(new Error(`Unable to get location: ${error.message}`))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

export const DEFAULT_LOCATION: Location = {
  latitude: 18.6435,
  longitude: 73.8983,
  name: 'Nande, Pune',
}
