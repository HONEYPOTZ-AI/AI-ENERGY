/**
 * Get blog posts with filtering and pagination
 * @param {number} pageNo - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 12)
 * @param {string} category - Filter by category (optional)
 * @param {string} searchTerm - Search term for title/excerpt (optional)
 * @param {string} orderBy - Order by field (default: 'published_date')
 * @param {boolean} isAsc - Ascending order (default: false)
 */
export async function getBlogPosts(pageNo = 1, pageSize = 12, category = '', searchTerm = '', orderBy = 'published_date', isAsc = false) {
  try {
    const filters = [
      {
        name: "is_published",
        op: "Equal",
        value: true
      }
    ];
    
    if (category) {
      filters.push({
        name: "category",
        op: "Equal",
        value: category
      });
    }
    
    if (searchTerm) {
      // Note: This will filter by title containing search term
      filters.push({
        name: "title",
        op: "StringContains",
        value: searchTerm
      });
    }
    
    return {
      pageNo,
      pageSize,
      orderByField: orderBy,
      isAsc,
      filters
    };
  } catch (error) {
    throw new Error(`Failed to get blog posts: ${error.message}`);
  }
}