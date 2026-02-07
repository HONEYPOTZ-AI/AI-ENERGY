/**
 * Get all blog categories (returns all published posts to extract unique categories)
 */
export async function getBlogCategories() {
  try {
    return {
      pageNo: 1,
      pageSize: 1000, // Get all to extract unique categories
      orderByField: 'category',
      isAsc: true,
      filters: [
        {
          name: "is_published",
          op: "Equal",
          value: true
        }
      ]
    };
  } catch (error) {
    throw new Error(`Failed to get categories: ${error.message}`);
  }
}