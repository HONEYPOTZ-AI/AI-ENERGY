import dayjs from "npm:dayjs@1.11.10";

/**
 * Run energy optimization to minimize cost, reduce carbon, or shave peaks
 * @param {string} optimizationType - 'cost_minimization', 'carbon_reduction', or 'peak_shaving'
 * @param {number} timeHorizon - Number of hours to optimize (e.g., 24, 168)
 * @param {number} storageCapacity - Energy storage capacity in kWh
 * @param {number} maxChargeRate - Maximum charge rate in kW
 * @param {number} maxDischargeRate - Maximum discharge rate in kW
 * @param {number} gridCapacity - Grid connection capacity in kW
 * @param {number} renewableCapacity - Renewable generation capacity in kW
 * @param {string} location - Location identifier
 */
export async function runOptimization(
  optimizationType,
  timeHorizon,
  storageCapacity,
  maxChargeRate,
  maxDischargeRate,
  gridCapacity,
  renewableCapacity,
  location
) {
  // Validate inputs
  const validTypes = ['cost_minimization', 'carbon_reduction', 'peak_shaving'];
  if (!validTypes.includes(optimizationType)) {
    throw new Error(`Invalid optimization type. Must be one of: ${validTypes.join(', ')}`);
  }
  
  if (timeHorizon < 1 || timeHorizon > 720) {
    throw new Error('Time horizon must be between 1 and 720 hours');
  }
  
  if (storageCapacity < 0 || maxChargeRate < 0 || maxDischargeRate < 0 || gridCapacity < 0 || renewableCapacity < 0) {
    throw new Error('All capacity and rate parameters must be non-negative');
  }

  const now = dayjs();
  const startTime = now.startOf('hour');
  const endTime = startTime.add(timeHorizon, 'hour');

  // Fetch historical load data
  const loadQuery = `
    SELECT timestamp, load_value 
    FROM energy_load_data 
    WHERE location = @location 
    AND timestamp >= @startTime 
    AND timestamp < @endTime
    ORDER BY timestamp
  `;
  
  const { data: loadData } = await easysite.sql.query({
    Sql: loadQuery,
    Parameters: [
      { name: 'location', value: location, valueType: 'String' },
      { name: 'startTime', value: startTime.toISOString(), valueType: 'DateTime' },
      { name: 'endTime', value: endTime.toISOString(), valueType: 'DateTime' }
    ]
  });

  // Fetch weather data for renewable generation
  const weatherQuery = `
    SELECT timestamp, temperature, solar_irradiance, wind_speed 
    FROM weather_data 
    WHERE location = @location 
    AND timestamp >= @startTime 
    AND timestamp < @endTime
    ORDER BY timestamp
  `;
  
  const { data: weatherData } = await easysite.sql.query({
    Sql: weatherQuery,
    Parameters: [
      { name: 'location', value: location, valueType: 'String' },
      { name: 'startTime', value: startTime.toISOString(), valueType: 'DateTime' },
      { name: 'endTime', value: endTime.toISOString(), valueType: 'DateTime' }
    ]
  });

  // Fetch electricity prices
  const priceQuery = `
    SELECT timestamp, price 
    FROM electricity_prices 
    WHERE region = @location 
    AND timestamp >= @startTime 
    AND timestamp < @endTime
    ORDER BY timestamp
  `;
  
  const { data: priceData } = await easysite.sql.query({
    Sql: priceQuery,
    Parameters: [
      { name: 'location', value: location, valueType: 'String' },
      { name: 'startTime', value: startTime.toISOString(), valueType: 'DateTime' },
      { name: 'endTime', value: endTime.toISOString(), valueType: 'DateTime' }
    ]
  });

  // Fetch carbon intensity
  const carbonQuery = `
    SELECT timestamp, carbon_intensity 
    FROM carbon_intensity 
    WHERE region = @location 
    AND timestamp >= @startTime 
    AND timestamp < @endTime
    ORDER BY timestamp
  `;
  
  const { data: carbonData } = await easysite.sql.query({
    Sql: carbonQuery,
    Parameters: [
      { name: 'location', value: location, valueType: 'String' },
      { name: 'startTime', value: startTime.toISOString(), valueType: 'DateTime' },
      { name: 'endTime', value: endTime.toISOString(), valueType: 'DateTime' }
    ]
  });

  // Generate synthetic data if database is empty
  const baselineLoad = (loadData && loadData.length > 0) 
    ? loadData 
    : generateSyntheticLoad(startTime, timeHorizon, location);
    
  const weather = (weatherData && weatherData.length > 0) 
    ? weatherData 
    : generateSyntheticWeather(startTime, timeHorizon);
    
  const prices = (priceData && priceData.length > 0) 
    ? priceData 
    : generateSyntheticPrices(startTime, timeHorizon);
    
  const carbonIntensities = (carbonData && carbonData.length > 0) 
    ? carbonData 
    : generateSyntheticCarbon(startTime, timeHorizon);

  // Calculate renewable generation from weather data
  const renewableGeneration = calculateRenewableGeneration(weather, renewableCapacity);

  // Calculate baseline metrics (no optimization)
  const baselineSchedule = createBaselineSchedule(
    baselineLoad,
    renewableGeneration,
    prices,
    carbonIntensities
  );
  
  const baselineMetrics = calculateMetrics(baselineSchedule);

  // Run optimization based on type
  let optimizedSchedule;
  switch (optimizationType) {
    case 'cost_minimization':
      optimizedSchedule = optimizeCost(
        baselineLoad,
        renewableGeneration,
        prices,
        carbonIntensities,
        storageCapacity,
        maxChargeRate,
        maxDischargeRate,
        gridCapacity
      );
      break;
    case 'carbon_reduction':
      optimizedSchedule = optimizeCarbon(
        baselineLoad,
        renewableGeneration,
        prices,
        carbonIntensities,
        storageCapacity,
        maxChargeRate,
        maxDischargeRate,
        gridCapacity
      );
      break;
    case 'peak_shaving':
      optimizedSchedule = optimizePeakShaving(
        baselineLoad,
        renewableGeneration,
        prices,
        carbonIntensities,
        storageCapacity,
        maxChargeRate,
        maxDischargeRate,
        gridCapacity
      );
      break;
  }

  const optimizedMetrics = calculateMetrics(optimizedSchedule);

  // Store optimization run in database
  const runData = {
    created_at: now.toISOString(),
    run_type: optimizationType,
    objective_type: optimizationType,
    baseline_cost: baselineMetrics.totalCost,
    optimized_cost: optimizedMetrics.totalCost,
    baseline_emissions: baselineMetrics.totalEmissions,
    optimized_emissions: optimizedMetrics.totalEmissions,
    parameters: JSON.stringify({
      timeHorizon,
      storageCapacity,
      maxChargeRate,
      maxDischargeRate,
      gridCapacity,
      renewableCapacity,
      location,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }),
    status: 'completed'
  };

  await easysite.table.create(74743, runData);

  // Return comprehensive results
  return {
    runId: Date.now(),
    optimizationType,
    timeHorizon,
    location,
    baseline: {
      schedule: baselineSchedule,
      metrics: baselineMetrics
    },
    optimized: {
      schedule: optimizedSchedule,
      metrics: optimizedMetrics
    },
    savings: {
      cost: {
        absolute: baselineMetrics.totalCost - optimizedMetrics.totalCost,
        percentage: calculatePercentageChange(baselineMetrics.totalCost, optimizedMetrics.totalCost)
      },
      emissions: {
        absolute: baselineMetrics.totalEmissions - optimizedMetrics.totalEmissions,
        percentage: calculatePercentageChange(baselineMetrics.totalEmissions, optimizedMetrics.totalEmissions)
      },
      peakDemand: {
        absolute: baselineMetrics.peakDemand - optimizedMetrics.peakDemand,
        percentage: calculatePercentageChange(baselineMetrics.peakDemand, optimizedMetrics.peakDemand)
      }
    },
    configuration: {
      storageCapacity,
      maxChargeRate,
      maxDischargeRate,
      gridCapacity,
      renewableCapacity
    }
  };
}

