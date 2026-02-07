import dayjs from "npm:dayjs@1.11.10";

/**
 * Generate time-series forecast using statistical methods
 * @param {number} horizon - Forecast horizon in hours (1-24)
 * @param {string} targetMetric - Target metric (load/price/carbon)
 * @param {string} location - Location identifier
 * @param {object} features - Feature flags {weather, historical, timeFeatures}
 * @param {string} modelType - Model type (LSTM, Hybrid)
 */
export async function generateForecast(horizon, targetMetric, location, features, modelType) {
  try {
    // Validate inputs
    if (horizon < 1 || horizon > 24) {
      throw new Error("Forecast horizon must be between 1 and 24 hours");
    }

    // Get historical data
    const historicalData = await getHistoricalData(location, targetMetric);
    
    if (historicalData.length < 24) {
      throw new Error("Insufficient historical data for forecasting (minimum 24 hours required)");
    }

    // Calculate baseline statistics
    const statistics = calculateStatistics(historicalData);
    
    // Generate forecasts for each hour
    const forecasts = [];
    const now = dayjs();
    
    for (let h = 1; h <= horizon; h++) {
      const targetTime = now.add(h, 'hour');
      const hourOfDay = targetTime.hour();
      const dayOfWeek = targetTime.day();
      
      // Apply forecasting algorithm
      let predictedValue;
      let confidenceScore;
      
      if (modelType === 'LSTM') {
        // LSTM-style prediction with more weight on recent data
        const result = lstmStyleForecast(historicalData, hourOfDay, dayOfWeek, features, statistics);
        predictedValue = result.value;
        confidenceScore = result.confidence;
      } else {
        // Hybrid approach (moving average + seasonality + trend)
        const result = hybridForecast(historicalData, hourOfDay, dayOfWeek, features, statistics);
        predictedValue = result.value;
        confidenceScore = result.confidence;
      }
      
      forecasts.push({
        target_timestamp: targetTime.toISOString(),
        predicted_load: predictedValue,
        confidence_score: confidenceScore,
        forecast_type: horizon <= 6 ? 'short_term' : 'long_term',
        model_version: `${modelType}_v1.0`,
        created_at: now.toISOString()
      });
    }

    // Store forecasts in database
    for (const forecast of forecasts) {
      await easysite.table.create(74742, forecast);
    }

    // Calculate confidence intervals
    const forecastsWithIntervals = forecasts.map(f => ({
      ...f,
      lower_bound: f.predicted_load * (1 - (1 - f.confidence_score) * 2),
      upper_bound: f.predicted_load * (1 + (1 - f.confidence_score) * 2)
    }));

    return {
      forecasts: forecastsWithIntervals,
      metadata: {
        horizon,
        targetMetric,
        location,
        modelType,
        features,
        statistics
      }
    };
  } catch (error) {
    throw new Error(`Forecast generation failed: ${error.message}`);
  }
}

async function getHistoricalData(location, targetMetric) {
  // Get last 7 days of data
  const query = {
    Sql: "SELECT timestamp, load_value FROM energy_load_data WHERE location = @location ORDER BY timestamp DESC LIMIT 168",
    Parameters: [
      {
        name: "location",
        value: location || "default",
        valueType: "String"
      }
    ]
  };

  const { data, error } = await easysite.sqlQuery(query);
  
  if (error) {
    throw new Error(error);
  }

  return (data || []).reverse();
}

function calculateStatistics(data) {
  const values = data.map(d => d.load_value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate hourly averages
  const hourlyAverages = {};
  const hourlyCounts = {};
  
  data.forEach(d => {
    const hour = dayjs(d.timestamp).hour();
    if (!hourlyAverages[hour]) {
      hourlyAverages[hour] = 0;
      hourlyCounts[hour] = 0;
    }
    hourlyAverages[hour] += d.load_value;
    hourlyCounts[hour]++;
  });
  
  for (let hour in hourlyAverages) {
    hourlyAverages[hour] /= hourlyCounts[hour];
  }
  
  // Calculate daily averages
  const dailyAverages = {};
  const dailyCounts = {};
  
  data.forEach(d => {
    const day = dayjs(d.timestamp).day();
    if (!dailyAverages[day]) {
      dailyAverages[day] = 0;
      dailyCounts[day] = 0;
    }
    dailyAverages[day] += d.load_value;
    dailyCounts[day]++;
  });
  
  for (let day in dailyAverages) {
    dailyAverages[day] /= dailyCounts[day];
  }
  
  return {
    mean,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    hourlyAverages,
    dailyAverages
  };
}

function lstmStyleForecast(data, hourOfDay, dayOfWeek, features, statistics) {
  // LSTM-style: exponential weighted average with more weight on recent data
  const recentData = data.slice(-48); // Last 48 hours
  let weightedSum = 0;
  let weightTotal = 0;
  
  recentData.forEach((d, i) => {
    const weight = Math.exp(i / recentData.length);
    weightedSum += d.load_value * weight;
    weightTotal += weight;
  });
  
  let predictedValue = weightedSum / weightTotal;
  
  // Apply time features
  if (features.timeFeatures) {
    const hourlyFactor = statistics.hourlyAverages[hourOfDay] / statistics.mean;
    const dailyFactor = statistics.dailyAverages[dayOfWeek] / statistics.mean;
    predictedValue *= (hourlyFactor * 0.6 + dailyFactor * 0.4);
  }
  
  // Calculate confidence based on recent volatility
  const recentVolatility = calculateVolatility(recentData);
  const confidenceScore = Math.max(0.5, 1 - (recentVolatility / statistics.stdDev));
  
  return {
    value: Math.max(0, predictedValue),
    confidence: confidenceScore
  };
}

function hybridForecast(data, hourOfDay, dayOfWeek, features, statistics) {
  // Hybrid: Moving average + seasonality + trend
  const windowSize = 24;
  const recentData = data.slice(-windowSize);
  
  // Moving average
  const ma = recentData.reduce((a, b) => a + b.load_value, 0) / recentData.length;
  
  // Trend component
  let trend = 0;
  if (data.length >= 48) {
    const oldAvg = data.slice(-48, -24).reduce((a, b) => a + b.load_value, 0) / 24;
    const newAvg = data.slice(-24).reduce((a, b) => a + b.load_value, 0) / 24;
    trend = newAvg - oldAvg;
  }
  
  // Seasonal component
  let seasonalFactor = 1;
  if (features.timeFeatures) {
    const hourlyFactor = statistics.hourlyAverages[hourOfDay] / statistics.mean;
    const dailyFactor = statistics.dailyAverages[dayOfWeek] / statistics.mean;
    seasonalFactor = (hourlyFactor * 0.7 + dailyFactor * 0.3);
  }
  
  let predictedValue = (ma + trend) * seasonalFactor;
  
  // Calculate confidence
  const volatility = calculateVolatility(recentData);
  const confidenceScore = Math.max(0.6, 1 - (volatility / (statistics.stdDev * 1.5)));
  
  return {
    value: Math.max(0, predictedValue),
    confidence: confidenceScore
  };
}

function calculateVolatility(data) {
  if (data.length < 2) return 0;
  
  const values = data.map(d => d.load_value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  
  return Math.sqrt(variance);
}
