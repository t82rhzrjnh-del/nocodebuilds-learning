import { NextResponse } from 'next/server'

type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  pushed_at: string
  updated_at: string
  topics?: string[]
  owner: {
    login: string
  }
}

type GitHubSearchResponse = {
  items: GitHubRepo[]
}

type RadarItem = {
  id: number
  name: string
  fullName: string
  url: string
  description: string
  stars: number
  updatedAt: string
  freshness: string
  monetizationPath: string
  whyItCouldMakeMoney: string
  firstIdea: string
}

const SEARCH_QUERIES = [
  'modelcontextprotocol in:name,description archived:false',
  '"model context protocol" in:name,description archived:false',
  '"mcp server" in:name,description archived:false',
  'mcp in:name archived:false',
  '"mcp" "browser automation" in:name,description archived:false',
  '"mcp" "playwright" in:name,description archived:false',
  '"mcp" "canva" in:name,description archived:false',
  '"mcp" "content" in:name,description archived:false',
  '"mcp" "social" in:name,description archived:false',
]

function isRelevantRepo(repo: GitHubRepo) {
  const haystack = `${repo.name} ${repo.full_name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()
  const mentionsMcp = /\bmcp\b|model context protocol|modelcontextprotocol/.test(haystack)
  const looksLikeTool = /server|integration|tool|github|drive|gmail|calendar|filesystem|playwright|browser|vercel|cloudflare|memory|canva|search/.test(haystack)
  const strongProtocolSignal = /model context protocol|modelcontextprotocol|mcp server|mcp integration/.test(haystack) || /mcp-server|server-mcp/.test(repo.name.toLowerCase())
  return strongProtocolSignal || (mentionsMcp && looksLikeTool)
}

function daysSince(dateString: string) {
  const then = new Date(dateString).getTime()
  const now = Date.now()
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)))
}

function freshnessLabel(updatedAt: string) {
  const days = daysSince(updatedAt)
  if (days <= 7) return 'new this week'
  if (days <= 30) return 'new this month'
  if (days <= 90) return 'recent'
  return 'older'
}

function classifyRepo(repo: GitHubRepo) {
  const haystack = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()

  if (/(higgsfield|kling|video|social|content|creator|creative|image|canva|ad creative|thumbnail)/.test(haystack)) {
    return {
      monetizationPath: 'content and creative production',
      whyItCouldMakeMoney: 'Useful for content pipelines, creative production, and creator or agency offer workflows.',
      firstIdea: 'Package it into a content automation flow that turns one brief into prompt drafts, assets, and publish-ready outputs.',
    }
  }

  if (/(gmail|mail|email|outreach|sales|crm)/.test(haystack)) {
    return {
      monetizationPath: 'sales and outreach automation',
      whyItCouldMakeMoney: 'Useful for follow-ups, prospect research, inbox workflows, and sales support offers.',
      firstIdea: 'Package it into a founder or sales-team inbox workflow with reply drafting and follow-up prompts.',
    }
  }
  if (/(drive|docs|knowledge|search|memory|notion|document)/.test(haystack)) {
    return {
      monetizationPath: 'knowledge and internal ops systems',
      whyItCouldMakeMoney: 'Useful for internal search, document workflows, SOP generation, and company knowledge assistants.',
      firstIdea: 'Turn it into a team knowledge setup offer that helps staff find answers and draft docs faster.',
    }
  }
  if (/(calendar|meeting|schedule|assistant)/.test(haystack)) {
    return {
      monetizationPath: 'founder assistant and planning systems',
      whyItCouldMakeMoney: 'Useful for meeting prep, weekly planning, and executive assistant style services.',
      firstIdea: 'Use it in a founder ops package that creates briefings, agendas, and follow-up actions.',
    }
  }
  if (/(github|filesystem|code|vercel|cloudflare|deploy|dev|developer)/.test(haystack)) {
    return {
      monetizationPath: 'dev workflow and shipping infrastructure',
      whyItCouldMakeMoney: 'Useful for developer teams, technical founders, and productised build or maintenance offers.',
      firstIdea: 'Position it as part of a build-and-maintain AI dev workflow for small product teams.',
    }
  }
  if (/(canva|design|image|creative|presentation|ppt|social)/.test(haystack)) {
    return {
      monetizationPath: 'content and creative production',
      whyItCouldMakeMoney: 'Useful for agencies, creators, and brands producing visual assets at speed.',
      firstIdea: 'Offer a branded content system that combines prompts, assets, and first-draft generation.',
    }
  }
  if (/(browser|playwright|scrape|automation|form)/.test(haystack)) {
    return {
      monetizationPath: 'browser automation services',
      whyItCouldMakeMoney: 'Useful for repetitive website tasks, lead capture, research, and operations automation.',
      firstIdea: 'Use it to automate one painful browser-based workflow and sell that as a pilot service.',
    }
  }

  return {
    monetizationPath: 'workflow automation experiments',
    whyItCouldMakeMoney: 'Potentially useful as part of a niche workflow once matched to a real business problem.',
    firstIdea: 'Test it on one narrow internal workflow and see whether it saves time or improves consistency.',
  }
}

async function searchGitHub(query: string) {
  const params = new URLSearchParams({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: '8',
  })

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'skills-tracker-mcp-radar',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(`https://api.github.com/search/repositories?${params.toString()}`, {
    headers,
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`GitHub search failed with ${response.status}`)
  }

  return response.json() as Promise<GitHubSearchResponse>
}

export async function GET() {
  try {
    const results = await Promise.all(SEARCH_QUERIES.map((query) => searchGitHub(query)))
    const deduped = new Map<number, GitHubRepo>()

    for (const result of results) {
      for (const repo of result.items) {
        if (!deduped.has(repo.id)) {
          deduped.set(repo.id, repo)
        }
      }
    }

    const items: RadarItem[] = Array.from(deduped.values())
      .filter((repo) => isRelevantRepo(repo))
      .sort((left, right) => new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime())
      .slice(0, 12)
      .map((repo) => {
        const classification = classifyRepo(repo)
        return {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          description: repo.description ?? 'No description provided.',
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          freshness: freshnessLabel(repo.updated_at),
          monetizationPath: classification.monetizationPath,
          whyItCouldMakeMoney: classification.whyItCouldMakeMoney,
          firstIdea: classification.firstIdea,
        }
      })

    return NextResponse.json({ items, fetchedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Unable to load MCP radar right now.', details: message },
      { status: 500 }
    )
  }
}