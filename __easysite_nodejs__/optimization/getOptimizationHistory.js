/**
 * Get recent optimization runs
 * @param {number} limit - Number of runs to retrieve
 */
export async function getOptimizationHistory(limit = 10) {
  const query = `
    SELECT id, created_at, run_type, objective_type, 
           baseline_cost, optimized_cost, 
           baseline_emissions, optimized_emissions,
           parameters, status
    FROM optimization_runs
    ORDER BY created_at DESC
    LIMIT @limit
  `;
  
  const { data, error } = await easysite.sql.query({
    Sql: query,
    Parameters: [
      { name: 'limit', value: limit, valueType: 'Integer' }
    ]
  });
  
  if (error) throw new Error(error);
  
  // Calculate savings for each run
  return (data || []).map(run => ({
    ...run,
    costSavings: run.baseline_cost - run.optimized_cost,
    costSavingsPercent: ((run.baseline_cost - run.optimized_cost) / run.baseline_cost * 100).toFixed(2),
    emissionsReduction: run.baseline_emissions - run.optimized_emissions,
    emissionsReductionPercent: ((run.baseline_emissions - run.optimized_emissions) / run.baseline_emissions * 100).toFixed(2)
  }));
}
