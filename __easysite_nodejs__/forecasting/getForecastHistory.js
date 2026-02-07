import dayjs from "npm:dayjs@1.11.10";

/**
 * Get forecast history with optional filters
 * @param {string} startDate - Start date filter (ISO string)
 * @param {string} endDate - End date filter (ISO string)
 * @param {string} forecastType - Forecast type filter (short_term/long_term)
 */
export async function getForecastHistory(startDate, endDate, forecastType) {
  try {
    let sql = "SELECT * FROM forecasts WHERE 1=1";
    const parameters = [];
    
    if (startDate) {
      sql += " AND created_at >= @startDate";
      parameters.push({
        name: "startDate",
        value: startDate,
        valueType: "DateTime"
      });
    }
    
    if (endDate) {
      sql += " AND created_at <= @endDate";
      parameters.push({
        name: "endDate",
        value: endDate,
        valueType: "DateTime"
      });
    }
    
    if (forecastType && forecastType !== 'all') {
      sql += " AND forecast_type = @forecastType";
      parameters.push({
        name: "forecastType",
        value: forecastType,
        valueType: "String"
      });
    }
    
    sql += " ORDER BY created_at DESC LIMIT 100";
    
    const { data, error } = await easysite.sqlQuery({
      Sql: sql,
      Parameters: parameters
    });
    
    if (error) {
      throw new Error(error);
    }
    
    return data || [];
  } catch (error) {
    throw new Error(`Failed to retrieve forecast history: ${error.message}`);
  }
}

/**
 * Get latest forecasts (most recent batch)
 */
export async function getLatestForecasts() {
  try {
    const { data, error } = await easysite.sqlQuery({
      Sql: `
        SELECT * FROM forecasts 
        WHERE created_at = (SELECT MAX(created_at) FROM forecasts)
        ORDER BY target_timestamp ASC
      `,
      Parameters: []
    });
    
    if (error) {
      throw new Error(error);
    }
    
    return data || [];
  } catch (error) {
    throw new Error(`Failed to retrieve latest forecasts: ${error.message}`);
  }
}
