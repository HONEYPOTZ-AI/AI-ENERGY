export function generatePrices(startDate, endDate, params = {}) {
  const {
    basePrice = 50,
    peakPrice = 150,
    noiseLevel = 0.1,
    seasonality = 0.3
  } = params;
  
  const dataPoints = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfYear = getDayOfYear(current);
    
    let price = basePrice;
    
    // Time-of-use pricing
    if (hour >= 0 && hour < 6) {
      // Off-peak (night)
      price = basePrice * 0.6;
    } else if (hour >= 6 && hour < 9) {
      // Morning peak
      price = peakPrice * 0.9;
    } else if (hour >= 9 && hour < 17) {
      // Mid-peak
      price = basePrice * 1.2;
    } else if (hour >= 17 && hour < 21) {
      // Evening peak
      price = peakPrice;
    } else {
      // Evening off-peak
      price = basePrice * 0.8;
    }
    
    // Weekend discount
    if (isWeekend) {
      price *= 0.85;
    }
    
    // Seasonal variation (higher in summer/winter)
    const seasonalFactor = Math.abs(Math.sin((dayOfYear / 365) * 2 * Math.PI)) * seasonality;
    price *= (1 + seasonalFactor);
    
    // Add noise
    const noise = (Math.random() - 0.5) * 2 * noiseLevel * price;
    price += noise;
    
    dataPoints.push({
      timestamp: current.toISOString(),
      value: Math.max(0, price),
      unit: '$/MWh'
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