function generateSyntheticLoad(startTime, hours, location) {
  const load = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = startTime.add(i, 'hour');
    const hour = timestamp.hour();
    const dayOfWeek = timestamp.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let loadValue = 500; // Base load in kW
    
    // Morning peak (7-9 AM)
    if (hour >= 7 && hour <= 9) {
      loadValue += 300;
    }
    // Evening peak (17-21)
    else if (hour >= 17 && hour <= 21) {
      loadValue += 400;
    }
    // Midday (10-16)
    else if (hour >= 10 && hour <= 16) {
      loadValue += 150;
    }
    // Night (22-6)
    else {
      loadValue += 50;
    }
    
    // Weekend reduction
    if (isWeekend) {
      loadValue *= 0.8;
    }
    
    // Add noise
    loadValue += (Math.random() - 0.5) * 100;
    
    load.push({
      timestamp: timestamp.toISOString(),
      load_value: Math.max(0, loadValue)
    });
  }
  return load;
}

function generateSyntheticWeather(startTime, hours) {
  const weather = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = startTime.add(i, 'hour');
    const hour = timestamp.hour();
    
    // Solar irradiance (W/m²) - peaks at noon
    let solarIrradiance = 0;
    if (hour >= 6 && hour <= 18) {
      const hourFromNoon = Math.abs(hour - 12);
      solarIrradiance = Math.max(0, 1000 * (1 - hourFromNoon / 6));
    }
    
    // Wind speed (m/s) - random with slight variation
    const windSpeed = 5 + Math.random() * 10;
    
    // Temperature (°C)
    const temperature = 20 + 10 * Math.sin((hour - 6) * Math.PI / 12);
    
    weather.push({
      timestamp: timestamp.toISOString(),
      temperature,
      solar_irradiance: solarIrradiance,
      wind_speed: windSpeed
    });
  }
  return weather;
}

