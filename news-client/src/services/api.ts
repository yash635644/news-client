/**
 * api.ts
 * Client-side API service for communicating with the News Backend.
 * Handles data fetching, authentication, and fallback logic.
 */

// Migrated to Backend API completely
const API_URL = import.meta.env.VITE_API_URL || '';

const mapCategory = (cat?: string) => {
  if (cat === 'Tech') return 'Technology';
  return cat || 'World';
};

/**
 * Hardcoded RSS Feeds for Fallback/Preview Mode.
 * Used when the backend is unavailable or for initial hydration.
 */
export const CLIENT_RSS_FEEDS: Record<string, string[]> = {
  India: [
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://feeds.feedburner.com/ndtvnews-top-stories',
    'https://www.thehindu.com/news/national/feeder/default.rss',
    'https://indianexpress.com/feed/',
    'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
    'https://www.news18.com/commonfeeds/v1/eng/india/xml'
  ],
  World: [
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.theguardian.com/world/rss',
    'http://rss.cnn.com/rss/edition_world.rss'
  ],
  Technology: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://arstechnica.com/feed/',
    'https://www.wired.com/feed/rss',
    'https://www.engadget.com/rss.xml'
  ],
  Sports: [
    'https://www.espn.com/espn/rss/news',
    'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0WE56k2johnp1&sportClass=general',
    'https://sports.yahoo.com/rss/'
  ],
  Business: [
    'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
    'https://www.livemint.com/rss/money',
    'https://www.economist.com/finance-and-economics/rss.xml'
  ],
  Environment: [
    'https://mongabay.com/feed/',
    'https://www.sciencedaily.com/rss/top/environment.xml'
  ],
  Education: [
    'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
    'https://www.educationdive.com/feeds/news/'
  ]
};

/**
 * Fetches RSS feeds directly from the browser as a fallback.
 * Uses rss2json.com to convert XML to JSON.
 */
