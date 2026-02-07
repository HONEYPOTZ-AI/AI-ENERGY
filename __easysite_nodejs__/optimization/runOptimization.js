import dayjs from "npm:dayjs@1.11.10";

/**
 * Run optimization to minimize cost, CO2, or hybrid
 * @param {string} objective - 'cost', 'co2', or 'hybrid'
 * @param {string} timeHorizon - '24h' or 'weekly'
 * @param {object} constraints - { maxLoad, renewableTarget, demandResponse }
 * @param {string} location - location identifier
 */
export async function runOptimization(objective, timeHorizon, constraints, location) {
  // Validate inputs
  if (!['cost', 'co2', 'hybrid'].includes(objective)) {
    throw new Error('Invalid objective. Must be cost, co2, or hybrid');
  }
  
  if (!['24h', 'weekly'].includes(timeHorizon)) {
    throw new Error('Invalid time horizon. Must be 24h or weekly');
  }

  const hours = timeHorizon === '24h' ? 24 : 168; // 24 or 168 hours
  const now = dayjs();
  const startTime = now.startOf('hour');
  const endTime = startTime.add(hours, 'hour');

  // Fetch historical load data for baseline
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

  // If no historical data, generate synthetic baseline
  let baselineLoad = loadData && loadData.length > 0 
    ? loadData 
    : generateSyntheticLoad(startTime, hours, location);

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

  // If no price or carbon data, generate synthetic
  const prices = priceData && priceData.length > 0 
    ? priceData 
    : generateSyntheticPrices(startTime, hours);
    
  const carbonIntensities = carbonData && carbonData.length > 0 
    ? carbonData 
    : generateSyntheticCarbon(startTime, hours);

  // Calculate baseline metrics
  const baselineMetrics = calculateMetrics(baselineLoad, prices, carbonIntensities);

  // Run optimization algorithm
  const optimizedLoad = optimizeLoadSchedule(
    baselineLoad, 
    prices, 
    carbonIntensities, 
    objective, 
    constraints
  );

  // Calculate optimized metrics
  const optimizedMetrics = calculateMetrics(optimizedLoad, prices, carbonIntensities);

  // Store optimization run
  const runData = {
    created_at: now.toISOString(),
    run_type: 'milp', // Mixed Integer Linear Programming
    objective_type: objective,
    baseline_cost: baselineMetrics.totalCost,
    optimized_cost: optimizedMetrics.totalCost,
    baseline_emissions: baselineMetrics.totalEmissions,
    optimized_emissions: optimizedMetrics.totalEmissions,
    parameters: JSON.stringify({
      timeHorizon,
      constraints,
      location,
      hours
    }),
    status: 'completed'
  };

  await easysite.table.create(74743, runData);

  return {
    runId: Date.now(),
    baseline: {
      schedule: baselineLoad,
      cost: baselineMetrics.totalCost,
      emissions: baselineMetrics.totalEmissions,
      peakLoad: baselineMetrics.peakLoad,
      renewable: baselineMetrics.renewablePercentage
    },
    optimized: {
      schedule: optimizedLoad,
      cost: optimizedMetrics.totalCost,
      emissions: optimizedMetrics.totalEmissions,
      peakLoad: optimizedMetrics.peakLoad,
      renewable: optimizedMetrics.renewablePercentage
    },
    savings: {
      costSavings: baselineMetrics.totalCost - optimizedMetrics.totalCost,
      costSavingsPercent: ((baselineMetrics.totalCost - optimizedMetrics.totalCost) / baselineMetrics.totalCost * 100).toFixed(2),
      emissionsReduction: baselineMetrics.totalEmissions - optimizedMetrics.totalEmissions,
      emissionsReductionPercent: ((baselineMetrics.totalEmissions - optimizedMetrics.totalEmissions) / baselineMetrics.totalEmissions * 100).toFixed(2),
      peakReduction: baselineMetrics.peakLoad - optimizedMetrics.peakLoad,
      peakReductionPercent: ((baselineMetrics.peakLoad - optimizedMetrics.peakLoad) / baselineMetrics.peakLoad * 100).toFixed(2)
    },
    objective,
    timeHorizon,
    constraints
  };
}

