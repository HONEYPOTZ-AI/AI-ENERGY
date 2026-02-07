/**
 * Get recent ESG reports
 * @param {number} limit - Number of reports to retrieve
 */
export async function getReportHistory(limit = 10) {
  const query = `
    SELECT id, report_date, report_type, 
           scope_1_emissions, scope_2_emissions, scope_3_emissions,
           total_energy_consumption, renewable_percentage,
           export_format
    FROM esg_reports
    ORDER BY report_date DESC
    LIMIT @limit
  `;
  
  const { data, error } = await easysite.sql.query({
    Sql: query,
    Parameters: [
      { name: 'limit', value: limit, valueType: 'Integer' }
    ]
  });
  
  if (error) throw new Error(error);
  
  return data || [];
}