const fetchClientSideRSS = async (category: string) => {
  if (category === 'Originals') return { articles: [] };

  let feedsToUse: string[] = [];

  try {
    // Try to get dynamic feeds from backend first
    if (API_URL) {
      const dynamicFeeds = await api.getRSSFeeds();
      const mappedCategory = mapCategory(category);
      // Filter by category
      feedsToUse = dynamicFeeds
        .filter((f: any) => f.category === mappedCategory || f.category === category)
        .map((f: any) => f.url);
    }
  } catch (e) {
    console.warn("Failed to fetch dynamic feeds for client-side fallback", e);
  }

  // If no dynamic feeds found (or backend down), use hardcoded fallback
  if (feedsToUse.length === 0) {
    feedsToUse = CLIENT_RSS_FEEDS[mapCategory(category)] || CLIENT_RSS_FEEDS['World'] || [];
  }

  const feedsToFetch = feedsToUse.slice(0, 4);

  try {
    const promises = feedsToFetch.map(url =>
      fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    let allArticles: any[] = [];

    results.forEach(data => {
      if (data && data.status === 'ok') {
        allArticles = [...allArticles, ...data.items.map((item: any) => ({
          title: item.title,
          summary: [item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'],
          link: item.link,
          pubDate: item.pubDate,
          source: data.feed.title,
          category: category,
          imageUrl: item.thumbnail || item.enclosure?.link
        }))];
      }
    });

    // Simple deduplication and sorting
    const sourceCounts: Record<string, number> = {};
    const diverseItems: any[] = [];
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    for (const item of allArticles) {
      const source = item.source || 'Unknown';
      if (!sourceCounts[source]) sourceCounts[source] = 0;
      if (sourceCounts[source] < 5) {
        sourceCounts[source]++;
        diverseItems.push(item);
      }
    }

    return { articles: diverseItems };

  } catch (e) {
    console.error("Client-side RSS fallback failed", e);
    return { articles: [] };
  }
};

/**
 * Performs a search on client-side RSS feeds.
 */
const clientSideSearch = async (query: string) => {
  const searchLower = query.toLowerCase();
  const categoriesToSearch = ['World', 'India', 'Technology'];

  const searchPromises = categoriesToSearch.map(async (cat) => {
    const feeds = CLIENT_RSS_FEEDS[cat].slice(0, 2);
    try {
      const catResults = await Promise.all(feeds.map(url =>
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => null)
      ));

      let catMatches: any[] = [];
      catResults.forEach(data => {
        if (data && data.status === 'ok') {
          const matches = data.items.filter((item: any) =>
            item.title.toLowerCase().includes(searchLower) ||
            (item.description && item.description.toLowerCase().includes(searchLower))
          );
          catMatches = [...catMatches, ...matches.map((item: any) => ({
            title: item.title,
            summary: [item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'],
            category: cat,
            source: data.feed.title,
            url: item.link,
            imageUrl: item.thumbnail || item.enclosure?.link,
            publishedAt: item.pubDate
          }))];
        }
      });
      return catMatches;
    } catch (e) { return []; }
  });

  const results = (await Promise.all(searchPromises)).flat();
  return { articles: results };
};

export const api = {
  /**
   * Generates AI content based on a prompt.
   * NOTE: This is primarily an Admin feature, but kept here for shared logic if needed.
   */
  /**
   * Generates AI content based on a prompt.
   */
  generateContent: async (prompt: string) => {
    if (!API_URL) return { headline: "AI Offline", summary: ["Backend unavailable."], category: "World", tags: ["Error"] };

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) throw new Error('Backend request failed');
      return await response.json();
    } catch (error) {
      return { headline: "AI Offline", summary: ["Backend unavailable."], category: "World", tags: ["Error"] };
    }
  },

  /**
   * Publishes a new Original News article.
   * (Ideally this shouldn't be in the client, but keeping for compatibility if used)
   */
  publishNews: async (newsData: any) => {
    if (!API_URL) throw new Error("Backend not configured");
    const response = await fetch(`${API_URL}/api/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (!response.ok) throw new Error('Failed to publish');
    return await response.json();
  },

  updateNews: async (id: string, newsData: any) => {
    if (!API_URL) throw new Error("Backend not configured");
    // Note: Backend needs PUT/PATCH endpoint for this, assuming one exists or using generic route
    // For now, assuming standard REST convention if backend supports it. 
    // If backend only has GET/POST/DELETE, this might fail, but removing Supabase is the priority.
    // Given the previous backend index.js, there is NO update endpoint? 
    // Checked index.js: DELETE exists, POST exists. PUT/PATCH is missing.
    // User asked to remove dependencies. I will leave this as a placeholder or throw error.
    throw new Error("Update feature requires backend implementation");
  },

  deleteNews: async (id: string) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/news/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete news');
      return true;
    }
    throw new Error('Backend unreachable');
  },

  /**
   * Searches for news articles by query.
   */
  searchNews: async (query: string) => {
    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error('Search request failed');
        return await response.json();
      } catch (error) {
        return await clientSideSearch(query);
      }
    }
    return await clientSideSearch(query);
  },

  /**
   * Fetches the Live Article Feed.
   * Prioritizes Backend API, falls back to Client-Side RSS.
   */
  getLiveFeed: async (category?: string, page: number = 1) => {
    const mappedCategory = mapCategory(category);

    // If API URL is configured, try backend
    if (API_URL) {
      try {
        const url = new URL(`${API_URL}/api/live-feed`);
        if (mappedCategory) url.searchParams.append('category', mappedCategory);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', '12');

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Backend feed request failed');
        return await response.json();
      } catch (error) {
        console.warn("Backend unavailable, using client-side fallback");
      }
    }

    // Default to Client-Side for Preview (No pagination support in fallback efficiently)
    return await fetchClientSideRSS(mappedCategory || 'World');
  },

  /**
   * Subscribes a user to the newsletter.
   */
  subscribe: async (data: { email: string, name?: string, whatsapp?: string }) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Subscription failed');
      return await res.json();
    }
    // Mock success for preview
    return { message: 'Subscribed' };
  },

  /**
   * Fetches the list of active RSS Feeds from the backend.
   */
  getRSSFeeds: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/rss-feeds`);
      if (!res.ok) throw new Error('Failed to fetch feeds');
      return await res.json();
    }
    return [];
  },

  /**
   * Fetches all Original News articles.
   */
  getOriginalNews: async () => {
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/news`);
        if (!res.ok) throw new Error('Failed to fetch originals');
        return await res.json();
      } catch (e) {
        console.error("Failed to fetch originals", e);
        return [];
      }
    }
    return [];
  }
};