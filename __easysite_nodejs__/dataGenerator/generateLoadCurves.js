export function generateLoadCurves(startDate, endDate, params = {}) {
  const {
    baseLoad = 50,
    peakLoad = 100,
    seasonality = 0.2,
    noiseLevel = 0.1,
    weekendReduction = 0.3
  } = params;
  
  const dataPoints = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfYear = getDayOfYear(current);
    
    // Base load pattern (hourly)
    let load = baseLoad;
    
    // Daily pattern: peaks at 9am, 2pm, 7pm
    if (hour >= 6 && hour <= 9) {
      load += (peakLoad - baseLoad) * 0.8 * ((hour - 6) / 3);
    } else if (hour >= 9 && hour <= 12) {
      load += (peakLoad - baseLoad) * 0.8;
    } else if (hour >= 12 && hour <= 14) {
      load += (peakLoad - baseLoad) * 0.9;
    } else if (hour >= 14 && hour <= 17) {
      load += (peakLoad - baseLoad) * 0.7;
    } else if (hour >= 17 && hour <= 21) {
      load += (peakLoad - baseLoad) * 0.85;
    } else if (hour >= 21 && hour <= 23) {
      load += (peakLoad - baseLoad) * 0.4;
    } else {
      load += (peakLoad - baseLoad) * 0.1;
    }
    
    // Weekend reduction
    if (isWeekend) {
      load *= (1 - weekendReduction);
    }
    
    // Seasonal variation (summer higher, winter lower)
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * seasonality;
    load *= (1 + seasonalFactor);
    
    // Add noise
    const noise = (Math.random() - 0.5) * 2 * noiseLevel * load;
    load += noise;
    
    dataPoints.push({
      timestamp: current.toISOString(),
      value: Math.max(0, load),
      unit: 'MW'
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