export function generateWeather(startDate, endDate, location, params = {}) {
  const {
    avgTemp = 20,
    tempRange = 15,
    seasonality = 0.8,
    noiseLevel = 0.15
  } = params;
  
  const dataPoints = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfYear = getDayOfYear(current);
    
    // Seasonal temperature variation
    const seasonalTemp = avgTemp + (tempRange * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2)) * seasonality;
    
    // Daily variation (cooler at night, warmer during day)
    const dailyVariation = 5 * Math.sin(((hour - 6) / 24) * 2 * Math.PI);
    
    // Temperature with noise
    const temperature = seasonalTemp + dailyVariation + (Math.random() - 0.5) * noiseLevel * 10;
    
    // Humidity (inversely correlated with temperature)
    const baseHumidity = 70 - (temperature - avgTemp) * 1.5;
    const humidity = Math.max(20, Math.min(100, baseHumidity + (Math.random() - 0.5) * 20));
    
    // Wind speed (random with some correlation to season)
    const baseWind = 10 + Math.abs(Math.sin((dayOfYear / 365) * 2 * Math.PI)) * 5;
    const windSpeed = Math.max(0, baseWind + (Math.random() - 0.5) * 8);
    
    dataPoints.push({
      timestamp: current.toISOString(),
      value: temperature,
      humidity,
      windSpeed,
      unit: '°C'
    });
    
    current.setHours(current.getHours() + 1);
  }
  
  return dataPoints;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}