export function generateCarbonIntensity(startDate, endDate, params = {}) {
  const {
    baseIntensity = 400,
    peakIntensity = 600,
    noiseLevel = 0.1,
    renewableShare = 0.3,
    timeInterval = 60,
    numCustomers = 1
  } = params;
  
  const dataPoints = [];
  const current = new Date(startDate);
  const intervalMs = timeInterval * 60 * 1000;
  
  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let intensity = baseIntensity;
    
    // Higher carbon intensity during peak demand (fossil fuels kick in)
    if (hour >= 7 && hour <= 9) {
      intensity += (peakIntensity - baseIntensity) * 0.7;
    } else if (hour >= 17 && hour <= 21) {
      intensity += (peakIntensity - baseIntensity) * 0.8;
    } else if (hour >= 12 && hour <= 14) {
      // Lower during midday (solar generation)
      intensity -= (peakIntensity - baseIntensity) * renewableShare * 0.5;
    }
    
    // Weekend typically lower intensity
    if (isWeekend) {
      intensity *= 0.9;
    }
    
    // Add noise
    const noise = (Math.random() - 0.5) * 2 * noiseLevel * intensity;
    intensity += noise;
    
    // Generate for each grid/region
    for (let i = 0; i < numCustomers; i++) {
      // Add regional variation
      const regionalVariation = 1 + (Math.random() - 0.5) * 0.15;
      dataPoints.push({
        timestamp: current.toISOString(),
        value: Math.max(0, intensity * regionalVariation),
        unit: 'gCO2/kWh',
        regionId: numCustomers > 1 ? `region_${i + 1}` : undefined
      });
    }
    
    current.setTime(current.getTime() + intervalMs);
  }
  
  return dataPoints;
}