function generateSyntheticPrices(startTime, hours) {
  const prices = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = startTime.add(i, 'hour');
    const hour = timestamp.hour();
    
    let price = 0.08; // Base price $/kWh
    
    // Peak pricing
    if (hour >= 7 && hour <= 9) {
      price = 0.15;
    } else if (hour >= 17 && hour <= 21) {
      price = 0.18;
    } else if (hour >= 0 && hour < 6) {
      price = 0.05; // Off-peak
    }
    
    prices.push({
      timestamp: timestamp.toISOString(),
      price
    });
  }
  return prices;
}

function generateSyntheticCarbon(startTime, hours) {
  const carbon = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = startTime.add(i, 'hour');
    const hour = timestamp.hour();
    
    let intensity = 400; // Base gCO2/kWh
    
    // Higher during peaks (more fossil fuel generation)
    if (hour >= 7 && hour <= 9) {
      intensity = 550;
    } else if (hour >= 17 && hour <= 21) {
      intensity = 600;
    } else if (hour >= 12 && hour <= 14) {
      // Lower during midday (solar generation)
      intensity = 300;
    }
    
    carbon.push({
      timestamp: timestamp.toISOString(),
      carbon_intensity: intensity
    });
  }
  return carbon;
}

function calculateRenewableGeneration(weather, renewableCapacity) {
  return weather.map(w => {
    // Solar generation (assume 20% efficiency)
    const solarGeneration = (w.solar_irradiance / 1000) * renewableCapacity * 0.5 * 0.2;
    
    // Wind generation (simplified power curve)
    const windSpeed = w.wind_speed;
    let windGeneration = 0;
    if (windSpeed >= 3 && windSpeed <= 25) {
      windGeneration = renewableCapacity * 0.5 * Math.min(1, (windSpeed - 3) / 12);
    }
    
    return {
      timestamp: w.timestamp,
      generation: solarGeneration + windGeneration
    };
  });
}

function createBaselineSchedule(load, renewable, prices, carbon) {
  const schedule = [];
  
  for (let i = 0; i < load.length; i++) {
    const loadValue = load[i].load_value;
    const renewableGen = renewable[i].generation;
    const netLoad = Math.max(0, loadValue - renewableGen);
    
    schedule.push({
      timestamp: load[i].timestamp,
      load: loadValue,
      renewable: renewableGen,
      storage: 0,
      storageCharge: 0,
      storageDischarge: 0,
      storageSoC: 0,
      gridImport: netLoad,
      gridExport: Math.max(0, renewableGen - loadValue),
      netGrid: netLoad - Math.max(0, renewableGen - loadValue),
      price: prices[i].price,
      carbonIntensity: carbon[i].carbon_intensity
    });
  }
  
  return schedule;
}

