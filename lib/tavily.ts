import { tavily } from "@tavily/core";

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

const MOCK_TAVILY_RESPONSE: SearchResult[] = [
  { title: "Remote Work Burnout Stats 2024", url: "https://example.com/burnout", content: "70% of remote workers experience burnout due to lack of separation." },
  { title: "Top Mental Health Apps", url: "https://example.com/apps", content: "Current solutions lack team-integrated async check-ins." }
];

export async function performSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY || "";
  
  if (!apiKey || apiKey === "tvly-mock-key") {
    console.warn("Using mock Tavily response");
    await new Promise(res => setTimeout(res, 600));
    return MOCK_TAVILY_RESPONSE;
  }

  try {
    const tvly = tavily({ apiKey });
    const response = await tvly.search(query, { searchDepth: "basic", maxResults: 3 });
    return response.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.content
    }));
  } catch (error) {
    console.error("Tavily API failed, falling back to mock.", error);
    return MOCK_TAVILY_RESPONSE;
  }
}
