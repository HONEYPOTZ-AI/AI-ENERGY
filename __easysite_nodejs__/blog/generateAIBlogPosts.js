/**
 * Generate SEO-optimized blog articles using AI and save to database
 * @param {string} apiKey - OpenAI or Anthropic API key
 * @param {string} provider - AI provider: 'openai' or 'anthropic' (default: 'openai')
 * @param {array} topicThemes - Optional array of specific topics/keywords to focus on
 * @param {string} author - Author name for the articles (default: 'AI Energy Optimizer Team')
 */

import axios from "npm:axios@1.6.2";
import dayjs from "npm:dayjs@1.11.10";

export async function generateAIBlogPosts(apiKey, provider = 'openai', topicThemes = [], author = 'AI Energy Optimizer Team') {
  try {
    if (!apiKey) {
      throw new Error('API key is required. Please provide OpenAI or Anthropic API key.');
    }

    // Default topics if none provided
    const defaultTopics = [
      'AI-Driven Energy Load Forecasting for Industrial Facilities',
      'Carbon Footprint Reduction Through Smart Energy Management',
      'ESG Reporting Automation: How AI Transforms Sustainability Compliance',
      'Real-Time Energy Optimization Using Machine Learning',
      'The Future of Renewable Energy Integration with AI Analytics'
    ];

    const topics = topicThemes.length >= 5 ? topicThemes.slice(0, 5) : defaultTopics;
    
    const generatedArticles = [];
    const categories = ['Technology', 'Sustainability', 'Guides', 'Industry Insights', 'Use Cases'];

    // Generate each article
    for (let i = 0; i < 5; i++) {
      const topic = topics[i];
      const category = categories[i % categories.length];
      
      console.log(`Generating article ${i + 1}/5: ${topic}`);
      
      const article = await generateSingleArticle(apiKey, provider, topic, category, author);
      generatedArticles.push(article);
      
      // Small delay to avoid rate limiting
      if (i < 4) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: true,
      message: `Successfully generated ${generatedArticles.length} blog articles`,
      articles: generatedArticles,
      articleIds: generatedArticles.map(a => a.id)
    };
    
  } catch (error) {
    throw new Error(`Failed to generate blog posts: ${error.message}`);
  }
}

async function generateSingleArticle(apiKey, provider, topic, category, author) {
  const prompt = `Create a comprehensive, SEO-optimized blog article about: "${topic}"

Requirements:
- Write a compelling, professional article of 800-1200 words
- Include an engaging title (max 60 characters)
- Write a meta description (max 160 characters)
- Create a brief excerpt (2-3 sentences)
- Include relevant tags (5-7 tags, comma-separated)
- Use clear headings and structure
- Focus on practical insights and industry trends
- Include actionable takeaways
- Write in a professional yet accessible tone

Format your response EXACTLY as JSON with these fields:
{
  "title": "Article title here",
  "excerpt": "Brief excerpt here",
  "content": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li> tags",
  "seo_title": "SEO optimized title",
  "seo_description": "Meta description",
  "tags": "tag1, tag2, tag3, tag4, tag5"
}`;

  let articleData;
  
  if (provider === 'anthropic') {
    articleData = await generateWithAnthropic(apiKey, prompt);
  } else {
    articleData = await generateWithOpenAI(apiKey, prompt);
  }

  // Generate slug from title
  const slug = generateSlug(articleData.title);
  
  // Calculate reading time (average 200 words per minute)
  const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Create article object matching database schema
  const article = {
    title: articleData.title,
    slug: slug,
    excerpt: articleData.excerpt,
    content: articleData.content,
    featured_image: '', // Will be set by frontend if needed
    category: category,
    tags: articleData.tags,
    author: author,
    published_date: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm:ss'),
    is_published: true,
    views: Math.floor(Math.random() * 500) + 100,
    seo_title: articleData.seo_title || articleData.title,
    seo_description: articleData.seo_description,
    reading_time: readingTime
  };

  return article;
}

async function generateWithOpenAI(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer specializing in energy optimization, sustainability, and AI technology. You create engaging, SEO-optimized content that is informative and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key.');
    }
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function generateWithAnthropic(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid Anthropic API key. Please check your API key.');
    }
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