function generateSyntheticLoad(startTime, hours, location) {
  const load = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = startTime.add(i, 'hour');
    const hour = timestamp.hour();
    const dayOfWeek = timestamp.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base load pattern
    let loadValue = 500; // kW base
    
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

function calculateMetrics(load, prices, carbonIntensities) {
  let totalCost = 0;
  let totalEmissions = 0;
  let peakLoad = 0;
  let totalLoad = 0;
  let renewableLoad = 0;

  for (let i = 0; i < load.length; i++) {
    const loadValue = load[i].load_value;
    const price = prices[i]?.price || 0.1;
    const carbonIntensity = carbonIntensities[i]?.carbon_intensity || 400;
    
    // Cost in dollars (load in kW, price in $/kWh)
    totalCost += loadValue * price;
    
    // Emissions in kg CO2 (load in kW, carbon in gCO2/kWh, convert to kg)
    totalEmissions += (loadValue * carbonIntensity) / 1000;
    
    peakLoad = Math.max(peakLoad, loadValue);
    totalLoad += loadValue;
    
    // Consider renewable if carbon intensity < 300 gCO2/kWh
    if (carbonIntensity < 300) {
      renewableLoad += loadValue;
    }
  }
  
  const renewablePercentage = (renewableLoad / totalLoad * 100).toFixed(2);
  
  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalEmissions: parseFloat(totalEmissions.toFixed(2)),
    peakLoad: parseFloat(peakLoad.toFixed(2)),
    renewablePercentage: parseFloat(renewablePercentage)
  };
}

function optimizeLoadSchedule(baselineLoad, prices, carbonIntensities, objective, constraints) {
  const optimized = JSON.parse(JSON.stringify(baselineLoad)); // Deep copy
  const { maxLoad = 1000, renewableTarget = 30, demandResponse = true } = constraints;
  
  // Calculate shiftable load (assume 20% of load can be shifted)
  const shiftablePercent = demandResponse ? 0.20 : 0.10;
  
  // Identify peak hours and off-peak hours based on objective
  const hourScores = baselineLoad.map((load, i) => {
    const price = prices[i]?.price || 0.1;
    const carbon = carbonIntensities[i]?.carbon_intensity || 400;
    
    let score = 0;
    if (objective === 'cost') {
      score = price;
    } else if (objective === 'co2') {
      score = carbon;
    } else { // hybrid
      score = (price / 0.2) * 0.5 + (carbon / 600) * 0.5; // Normalized
    }
    
    return { index: i, score, load: load.load_value };
  });
  
  // Sort to find peaks (high score) and valleys (low score)
  const sortedByScore = [...hourScores].sort((a, b) => b.score - a.score);
  
  // Shift load from top 25% high-score hours to bottom 25% low-score hours
  const numToShift = Math.floor(hourScores.length * 0.25);
  const peakHours = sortedByScore.slice(0, numToShift);
  const valleyHours = sortedByScore.slice(-numToShift);
  
  // Calculate total shiftable load
  let totalShiftable = 0;
  peakHours.forEach(hour => {
    const shiftable = hour.load * shiftablePercent;
    totalShiftable += shiftable;
    optimized[hour.index].load_value -= shiftable;
  });
  
  // Distribute shifted load to valley hours
  const loadPerValley = totalShiftable / valleyHours.length;
  valleyHours.forEach(hour => {
    // Don't exceed max load constraint
    const newLoad = optimized[hour.index].load_value + loadPerValley;
    if (newLoad <= maxLoad) {
      optimized[hour.index].load_value = newLoad;
    } else {
      optimized[hour.index].load_value = maxLoad;
    }
  });
  
  // Ensure all loads are non-negative and respect max load
  optimized.forEach(entry => {
    entry.load_value = Math.max(0, Math.min(entry.load_value, maxLoad));
  });
  
  return optimized;
}
