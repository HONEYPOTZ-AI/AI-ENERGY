import { generateLoadCurves } from './generateLoadCurves.js';
import { generateWeather } from './generateWeather.js';
import { generateCarbonIntensity } from './generateCarbonIntensity.js';
import { generatePrices } from './generatePrices.js';

export function generateDataset(datasetType, startDate, endDate, location, parameters) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    throw new Error('Start date must be before end date');
  }
  
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    throw new Error('Date range cannot exceed 365 days');
  }
  
  let dataPoints;
  
  switch (datasetType) {
    case 'load_curve':
      dataPoints = generateLoadCurves(start, end, parameters);
      break;
    case 'weather':
      dataPoints = generateWeather(start, end, location, parameters);
      break;
    case 'carbon_intensity':
      dataPoints = generateCarbonIntensity(start, end, parameters);
      break;
    case 'prices':
      dataPoints = generatePrices(start, end, parameters);
      break;
    default:
      throw new Error('Invalid dataset type');
  }
  
  return {
    datasetType,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    location,
    parameters,
    dataPoints,
    stats: calculateStats(dataPoints)
  };
}

function calculateStats(dataPoints) {
  const values = dataPoints.map(p => p.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: mean,
    stdDev,
    count: values.length
  };
}