function optimizeCost(load, renewable, prices, carbon, storageCapacity, maxChargeRate, maxDischargeRate, gridCapacity) {
  const schedule = [];
  let storageSoC = storageCapacity * 0.5; // Start at 50% capacity
  
  // Sort hours by price to identify charge/discharge opportunities
  const priceRanking = prices.map((p, i) => ({ index: i, price: p.price }))
    .sort((a, b) => a.price - b.price);
  
  const lowPriceHours = new Set(priceRanking.slice(0, Math.floor(prices.length * 0.3)).map(p => p.index));
  const highPriceHours = new Set(priceRanking.slice(-Math.floor(prices.length * 0.3)).map(p => p.index));
  
  for (let i = 0; i < load.length; i++) {
    const loadValue = load[i].load_value;
    const renewableGen = renewable[i].generation;
    const netLoad = loadValue - renewableGen;
    
    let storageCharge = 0;
    let storageDischarge = 0;
    
    if (netLoad > 0) {
      // Need to import energy
      if (highPriceHours.has(i) && storageSoC > 0) {
        // High price - discharge storage
        storageDischarge = Math.min(maxDischargeRate, storageSoC, netLoad);
        storageSoC -= storageDischarge;
      }
    } else {
      // Excess renewable energy
      if (storageSoC < storageCapacity) {
        // Charge storage with excess renewable
        storageCharge = Math.min(maxChargeRate, storageCapacity - storageSoC, -netLoad);
        storageSoC += storageCharge;
      }
    }
    
    // Additionally, charge from grid during low price hours
    if (lowPriceHours.has(i) && storageSoC < storageCapacity && netLoad > 0) {
      const additionalCharge = Math.min(maxChargeRate - storageCharge, storageCapacity - storageSoC, gridCapacity);
      storageCharge += additionalCharge;
      storageSoC += additionalCharge;
    }
    
    const gridImport = Math.max(0, netLoad + storageCharge - storageDischarge);
    const gridExport = Math.max(0, -(netLoad + storageCharge - storageDischarge));
    
    schedule.push({
      timestamp: load[i].timestamp,
      load: loadValue,
      renewable: renewableGen,
      storage: storageDischarge - storageCharge,
      storageCharge,
      storageDischarge,
      storageSoC,
      gridImport: Math.min(gridImport, gridCapacity),
      gridExport: Math.min(gridExport, gridCapacity),
      netGrid: gridImport - gridExport,
      price: prices[i].price,
      carbonIntensity: carbon[i].carbon_intensity
    });
  }
  
  return schedule;
}

function optimizeCarbon(load, renewable, prices, carbon, storageCapacity, maxChargeRate, maxDischargeRate, gridCapacity) {
  const schedule = [];
  let storageSoC = storageCapacity * 0.5;
  
  // Sort hours by carbon intensity
  const carbonRanking = carbon.map((c, i) => ({ index: i, intensity: c.carbon_intensity }))
    .sort((a, b) => a.intensity - b.intensity);
  
  const lowCarbonHours = new Set(carbonRanking.slice(0, Math.floor(carbon.length * 0.3)).map(c => c.index));
  const highCarbonHours = new Set(carbonRanking.slice(-Math.floor(carbon.length * 0.3)).map(c => c.index));
  
  for (let i = 0; i < load.length; i++) {
    const loadValue = load[i].load_value;
    const renewableGen = renewable[i].generation;
    const netLoad = loadValue - renewableGen;
    
    let storageCharge = 0;
    let storageDischarge = 0;
    
    if (netLoad > 0) {
      // Need to import energy
      if (highCarbonHours.has(i) && storageSoC > 0) {
        // High carbon - discharge storage to avoid dirty grid
        storageDischarge = Math.min(maxDischargeRate, storageSoC, netLoad);
        storageSoC -= storageDischarge;
      }
    } else {
      // Excess renewable energy - always charge storage
      if (storageSoC < storageCapacity) {
        storageCharge = Math.min(maxChargeRate, storageCapacity - storageSoC, -netLoad);
        storageSoC += storageCharge;
      }
    }
    
    // Charge from grid during low carbon hours
    if (lowCarbonHours.has(i) && storageSoC < storageCapacity && netLoad > 0) {
      const additionalCharge = Math.min(maxChargeRate - storageCharge, storageCapacity - storageSoC, gridCapacity * 0.5);
      storageCharge += additionalCharge;
      storageSoC += additionalCharge;
    }
    
    const gridImport = Math.max(0, netLoad + storageCharge - storageDischarge);
    const gridExport = Math.max(0, -(netLoad + storageCharge - storageDischarge));
    
    schedule.push({
      timestamp: load[i].timestamp,
      load: loadValue,
      renewable: renewableGen,
      storage: storageDischarge - storageCharge,
      storageCharge,
      storageDischarge,
      storageSoC,
      gridImport: Math.min(gridImport, gridCapacity),
      gridExport: Math.min(gridExport, gridCapacity),
      netGrid: gridImport - gridExport,
      price: prices[i].price,
      carbonIntensity: carbon[i].carbon_intensity
    });
  }
  
  return schedule;
}

