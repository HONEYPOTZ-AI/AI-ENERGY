/**
 * Remove duplicate blog posts from the database
 * Duplicates are identified by exact or very similar titles (case-insensitive)
 * Keeps the most recently created post (highest ID) and deletes others
 */
export async function removeDuplicates() {
  try {
    // Get all blog posts
    const { data: posts, error: queryError } = await apis.sqlQuery({
      Sql: "SELECT id, title, created_at FROM blog_posts ORDER BY id DESC",
      Parameters: []
    });

    if (queryError) {
      throw new Error(`Failed to fetch blog posts: ${queryError}`);
    }

    if (!posts || posts.length === 0) {
      return { removedCount: 0, message: "No blog posts found" };
    }

    // Group posts by normalized title (lowercase, trimmed)
    const titleGroups = new Map();
    
    for (const post of posts) {
      const normalizedTitle = post.title.toLowerCase().trim();
      
      if (!titleGroups.has(normalizedTitle)) {
        titleGroups.set(normalizedTitle, []);
      }
      titleGroups.get(normalizedTitle).push(post);
    }

    // Find and remove duplicates
    let removedCount = 0;
    const duplicateGroups = [];

    for (const [title, group] of titleGroups.entries()) {
      if (group.length > 1) {
        // Sort by ID descending (highest ID is most recent)
        group.sort((a, b) => b.id - a.id);
        
        // Keep the first one (highest ID), delete the rest
        const toKeep = group[0];
        const toDelete = group.slice(1);
        
        duplicateGroups.push({
          title: toKeep.title,
          kept: toKeep.id,
          deleted: toDelete.map(p => p.id)
        });

        // Delete duplicate posts
        for (const post of toDelete) {
          const { error: deleteError } = await apis.tableDelete(74747, { ID: post.id });
          
          if (deleteError) {
            console.error(`Failed to delete post ${post.id}:`, deleteError);
          } else {
            removedCount++;
          }
        }
      }
    }

    return {
      removedCount,
      duplicateGroups,
      message: removedCount > 0 
        ? `Successfully removed ${removedCount} duplicate blog post${removedCount > 1 ? 's' : ''}`
        : "No duplicate blog posts found"
    };

  } catch (error) {
    throw new Error(`Error removing duplicates: ${error.message}`);
  }
}
