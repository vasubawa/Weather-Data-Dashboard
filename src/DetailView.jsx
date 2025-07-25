import { useParams, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function DetailView({ weatherData }) {
  const { id } = useParams()
  const cityData = weatherData.find(item => String(item.id) === id)
  // Find city coordinates for map
  const cityCoords = (() => {
    if (!cityData) return null
    // Try to find the city in the App's cities array (hardcoded list)
    const cityList = [
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
      { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
      { name: 'San Antonio', lat: 29.4241, lon: -98.4936 },
      { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
      { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
      { name: 'San Jose', lat: 37.3382, lon: -121.8863 },
      { name: 'Austin', lat: 30.2672, lon: -97.7431 },
      { name: 'Jacksonville', lat: 30.3322, lon: -81.6557 },
      { name: 'Miami', lat: 25.7617, lon: -80.1918 },
      { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
      { name: 'Denver', lat: 39.7392, lon: -104.9903 },
      { name: 'Boston', lat: 42.3601, lon: -71.0589 },
      { name: 'Nashville', lat: 36.1627, lon: -86.7816 },
      { name: 'Portland', lat: 45.5152, lon: -122.6784 },
      { name: 'Las Vegas', lat: 36.1699, lon: -115.1398 },
      { name: 'Detroit', lat: 42.3314, lon: -83.0458 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
    ]
    return cityList.find(c => c.name === cityData.city)
  })()

  if (!cityData) {
    return (
      <div className="app">
        <div className="no-results">
          <p>City not found.</p>
          <Link to="/">Back to Dashboard</Link>
        </div>
      </div>
    )
  }


  // Show a city-specific chart for more detail
  const cityChartData = [
    { name: 'Temp (°F)', value: Math.round((cityData.temperature * 9) / 5 + 32) },
    { name: 'Humidity (%)', value: cityData.humidity },
    { name: 'Wind (km/h)', value: cityData.windSpeed },
    { name: 'Pressure (mb)', value: cityData.pressure },
    { name: 'Visibility (km)', value: cityData.visibility }
  ]

  // Chart: compare this city's temp to average of all cities
  const cToF = c => Math.round((c * 9) / 5 + 32)
  const avgTemp = weatherData.length > 0 ?
    cToF(weatherData.reduce((sum, item) => sum + item.temperature, 0) / weatherData.length) : 0
  const compareChartData = [
    { name: cityData.city, value: cToF(cityData.temperature) },
    { name: 'All Cities Avg', value: avgTemp }
  ]

  return (
    <div className="app">
      <header className="header">
        <h1>🌞 Weather Data Dashboard</h1>
        <p>Detail View for {cityData.city}</p>
        <Link to="/">← Back to Dashboard</Link>
      </header>
      <div className="weather-card" style={{ maxWidth: 500, margin: '2rem auto' }}>
        <div className="weather-header">
          <h3>{cityData.city}</h3>
        </div>
        <div className="weather-temp">
          <span className="temperature">{Math.round((cityData.temperature * 9) / 5 + 32)}°F</span>
          <span className="condition">{cityData.condition}</span>
        </div>
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Humidity:</span>
            <span className="detail-value">{cityData.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed:</span>
            <span className="detail-value">{cityData.windSpeed} km/h</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pressure:</span>
            <span className="detail-value">{cityData.pressure} mb</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Visibility:</span>
            <span className="detail-value">{cityData.visibility} km</span>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h4>City Weather Metrics</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cityChartData} layout="vertical" margin={{ left: 30, right: 30 }}>
              <XAxis type="number" tick={{ fill: '#FFD700', fontWeight: 600 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#FFD700', fontWeight: 600 }} />
              <Bar dataKey="value" fill="#FFD700" />
              <Tooltip contentStyle={{ background: '#222', color: '#FFD700', border: 'none' }} labelStyle={{ color: '#FFD700' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <h4>Temperature vs. All Cities Average</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={compareChartData} margin={{ left: 30, right: 30 }}>
              <XAxis dataKey="name" tick={{ fill: '#FFD700', fontWeight: 600 }} />
              <YAxis tick={{ fill: '#FFD700', fontWeight: 600 }} />
              <Bar dataKey="value" fill="#FFD700" />
              <Tooltip contentStyle={{ background: '#222', color: '#FFD700', border: 'none' }} labelStyle={{ color: '#FFD700' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {cityCoords && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <h4>City Location</h4>
            <img
              src={`https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${cityCoords.lon},${cityCoords.lat}&z=8&size=450,200&l=map&pt=${cityCoords.lon},${cityCoords.lat},pm2rdm`}
              alt={`Map of ${cityData.city}`}
              style={{ borderRadius: 12, border: '1px solid #ccc', maxWidth: '100%' }}
            />
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              Lat: {cityCoords.lat}, Lon: {cityCoords.lon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailView
