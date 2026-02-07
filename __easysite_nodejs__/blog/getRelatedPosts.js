/**
 * Get related blog posts by category
 * @param {string} category - Category to match
 * @param {number} excludeId - ID of current post to exclude
 * @param {number} limit - Number of related posts to return (default: 3)
 */
export async function getRelatedPosts(category, excludeId, limit = 3) {
  try {
    if (!category) {
      throw new Error('Category is required');
    }
    
    const filters = [
      {
        name: "category",
        op: "Equal",
        value: category
      },
      {
        name: "is_published",
        op: "Equal",
        value: true
      }
    ];
    
    // Exclude current post if ID provided
    if (excludeId) {
      // We'll filter this on the frontend since we can't use NotEqual
    }
    
    return {
      pageNo: 1,
      pageSize: limit + 1, // Get one extra in case we need to exclude current
      orderByField: 'published_date',
      isAsc: false,
      filters
    };
  } catch (error) {
    throw new Error(`Failed to get related posts: ${error.message}`);
  }
}