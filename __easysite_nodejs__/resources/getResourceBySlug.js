
export async function getResourceBySlug(slug) {
  try {
    const result = await easysite.database.tablePage(
      "resources",
      {
        PageNo: 1,
        PageSize: 1,
        Filters: [
          {
            name: "slug",
            op: "Equal",
            value: slug
          }
        ]
      }
    );

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.data.List || result.data.List.length === 0) {
      return null;
    }

    const resource = result.data.List[0];
    
    return {
      ...resource,
      results: resource.results ? JSON.parse(resource.results) : null,
      testimonial: resource.testimonial ? JSON.parse(resource.testimonial) : null,
      content: resource.content ? JSON.parse(resource.content) : null,
      toc: resource.toc ? JSON.parse(resource.toc) : null
    };
  } catch (error) {
    throw new Error(`Failed to fetch resource: ${error.message}`);
  }
}
