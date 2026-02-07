/**
 * Get a single blog post by slug
 * @param {string} slug - URL slug of the blog post
 */
export async function getBlogPostBySlug(slug) {
  try {
    if (!slug) {
      throw new Error('Slug is required');
    }
    
    return {
      pageNo: 1,
      pageSize: 1,
      orderByField: 'id',
      isAsc: false,
      filters: [
        {
          name: "slug",
          op: "Equal",
          value: slug
        },
        {
          name: "is_published",
          op: "Equal",
          value: true
        }
      ]
    };
  } catch (error) {
    throw new Error(`Failed to get blog post: ${error.message}`);
  }
}