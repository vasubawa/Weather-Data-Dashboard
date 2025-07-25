import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import DetailView from './DetailView.jsx'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [temperatureFilter, setTemperatureFilter] = useState('all')
  const [weatherFilter, setWeatherFilter] = useState('all')

  const cities = [
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

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        const weatherPromises = cities.map(async (city, index) => {
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m,visibility&timezone=auto`
            )
            if (!response.ok) {
              throw new Error(`Failed to fetch weather for ${city.name}`)
            }
            const data = await response.json()
            const current = data.current
            const getWeatherCondition = (code) => {
              if (code === 0) return 'Clear'
              if (code >= 1 && code <= 3) return 'Partly Cloudy'
              if (code >= 45 && code <= 48) return 'Fog'
              if (code >= 51 && code <= 67) return 'Rain'
              if (code >= 71 && code <= 77) return 'Snow'
              if (code >= 80 && code <= 82) return 'Rain'
              if (code >= 85 && code <= 86) return 'Snow'
              if (code >= 95 && code <= 99) return 'Thunderstorm'
              return 'Clear'
            }
            return {
              id: index + 1,
              city: city.name,
              temperature: Math.round(current.temperature_2m),
              condition: getWeatherCondition(current.weather_code),
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m * 3.6),
              pressure: Math.round(current.surface_pressure),
              visibility: Math.round((current.visibility || 10000) / 1000)
            }
          } catch (error) {
            console.error(`Error fetching weather for ${city.name}:`, error)
            return null
          }
        })
        const results = await Promise.all(weatherPromises)
        const validResults = results.filter(result => result !== null)
        setWeatherData(validResults)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching weather data:', error)
        setLoading(false)
      }
    }
    fetchWeatherData()
  }, [])

  // Helper to convert Celsius to Fahrenheit
  const cToF = (c) => Math.round((c * 9) / 5 + 32)

  const filteredData = weatherData.filter(item => {
    const tempF = cToF(item.temperature)
    const matchesSearch = item.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTemperature = temperatureFilter === 'all' || 
      (temperatureFilter === 'hot' && tempF > 77) || // >25C = >77F
      (temperatureFilter === 'warm' && tempF >= 59 && tempF <= 77) || // 15-25C = 59-77F
      (temperatureFilter === 'cold' && tempF < 59) // <15C = <59F
    const matchesWeather = weatherFilter === 'all' || 
      item.condition.toLowerCase().includes(weatherFilter.toLowerCase())
    return matchesSearch && matchesTemperature && matchesWeather
  })

  const totalCities = weatherData.length
  const averageTemp = weatherData.length > 0 ? 
    cToF(weatherData.reduce((sum, item) => sum + item.temperature, 0) / weatherData.length) : 0
  const hottestCity = weatherData.reduce((max, item) => 
    item.temperature > max.temperature ? item : max, weatherData[0] || { city: 'N/A', temperature: 0 })
  const averageHumidity = weatherData.length > 0 ? 
    Math.round(weatherData.reduce((sum, item) => sum + item.humidity, 0) / weatherData.length) : 0

  const getWeatherIcon = (condition) => {
    switch(condition.toLowerCase()) {
      case 'clear':
      case 'sunny': return '☀️'
      case 'partly cloudy': return '⛅'
      case 'cloudy':
      case 'overcast': return '☁️'
      case 'rain':
      case 'rainy': return '🌧️'
      case 'thunderstorm':
      case 'thunderstorms': return '⛈️'
      case 'snow':
      case 'snowy': return '❄️'
      case 'fog':
      case 'mist':
      case 'haze': return '🌫️'
      case 'drizzle': return '🌦️'
      default: return '🌤️'
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    )
  }

  // Chart 1: Bar chart of temperature by city
  const tempData = weatherData.map(item => ({
    city: item.city,
    tempF: cToF(item.temperature)
  }))

  // Chart 2: Pie chart of weather conditions
  const conditionCounts = weatherData.reduce((acc, item) => {
    acc[item.condition] = (acc[item.condition] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(conditionCounts).map(([name, value]) => ({ name, value }))
  const pieColors = ['#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700']

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <header className="header">
            <h1>🌞 Weather Data Dashboard</h1>
            <p>Real-time weather data from around the world</p>
          </header>

          <div className="summary-stats">
            <div className="stat-card">
              <h3>Total Cities</h3>
              <p className="stat-number">{totalCities}</p>
            </div>
            <div className="stat-card">
              <h3>Average Temperature</h3>
              <p className="stat-number">{averageTemp}°F</p>
            </div>
            <div className="stat-card">
              <h3>Hottest City</h3>
              <p className="stat-number">{hottestCity.city}</p>
              <p className="stat-detail">{cToF(hottestCity.temperature)}°F</p>
            </div>
            <div className="stat-card">
              <h3>Average Humidity</h3>
              <p className="stat-number">{averageHumidity}%</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, minWidth: 320, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Temperature by City (°F)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tempData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                  <XAxis dataKey="city" angle={-30} textAnchor="end" interval={0} height={80} tick={{ fontSize: 12, fill: '#FFD700', fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#FFD700', fontWeight: 600 }} />
                  <Tooltip contentStyle={{ background: '#222', color: '#FFD700', border: 'none' }} labelStyle={{ color: '#FFD700' }} />
                  <Bar dataKey="tempF" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 320, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Weather Condition Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fill: '#FFD700', fontWeight: 600 }}>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#222', color: '#FFD700', border: 'none' }} labelStyle={{ color: '#FFD700' }} />
                  <Legend wrapperStyle={{ color: '#FFD700' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
              <select 
                value={temperatureFilter} 
                onChange={(e) => setTemperatureFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Temperatures</option>
                <option value="hot">Hot (&gt;25°C)</option>
                <option value="warm">Warm (15-25°C)</option>
                <option value="cold">Cold (&lt;15°C)</option>
              </select>
              <select 
                value={weatherFilter} 
                onChange={(e) => setWeatherFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Weather</option>
                <option value="sunny">Sunny</option>
                <option value="cloudy">Cloudy</option>
                <option value="rainy">Rainy</option>
                <option value="snowy">Snowy</option>
              </select>
            </div>
          </div>

          <div className="weather-grid">
            {filteredData.map(item => (
              <Link key={item.id} to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="weather-card">
                  <div className="weather-header">
                    <h3>{item.city}</h3>
                    <span className="weather-icon">{getWeatherIcon(item.condition)}</span>
                  </div>
                  <div className="weather-temp">
                    <span className="temperature">{cToF(item.temperature)}°F</span>
                    <span className="condition">{item.condition}</span>
                  </div>
                  <div className="weather-details">
                    <div className="detail-item">
                      <span className="detail-label">Humidity:</span>
                      <span className="detail-value">{item.humidity}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Wind:</span>
                      <span className="detail-value">{item.windSpeed} km/h</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pressure:</span>
                      <span className="detail-value">{item.pressure} mb</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Visibility:</span>
                      <span className="detail-value">{item.visibility} km</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="no-results">
              <p>No weather data found matching your criteria.</p>
            </div>
          )}
        </div>
      } />
      <Route path="/detail/:id" element={<DetailView weatherData={weatherData} />} />
    </Routes>
  )
}

export default App