function optimizePeakShaving(load, renewable, prices, carbon, storageCapacity, maxChargeRate, maxDischargeRate, gridCapacity) {
  const schedule = [];
  let storageSoC = storageCapacity * 0.5;
  
  // Calculate target peak (average of top 20% loads)
  const sortedLoads = [...load].sort((a, b) => b.load_value - a.load_value);
  const targetPeak = sortedLoads.slice(0, Math.floor(sortedLoads.length * 0.2))
    .reduce((sum, l) => sum + l.load_value, 0) / Math.floor(sortedLoads.length * 0.2) * 0.85;
  
  for (let i = 0; i < load.length; i++) {
    const loadValue = load[i].load_value;
    const renewableGen = renewable[i].generation;
    const netLoad = loadValue - renewableGen;
    
    let storageCharge = 0;
    let storageDischarge = 0;
    
    if (netLoad > targetPeak && storageSoC > 0) {
      // Peak demand - discharge storage
      storageDischarge = Math.min(maxDischargeRate, storageSoC, netLoad - targetPeak);
      storageSoC -= storageDischarge;
    } else if (netLoad < targetPeak * 0.7 && storageSoC < storageCapacity) {
      // Low demand - charge storage
      const availableCapacity = Math.min(
        maxChargeRate,
        storageCapacity - storageSoC,
        targetPeak * 0.7 - netLoad
      );
      if (netLoad < 0) {
        // Use excess renewable
        storageCharge = Math.min(availableCapacity, -netLoad);
      } else {
        // Charge from grid during low demand
        storageCharge = Math.min(availableCapacity, gridCapacity * 0.3);
      }
      storageSoC += storageCharge;
    }
    
    const gridImport = Math.max(0, netLoad + storageCharge - storageDischarge);
    const gridExport = Math.max(0, -(netLoad + storageCharge - storageDischarge));
    
    schedule.push({
      timestamp: load[i].timestamp,
      load: loadValue,
      renewable: renewableGen,
      storage: storageDischarge - storageCharge,
      storageCharge,
      storageDischarge,
      storageSoC,
      gridImport: Math.min(gridImport, gridCapacity),
      gridExport: Math.min(gridExport, gridCapacity),
      netGrid: gridImport - gridExport,
      price: prices[i].price,
      carbonIntensity: carbon[i].carbon_intensity
    });
  }
  
  return schedule;
}

function calculateMetrics(schedule) {
  let totalCost = 0;
  let totalEmissions = 0;
  let peakDemand = 0;
  let totalLoad = 0;
  let totalRenewable = 0;
  let totalGridImport = 0;
  let totalGridExport = 0;
  let totalStorageCharge = 0;
  let totalStorageDischarge = 0;
  
  for (const entry of schedule) {
    // Cost calculation (import cost - export revenue)
    totalCost += (entry.gridImport * entry.price) - (entry.gridExport * entry.price * 0.8);
    
    // Emissions calculation (only from grid import)
    totalEmissions += (entry.gridImport * entry.carbonIntensity) / 1000; // Convert to kg CO2
    
    // Peak demand (max grid import)
    peakDemand = Math.max(peakDemand, entry.gridImport);
    
    // Aggregate metrics
    totalLoad += entry.load;
    totalRenewable += entry.renewable;
    totalGridImport += entry.gridImport;
    totalGridExport += entry.gridExport;
    totalStorageCharge += entry.storageCharge;
    totalStorageDischarge += entry.storageDischarge;
  }
  
  const renewablePercentage = totalLoad > 0 ? (totalRenewable / totalLoad * 100) : 0;
  const selfConsumptionRate = totalRenewable > 0 ? ((totalRenewable - totalGridExport) / totalRenewable * 100) : 0;
  const storageEfficiency = totalStorageCharge > 0 ? (totalStorageDischarge / totalStorageCharge * 100) : 0;
  
  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalEmissions: parseFloat(totalEmissions.toFixed(2)),
    peakDemand: parseFloat(peakDemand.toFixed(2)),
    totalLoad: parseFloat(totalLoad.toFixed(2)),
    totalRenewable: parseFloat(totalRenewable.toFixed(2)),
    totalGridImport: parseFloat(totalGridImport.toFixed(2)),
    totalGridExport: parseFloat(totalGridExport.toFixed(2)),
    totalStorageCharge: parseFloat(totalStorageCharge.toFixed(2)),
    totalStorageDischarge: parseFloat(totalStorageDischarge.toFixed(2)),
    renewablePercentage: parseFloat(renewablePercentage.toFixed(2)),
    selfConsumptionRate: parseFloat(selfConsumptionRate.toFixed(2)),
    storageEfficiency: parseFloat(storageEfficiency.toFixed(2)),
    averageCostPerKWh: totalLoad > 0 ? parseFloat((totalCost / totalLoad).toFixed(4)) : 0,
    averageEmissionsPerKWh: totalLoad > 0 ? parseFloat((totalEmissions * 1000 / totalLoad).toFixed(2)) : 0
  };
}

function calculatePercentageChange(baseline, optimized) {
  if (baseline === 0) return 0;
  return parseFloat(((baseline - optimized) / baseline * 100).toFixed(2));
}
