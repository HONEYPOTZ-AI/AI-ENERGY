import dayjs from "npm:dayjs@1.11.10";

/**
 * Calculate forecast performance metrics
 * Compares forecasts against actual values
 */
export async function getForecastPerformance() {
  try {
    // Get forecasts with actual data for comparison
    const { data: forecasts, error: forecastError } = await easysite.sqlQuery({
      Sql: `
        SELECT 
          f.id,
          f.created_at,
          f.target_timestamp,
          f.predicted_load,
          f.confidence_score,
          f.forecast_type,
          f.model_version,
          e.load_value as actual_load
        FROM forecasts f
        LEFT JOIN energy_load_data e ON 
          DATE_TRUNC('hour', f.target_timestamp) = DATE_TRUNC('hour', e.timestamp)
        WHERE f.target_timestamp < NOW()
        ORDER BY f.created_at DESC
        LIMIT 200
      `,
      Parameters: []
    });
    
    if (forecastError) {
      throw new Error(forecastError);
    }
    
    if (!forecasts || forecasts.length === 0) {
      return {
        mape: 0,
        rmse: 0,
        mae: 0,
        accuracy: 0,
        totalForecasts: 0,
        forecastsWithActuals: 0
      };
    }
    
    // Filter forecasts that have actual values
    const validForecasts = forecasts.filter(f => f.actual_load !== null && f.actual_load !== undefined);
    
    if (validForecasts.length === 0) {
      return {
        mape: 0,
        rmse: 0,
        mae: 0,
        accuracy: 0,
        totalForecasts: forecasts.length,
        forecastsWithActuals: 0
      };
    }
    
    // Calculate metrics
    let sumAbsError = 0;
    let sumSquaredError = 0;
    let sumPercentError = 0;
    
    validForecasts.forEach(f => {
      const error = Math.abs(f.predicted_load - f.actual_load);
      const percentError = f.actual_load > 0 ? (error / f.actual_load) * 100 : 0;
      
      sumAbsError += error;
      sumSquaredError += error * error;
      sumPercentError += percentError;
    });
    
    const mae = sumAbsError / validForecasts.length;
    const rmse = Math.sqrt(sumSquaredError / validForecasts.length);
    const mape = sumPercentError / validForecasts.length;
    const accuracy = Math.max(0, 100 - mape);
    
    return {
      mape: parseFloat(mape.toFixed(2)),
      rmse: parseFloat(rmse.toFixed(2)),
      mae: parseFloat(mae.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2)),
      totalForecasts: forecasts.length,
      forecastsWithActuals: validForecasts.length,
      forecasts: validForecasts
    };
  } catch (error) {
    throw new Error(`Failed to calculate forecast performance: ${error.message}`);
  }
}
