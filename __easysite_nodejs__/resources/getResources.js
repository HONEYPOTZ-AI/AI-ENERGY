
export async function getResources(type = null) {
  try {
    const filters = [];
    
    if (type) {
      filters.push({
        name: "type",
        op: "Equal",
        value: type
      });
    }

    const result = await easysite.database.tablePage(
      "resources",
      {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "publish_date",
        IsAsc: false,
        Filters: filters
      }
    );

    if (result.error) {
      throw new Error(result.error);
    }

    return result.data.List.map(resource => ({
      ...resource,
      results: resource.results ? JSON.parse(resource.results) : null,
      testimonial: resource.testimonial ? JSON.parse(resource.testimonial) : null,
      content: resource.content ? JSON.parse(resource.content) : null,
      toc: resource.toc ? JSON.parse(resource.toc) : null
    }));
  } catch (error) {
    throw new Error(`Failed to fetch resources: ${error.message}`);
  }
}
