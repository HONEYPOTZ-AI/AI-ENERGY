/**
 * Get optimization run history from database
 * @param {number} limit - Number of records to retrieve (default: 20)
 * @param {string} optimizationType - Filter by optimization type (optional)
 */
export async function getOptimizationHistory(limit = 20, optimizationType = null) {
  let query = `
    SELECT id, created_at, run_type, objective_type, 
           baseline_cost, optimized_cost, 
           baseline_emissions, optimized_emissions,
           parameters, status
    FROM optimization_runs
  `;
  
  const parameters = [];
  
  if (optimizationType) {
    query += ` WHERE run_type = @optimizationType`;
    parameters.push({ 
      name: 'optimizationType', 
      value: optimizationType, 
      valueType: 'String' 
    });
  }
  
  query += ` ORDER BY created_at DESC LIMIT @limit`;
  parameters.push({ 
    name: 'limit', 
    value: limit, 
    valueType: 'Integer' 
  });
  
  const { data, error } = await easysite.sql.query({
    Sql: query,
    Parameters: parameters
  });
  
  if (error) {
    throw new Error(`Failed to retrieve optimization history: ${error}`);
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Process and enrich the data
  return data.map(run => {
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(run.parameters || '{}');
    } catch (e) {
      parsedParams = {};
    }
    
    const costSavings = run.baseline_cost - run.optimized_cost;
    const costSavingsPercent = run.baseline_cost > 0 
      ? ((costSavings / run.baseline_cost) * 100).toFixed(2)
      : 0;
    
    const emissionsReduction = run.baseline_emissions - run.optimized_emissions;
    const emissionsReductionPercent = run.baseline_emissions > 0
      ? ((emissionsReduction / run.baseline_emissions) * 100).toFixed(2)
      : 0;
    
    return {
      id: run.id,
      createdAt: run.created_at,
      runType: run.run_type,
      objectiveType: run.objective_type,
      status: run.status,
      baseline: {
        cost: parseFloat(run.baseline_cost).toFixed(2),
        emissions: parseFloat(run.baseline_emissions).toFixed(2)
      },
      optimized: {
        cost: parseFloat(run.optimized_cost).toFixed(2),
        emissions: parseFloat(run.optimized_emissions).toFixed(2)
      },
      savings: {
        cost: {
          absolute: parseFloat(costSavings.toFixed(2)),
          percentage: parseFloat(costSavingsPercent)
        },
        emissions: {
          absolute: parseFloat(emissionsReduction.toFixed(2)),
          percentage: parseFloat(emissionsReductionPercent)
        }
      },
      configuration: {
        timeHorizon: parsedParams.timeHorizon || 24,
        storageCapacity: parsedParams.storageCapacity || 0,
        maxChargeRate: parsedParams.maxChargeRate || 0,
        maxDischargeRate: parsedParams.maxDischargeRate || 0,
        gridCapacity: parsedParams.gridCapacity || 0,
        renewableCapacity: parsedParams.renewableCapacity || 0,
        location: parsedParams.location || 'Unknown',
        startTime: parsedParams.startTime,
        endTime: parsedParams.endTime
      }
    };
  });
}

/**
 * Get optimization statistics summary
 */
export async function getOptimizationStats() {
  const query = `
    SELECT 
      COUNT(*) as total_runs,
      SUM(baseline_cost - optimized_cost) as total_cost_savings,
      SUM(baseline_emissions - optimized_emissions) as total_emissions_reduction,
      AVG(baseline_cost - optimized_cost) as avg_cost_savings,
      AVG(baseline_emissions - optimized_emissions) as avg_emissions_reduction,
      run_type
    FROM optimization_runs
    WHERE status = 'completed'
    GROUP BY run_type
  `;
  
  const { data, error } = await easysite.sql.query({
    Sql: query,
    Parameters: []
  });
  
  if (error) {
    throw new Error(`Failed to retrieve optimization stats: ${error}`);
  }
  
  if (!data || data.length === 0) {
    return {
      totalRuns: 0,
      totalCostSavings: 0,
      totalEmissionsReduction: 0,
      byType: []
    };
  }
  
  const totalRuns = data.reduce((sum, row) => sum + row.total_runs, 0);
  const totalCostSavings = data.reduce((sum, row) => sum + (row.total_cost_savings || 0), 0);
  const totalEmissionsReduction = data.reduce((sum, row) => sum + (row.total_emissions_reduction || 0), 0);
  
  return {
    totalRuns,
    totalCostSavings: parseFloat(totalCostSavings.toFixed(2)),
    totalEmissionsReduction: parseFloat(totalEmissionsReduction.toFixed(2)),
    byType: data.map(row => ({
      type: row.run_type,
      runs: row.total_runs,
      avgCostSavings: parseFloat((row.avg_cost_savings || 0).toFixed(2)),
      avgEmissionsReduction: parseFloat((row.avg_emissions_reduction || 0).toFixed(2))
    }))
  };
}
