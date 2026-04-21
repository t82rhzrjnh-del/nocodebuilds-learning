'use client'

import { useEffect, useRef, useState } from 'react'

type Theme = 'dark' | 'light'
type Section = 'daily' | 'skills' | 'mcps' | 'radar' | 'apis' | 'tools' | 'roadmap' | 'ideas'

type DailyPlanTask = {
  label: string
  section: Exclude<Section, 'daily'>
  sectionLabel: string
  whereToGetIt: string
  firstAction: string
}

type DailyPlanDay = {
  day: string
  title: string
  focus: string
  tasks: DailyPlanTask[]
}

type DailyBlocker = {
  issue: string
  fix: string
}

type DailyGuide = {
  exactSteps: string[]
  blockers: DailyBlocker[]
}

type RoadmapWeek = {
  span: string
  title: string
  goal: string
  checkpoints: string[]
  outcome: string
}

type AgencyOffer = {
  icon: string
  title: string
  who: string
  deliverables: string[]
  outcome: string
}

type AgencyPathStep = {
  step: string
  title: string
  focus: string
  actions: string[]
}

type NicheWorkflow = {
  niche: string
  icon: string
  problem: string
  stack: string[]
  offerIdea: string
}

type NicheTrack = {
  name: string
  icon: string
  summary: string
  days: Array<{
    day: string
    focus: string
  }>
}

type MCPEntry = {
  icon: string
  label: string
  title: string
  category: string
  desc: string
  howToAdd: string
  useCases: string[]
  status: string
  url: string
  whereToUse: string
  firstPrompt: string
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

type RadarResponse = {
  items: RadarItem[]
  fetchedAt?: string
  error?: string
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )

    const seen = new WeakSet<Element>()
    const observeAll = () => {
      document.querySelectorAll('.sr').forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el)
          observer.observe(el)
        }
      })
    }

    observeAll()

    const mutationObserver = new MutationObserver(() => {
      observeAll()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [])
}

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMouse)
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const spacing = 52
    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.008
      const cols = Math.ceil(canvas.width / spacing) + 1
      const rows = Math.ceil(canvas.height / spacing) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing, y = r * spacing
          const dx = x - mx, dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const inf = Math.max(0, 1 - dist / 260)
          const wave = Math.sin(t + (c + r) * 0.22) * 0.5 + 0.5
          const alpha = 0.08 + wave * 0.07 + inf * 0.4
          const radius = 1.2 + inf * 2.5
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,102,255,${alpha})`
          ctx.fill()
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('mousemove', onMouse); ro.disconnect() }
  }, [])
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.9 }} />
}

// ─── DATA ──────────────────────────────────────────────────────────────────────

const SKILLS = [
  {
    icon: '◈', label: 'SKILL_FILE', title: 'What is a Skill?', category: 'core',
    desc: 'A skill is just a markdown (.md) file Claude reads before doing a task. It sets the rules — tone, format, output structure. Think of it as a cheat sheet that makes Claude behave consistently every time.',
    howTo: 'Create a .md file → paste it as your system prompt → Claude follows it',
    where: 'You write them yourself, or get from GitHub / Anthropic docs',
    example: '`You are a content creator for @nocodebuilds. Output JSON only.`',
    difficulty: 'beginner',
  },
  {
    icon: '⟲', label: 'FRONTEND', title: 'Frontend Design Skill', category: 'design',
    desc: 'Tells Claude to build production-grade UIs with real aesthetic direction — not generic AI slop. It defines fonts, colors, layout rules, and animation constraints.',
    howTo: 'Read /mnt/skills/public/frontend-design/SKILL.md → Claude builds better UIs automatically',
    where: 'Built into Claude.ai Projects — pre-loaded by Anthropic',
    example: 'Ask Claude to build a landing page — it reads this skill first and builds something distinctive',
    difficulty: 'beginner',
  },
  {
    icon: '◎', label: 'DOCX', title: 'Word Document Skill', category: 'documents',
    desc: 'Creates proper .docx files with headings, tables of contents, page numbers, and letterheads. Without this skill Claude creates generic text. With it — professional Word documents.',
    howTo: 'Trigger: any request for a Word doc, report, memo, or .docx file',
    where: '/mnt/skills/public/docx/SKILL.md — built into Claude.ai',
    example: '`Write me a client proposal as a Word document`',
    difficulty: 'beginner',
  },
  {
    icon: '▣', label: 'PDF', title: 'PDF Skill', category: 'documents',
    desc: 'Read, extract, merge, split, watermark, or create PDFs. Also handles OCR on scanned documents. One skill covers the full PDF workflow.',
    howTo: 'Trigger: any .pdf file mentioned or PDF output requested',
    where: '/mnt/skills/public/pdf/SKILL.md — built into Claude.ai',
    example: '`Merge these 3 PDFs into one and add page numbers`',
    difficulty: 'beginner',
  },
  {
    icon: '⬡', label: 'PPTX', title: 'PowerPoint Skill', category: 'documents',
    desc: 'Builds full .pptx slide decks — layouts, speaker notes, branded templates. Also reads and extracts content from existing presentations.',
    howTo: 'Trigger: any mention of slides, deck, presentation, or .pptx file',
    where: '/mnt/skills/public/pptx/SKILL.md — built into Claude.ai',
    example: '`Build me a 10-slide pitch deck for my nocodebuilds brand`',
    difficulty: 'intermediate',
  },
  {
    icon: '▦', label: 'XLSX', title: 'Spreadsheet Skill', category: 'documents',
    desc: 'Open, read, edit, create, or fix Excel and CSV files. Handles formulas, charts, data cleaning, and messy tabular data.',
    howTo: 'Trigger: any .xlsx, .csv, or spreadsheet task',
    where: '/mnt/skills/public/xlsx/SKILL.md — built into Claude.ai',
    example: '`Clean this CSV and add a revenue column`',
    difficulty: 'beginner',
  },
  {
    icon: '◑', label: 'FILE_READ', title: 'File Reading Skill', category: 'core',
    desc: 'A router skill — tells Claude which tool to use for each file type. Without it Claude might try to cat a binary file. This is the skill that makes uploads work properly.',
    howTo: 'Triggers automatically when you upload a file Claude hasn\'t read yet',
    where: '/mnt/skills/public/file-reading/SKILL.md — built into Claude.ai',
    example: 'Upload any file → this skill routes Claude to the right reader',
    difficulty: 'beginner',
  },
  {
    icon: '◉', label: 'CUSTOM', title: 'Write Your Own Skill', category: 'advanced',
    desc: 'The real power — write a .md file with your own rules. Brand voice, output format, platform constraints. This is what you package and sell to clients.',
    howTo: '1. Create a .md file  2. Write your rules in plain English  3. Add to Claude Project as system prompt',
    where: 'You create it — store in your GitHub repo',
    example: '`# nocodebuilds-content.skill.md\\nYou create short-form content ideas...`',
    difficulty: 'intermediate',
  },
]

const DAILY_TASKS: DailyPlanDay[] = [
  {
    day: 'Day 1',
    title: 'Skills Foundations',
    focus: 'Understand what a skill is and test your first one.',
    tasks: [
      { label: 'Read 2 example SKILL.md files and note the structure.', section: 'skills', sectionLabel: 'Skills', whereToGetIt: 'Start in the Skills section, then search GitHub for repos containing SKILL.md files. Look for role, instructions, constraints, and output format.', firstAction: 'Open the Skills section and compare the examples there before copying one simple public skill into your notes.' },
      { label: 'Write your own mini skill with role, format, and constraints.', section: 'skills', sectionLabel: 'Skills', whereToGetIt: 'Use the structure you just observed: who Claude is, what it should do, and how output should look.', firstAction: 'Write a 5-10 line skill for one tiny job like “turn notes into a LinkedIn post” or “summarise a meeting into bullets”.' },
      { label: 'Run 3 prompts with and without the skill and compare output quality.', section: 'skills', sectionLabel: 'Skills', whereToGetIt: 'You can test this directly in Claude chat or inside a Claude Project using the same prompt twice.', firstAction: 'Use one identical prompt, paste it once with no skill and once with your skill, then note what changed.' },
    ],
  },
  {
    day: 'Day 2',
    title: 'Projects + System Prompts',
    focus: 'Set a reusable instruction layer in Claude Projects.',
    tasks: [
      { label: 'Create a Claude Project focused on one workflow (content, coding, or docs).', section: 'tools', sectionLabel: 'Tools', whereToGetIt: 'Claude Projects live inside claude.ai. Use one project per repeatable workflow so context stays clean.', firstAction: 'Choose one job you repeat often and make a Project just for that job.' },
      { label: 'Add project instructions and one reference file.', section: 'tools', sectionLabel: 'Tools', whereToGetIt: 'Inside the Project, add your skill/system instructions and upload one useful example like a brand guide, code sample, or SOP.', firstAction: 'Use the simplest helpful file you already have instead of trying to build a perfect knowledge base on day one.' },
      { label: 'Refine the instruction file after testing 5 prompts.', section: 'skills', sectionLabel: 'Skills', whereToGetIt: 'Watch for repeated mistakes in Claude’s output. Those mistakes tell you what the instruction file is missing.', firstAction: 'After each test prompt, add one missing rule to your instructions instead of rewriting everything.' },
    ],
  },
  {
    day: 'Day 3',
    title: 'MCP Basics',
    focus: 'Connect one MCP and use it in a real task.',
    tasks: [
      { label: 'Connect one official MCP (Drive, Gmail, Calendar, or Vercel).', section: 'mcps', sectionLabel: 'MCPs', whereToGetIt: 'Use the official integrations shown in the MCP section first. They are the easiest starting point because they do not need custom local server setup.', firstAction: 'Pick the tool you already use most often, connect only that one, and ignore the rest for now.' },
      { label: 'Complete one practical task end-to-end through Claude.', section: 'mcps', sectionLabel: 'MCPs', whereToGetIt: 'Choose a tiny real task: find a file in Drive, draft an email in Gmail, or create one calendar event.', firstAction: 'Say exactly what you want Claude to do in one sentence and keep the task narrow enough that success is obvious.' },
      { label: 'Record one limitation and one workaround you discovered.', section: 'mcps', sectionLabel: 'MCPs', whereToGetIt: 'Every MCP has boundaries. You learn faster by writing down what failed and how you got around it.', firstAction: 'Keep one note with two lines: “didn’t work because…” and “worked better when I…”' },
    ],
  },
  {
    day: 'Day 4',
    title: 'API Core Call',
    focus: 'Make your first reliable Anthropic API request.',
    tasks: [
      { label: 'Create an API key and store it safely in .env.local.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'Go to console.anthropic.com, create a key, then place it in .env.local so it stays server-side.', firstAction: 'Do not overbuild. Just create the key and confirm your app can read it from the environment.' },
      { label: 'Send one working messages API request from server-side code.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'Use the API section example and run it from a route or server action, not directly from the browser.', firstAction: 'Get one hard-coded prompt working before trying to make it dynamic.' },
      { label: 'Save the request template for reuse in your own snippets.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'Once it works once, that request shape becomes your base template for almost everything else.', firstAction: 'Copy the working request into your own snippet file with placeholders for model, system, and user content.' },
    ],
  },
  {
    day: 'Day 5',
    title: 'Structured Output',
    focus: 'Get parseable JSON output you can use in apps.',
    tasks: [
      { label: 'Update your system prompt to enforce strict JSON output.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'The API section already shows the system prompt pattern. The goal is to force output that your app can parse reliably.', firstAction: 'Tell Claude to return JSON only and specify the exact keys you expect.' },
      { label: 'Parse the model response and handle malformed JSON safely.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'Sometimes the model wraps JSON in markdown or adds commentary. You need to strip wrappers and guard against parse failures.', firstAction: 'Build one try/catch around JSON.parse and print the raw output when parsing fails.' },
      { label: 'Generate and render one data-driven UI block in your app.', section: 'apis', sectionLabel: 'API', whereToGetIt: 'Once JSON parsing works, use that data to fill a simple card list, table, or content block in your UI.', firstAction: 'Start with one small component instead of trying to generate a whole product screen.' },
    ],
  },
  {
    day: 'Day 6',
    title: 'Build in Public',
    focus: 'Turn your progress into documented proof.',
    tasks: [
      { label: 'Post one clip or thread explaining what you built this week.', section: 'roadmap', sectionLabel: 'Beginner to Agency', whereToGetIt: 'Use your tracker notes. You do not need polished thought leadership; you need proof that you are learning in public.', firstAction: 'Share one concrete build, one screen, and one sentence about what you learned.' },
      { label: 'Share one prompt + result + lesson learned.', section: 'ideas', sectionLabel: 'Ideas', whereToGetIt: 'Look in the Ideas section for content angles that turn experiments into useful posts.', firstAction: 'Pick the most surprising result from the week and post the before/after, not just the prompt.' },
      { label: 'Write a short case-study style summary of your workflow.', section: 'roadmap', sectionLabel: 'Beginner to Agency', whereToGetIt: 'A case study can be very small: problem, setup, what changed, what still failed.', firstAction: 'Write 4 bullets only: task, tools used, result, next improvement.' },
    ],
  },
  {
    day: 'Day 7',
    title: 'Productise It',
    focus: 'Package your learning into a repeatable offer.',
    tasks: [
      { label: 'Create one reusable skill/template bundle from what worked best.', section: 'skills', sectionLabel: 'Skills', whereToGetIt: 'Look back at the prompts and rules that consistently improved outputs. Those are the seeds of a reusable asset.', firstAction: 'Bundle one skill, one example input, and one example output into a simple starter pack.' },
      { label: 'Define one simple offer (setup, content pack, or custom skill).', section: 'roadmap', sectionLabel: 'Beginner to Agency', whereToGetIt: 'Use the roadmap and offers sections to pick one business problem you can help with using what you already tested.', firstAction: 'Describe the offer in one sentence: who it is for, what problem it fixes, and what you deliver.' },
      { label: 'List next week\'s 3 priorities based on what gave best results.', section: 'roadmap', sectionLabel: 'Beginner to Agency', whereToGetIt: 'Your next priorities should come from real traction: what you understood fastest, what got the best outputs, and what seems useful to others.', firstAction: 'Choose one learning priority, one proof priority, and one offer priority.' },
    ],
  },
]

const DAILY_GUIDES: Record<string, DailyGuide> = {
  'Day 1': {
    exactSteps: [
      'Open the Skills section and read the simple explanation of what a skill does.',
      'Search GitHub for `SKILL.md claude` and open two examples with different purposes.',
      'Highlight the same four parts in both: role, task, constraints, and output format.',
      'Write your own tiny skill in plain English and test it against the same prompt three times.',
    ],
    blockers: [
      { issue: 'You cannot find good examples.', fix: 'Use the built-in Skills section first, then search GitHub for `SKILL.md` rather than searching for “prompts” broadly.' },
      { issue: 'Your skill feels too vague.', fix: 'Add an output rule like “reply in 5 bullets” or “respond in JSON only” so Claude has something concrete to follow.' },
    ],
  },
  'Day 2': {
    exactSteps: [
      'Create one Claude Project for a single workflow only, such as content, coding, or research.',
      'Paste your basic instruction block into Project instructions.',
      'Upload one useful supporting file like a brand guide, SOP, or sample output.',
      'Run five prompts and add one missing instruction each time Claude makes the same mistake.',
    ],
    blockers: [
      { issue: 'You do not know what file to upload.', fix: 'Use any real file you already trust: notes, a past deliverable, a Loom transcript, or a brand one-pager.' },
      { issue: 'The Project still gives inconsistent results.', fix: 'Tighten the instructions one rule at a time instead of rewriting everything after each test.' },
    ],
  },
  'Day 3': {
    exactSteps: [
      'Open the MCP section and choose one official integration you already use regularly.',
      'Connect that tool inside Claude settings.',
      'Give Claude one narrow real task such as finding a file, drafting an email, or creating an event.',
      'Write down what it could do, what it could not do, and what wording worked best.',
    ],
    blockers: [
      { issue: 'You are unsure which MCP to start with.', fix: 'Choose the tool that already contains your daily work, usually Drive, Gmail, or Calendar.' },
      { issue: 'Claude misunderstands the task.', fix: 'Make the request smaller and more literal, for example “find the file named X” instead of “organise my docs”.' },
    ],
  },
  'Day 4': {
    exactSteps: [
      'Create an Anthropic API key in console.anthropic.com.',
      'Add it to `.env.local` under `ANTHROPIC_API_KEY`.',
      'Use the API example in the page and copy it into a server-side route.',
      'Test with one hard-coded prompt until you get a clean response.',
    ],
    blockers: [
      { issue: 'You are not sure where the code should run.', fix: 'Keep it server-side only. Use a Next.js route or server action, not client browser code.' },
      { issue: 'The request fails immediately.', fix: 'Check the API key name, header spelling, model name, and that `.env.local` is being read by the app.' },
    ],
  },
  'Day 5': {
    exactSteps: [
      'Update the system prompt so it specifies exact JSON keys and says “JSON only”.',
      'Log the raw model output and strip markdown wrappers if needed.',
      'Parse the response with `JSON.parse` inside a `try/catch`.',
      'Render the parsed data inside one small UI component like a card list or checklist.',
    ],
    blockers: [
      { issue: 'The model keeps returning markdown or extra text.', fix: 'Be stricter in the system prompt and show Claude the exact JSON shape you want returned.' },
      { issue: 'Parsing still breaks.', fix: 'Print the raw output first and fix one formatting problem at a time instead of guessing.' },
    ],
  },
  'Day 6': {
    exactSteps: [
      'Open your notes from the previous days and pick one build that actually worked.',
      'Capture a screenshot, short video, or before/after output.',
      'Write a tiny post using four parts: problem, setup, result, lesson.',
      'Share one honest limitation as part of the post so it reads like learning, not hype.',
    ],
    blockers: [
      { issue: 'You feel like you have nothing worth sharing yet.', fix: 'Share the smallest real thing that worked. A tiny workflow with one lesson is enough.' },
      { issue: 'You do not know what format to post in.', fix: 'Use the simplest format you already make: a thread, a LinkedIn post, or a 30-second clip.' },
    ],
  },
  'Day 7': {
    exactSteps: [
      'Look back at which skills, prompts, or workflows gave the best results this week.',
      'Bundle the best one into a starter asset with example input and output.',
      'Describe one beginner-friendly offer in one sentence.',
      'Choose next week\'s priorities across learning, proof, and offer development.',
    ],
    blockers: [
      { issue: 'You are unsure what could become an offer.', fix: 'Pick the workflow that feels most useful and repeatable, not the most advanced technically.' },
      { issue: 'Everything still feels too broad.', fix: 'Narrow the offer to one user, one problem, and one deliverable.' },
    ],
  },
}

const NICHE_TRACKS: NicheTrack[] = [
  {
    name: 'Coach',
    icon: '⟲',
    summary: 'Learn Claude through session prep, follow-ups, client notes, and content repurposing.',
    days: [
      { day: 'Step 1', focus: 'Write a coaching recap skill for turning messy notes into action plans.' },
      { day: 'Step 2', focus: 'Create a Project for client session support with one example session note.' },
      { day: 'Step 3', focus: 'Use Calendar or Drive MCP to pull session context and supporting files.' },
      { day: 'Step 4', focus: 'Build an API route that turns session notes into recap drafts.' },
      { day: 'Step 5', focus: 'Return structured JSON for recap sections, homework, and next steps.' },
      { day: 'Step 6', focus: 'Share a case study on turning one coaching session into recap + content.' },
      { day: 'Step 7', focus: 'Package it as a coach operating system starter offer.' },
    ],
  },
  {
    name: 'Agency',
    icon: '◎',
    summary: 'Learn through client delivery: brand systems, repeatable prompts, and team consistency.',
    days: [
      { day: 'Step 1', focus: 'Create a simple “brand voice instruction” for one output (for example: one LinkedIn post style or one email style).' },
      { day: 'Step 2', focus: 'Set up a Project for one client workflow with a reference brief.' },
      { day: 'Step 3', focus: 'Use Drive or Filesystem MCP to pull assets and examples into the workflow.' },
      { day: 'Step 4', focus: 'Create an API route for generating first-draft deliverables.' },
      { day: 'Step 5', focus: 'Use JSON output for structured copy blocks, angles, or deliverable sections.' },
      { day: 'Step 6', focus: 'Publish a mini breakdown of how AI improved delivery consistency.' },
      { day: 'Step 7', focus: 'Turn it into a client-specific AI delivery system offer.' },
    ],
  },
  {
    name: 'Ecommerce',
    icon: '▣',
    summary: 'Learn through product copy, campaigns, support macros, and launch planning.',
    days: [
      { day: 'Step 1', focus: 'Write a product copy or support-response skill for one brand.' },
      { day: 'Step 2', focus: 'Create a Project with product notes, brand voice, and previous campaigns.' },
      { day: 'Step 3', focus: 'Connect Drive or Canva MCP to access assets and product materials.' },
      { day: 'Step 4', focus: 'Build one API route for campaign or product content generation.' },
      { day: 'Step 5', focus: 'Return structured JSON for product bullets, FAQs, or campaign angles.' },
      { day: 'Step 6', focus: 'Show how one product launch workflow became faster and more consistent.' },
      { day: 'Step 7', focus: 'Package it as a small ecommerce content + support system.' },
    ],
  },
  {
    name: 'Recruiter',
    icon: '◈',
    summary: 'Learn through candidate research, follow-ups, and role-brief workflows.',
    days: [
      { day: 'Step 1', focus: 'Write a candidate-summary skill using clear criteria and output format.' },
      { day: 'Step 2', focus: 'Create a recruiting Project with one role brief and one sample CV.' },
      { day: 'Step 3', focus: 'Use Gmail or Drive MCP to work with briefs, CVs, and follow-up drafts.' },
      { day: 'Step 4', focus: 'Build an API route that converts raw candidate notes into summaries.' },
      { day: 'Step 5', focus: 'Return structured JSON for candidate fit, concerns, and next steps.' },
      { day: 'Step 6', focus: 'Share a short breakdown of time saved on candidate prep.' },
      { day: 'Step 7', focus: 'Turn it into a recruiting workflow setup offer.' },
    ],
  },
]

const THIRTY_DAY_PLAN: RoadmapWeek[] = [
  {
    span: 'Days 1-7',
    title: 'Learn The Core Tools',
    goal: 'Get comfortable with skills, Projects, MCP basics, and one API flow.',
    checkpoints: [
      'Test 2-3 public skill examples and write one of your own.',
      'Connect one MCP and complete a real task with it.',
      'Make one server-side API call and save a working template.',
      'Document every win, failure, and useful prompt in your tracker.',
    ],
    outcome: 'By the end of week 1, you should understand the moving parts well enough to explain them simply to someone else.',
  },
  {
    span: 'Days 8-14',
    title: 'Build Proof Assets',
    goal: 'Turn raw learning into examples that prove you can set up useful systems.',
    checkpoints: [
      'Create one demo workflow for a fake or real business use case.',
      'Write one mini case study: problem, setup, result, limitation.',
      'Record one Loom showing the workflow in under 5 minutes.',
      'Organise your best prompts, skill files, and MCP examples into a simple portfolio folder.',
    ],
    outcome: 'By the end of week 2, you should have proof that you can build and explain a workflow, not just talk about AI generally.',
  },
  {
    span: 'Days 15-21',
    title: 'Choose A Niche And Shape Offers',
    goal: 'Pick the business problems you want to be known for and frame them as simple services.',
    checkpoints: [
      'Choose one lane first: marketing, sales, support, ops, or founder workflows.',
      'Define 3 beginner-friendly offers for that lane.',
      'Write who each offer is for, what it fixes, and what deliverables are included.',
      'Map which skills and MCPs support each offer so the service feels concrete.',
    ],
    outcome: 'By the end of week 3, you should know what you are helping companies do and how your toolkit supports that outcome.',
  },
  {
    span: 'Days 22-30',
    title: 'Package It As Infrastructure',
    goal: 'Move from small tasks to a repeatable company-facing AI infrastructure offer.',
    checkpoints: [
      'Package one offer as a pilot with a clear start, end, and handover.',
      'Create a simple delivery flow: audit, setup, testing, training, handoff.',
      'Write one “AI infrastructure” explainer showing how skills, prompts, docs, approvals, and MCPs fit together.',
      'Publish 3 pieces of content that teach the problem and show your workflow in action.',
    ],
    outcome: 'By day 30, you should have a simple business direction, a learning archive, and a pilot-ready offer that can grow into agency work.',
  },
]

const AGENCY_OFFERS: AgencyOffer[] = [
  {
    icon: '◈',
    title: 'Marketing AI System',
    who: 'For small teams that need faster content, research, and brand consistency.',
    deliverables: [
      'Brand voice skill files and approved prompt library.',
      'Research workflow using Drive, web search, or docs MCPs.',
      'Content drafting and review flow with human approval checkpoints.',
    ],
    outcome: 'This teaches people how to sell repeatable output quality, not just one-off prompts.',
  },
  {
    icon: '⟲',
    title: 'Sales Enablement System',
    who: 'For founders or sales teams that need better prep, follow-up, and outbound support.',
    deliverables: [
      'Prospect research workflow using search and internal docs.',
      'Email and follow-up skills aligned to offer positioning.',
      'Meeting prep, proposal drafting, and post-call summary templates.',
    ],
    outcome: 'This is a strong first agency offer because the business value is easy to understand.',
  },
  {
    icon: '◎',
    title: 'Support Knowledge System',
    who: 'For teams drowning in repeated questions, inconsistent responses, or weak documentation.',
    deliverables: [
      'Support response skills with tone, escalation, and QA rules.',
      'Knowledge-base drafting workflow from tickets and internal docs.',
      'Process for turning repeated support issues into reusable documentation.',
    ],
    outcome: 'This helps learners see how skills plus knowledge access become operational infrastructure.',
  },
  {
    icon: '▣',
    title: 'Founder Ops Assistant',
    who: 'For operators or founders who need a lightweight AI operating system across inbox, calendar, and notes.',
    deliverables: [
      'Weekly planning and meeting-prep prompts tied to calendar context.',
      'Inbox triage and response draft workflow with approval steps.',
      'Decision-support templates for summarising documents, options, and next actions.',
    ],
    outcome: 'This is a practical bridge from solo workflows into broader company infrastructure services.',
  },
]

const BEGINNER_TO_AGENCY: AgencyPathStep[] = [
  {
    step: '01',
    title: 'Learn By Building Tiny Systems',
    focus: 'Do not start by trying to sell “AI transformation”. Start by building one small useful workflow from start to finish.',
    actions: [
      'Pick one narrow use case like email drafting, content research, or support summaries.',
      'Use one skill, one MCP, or one API route at a time so you understand what each layer does.',
      'Save every working example because those become future proof assets and client demos.',
    ],
  },
  {
    step: '02',
    title: 'Turn Experiments Into Proof',
    focus: 'People do not buy your excitement. They buy clear evidence that a workflow saves time or improves consistency.',
    actions: [
      'Write mini case studies from your own tests.',
      'Capture before/after examples, not just explanations.',
      'Record quick demos that show the workflow in action end-to-end.',
    ],
  },
  {
    step: '03',
    title: 'Package One Problem Clearly',
    focus: 'Choose a business problem and describe the deliverable in plain English instead of AI jargon.',
    actions: [
      'Say what changes after your setup: faster responses, better outreach, cleaner docs, etc.',
      'List the concrete assets included: skill files, templates, instructions, handover docs.',
      'Keep the first offer small enough that a company could say yes without major risk.',
    ],
  },
  {
    step: '04',
    title: 'Sell Workflows, Then Infrastructure',
    focus: 'Once one workflow works, zoom out and show how several workflows connect into an operating system for the team.',
    actions: [
      'Link prompts, skills, docs, approvals, and MCP actions into one repeatable process.',
      'Frame your value as system design, not just prompt writing.',
      'Use pilots to prove one department before expanding into broader infrastructure.',
    ],
  },
  {
    step: '05',
    title: 'Grow Into Agency-Style Delivery',
    focus: 'Agency work starts when you can repeatedly audit, implement, train, and improve these systems for different clients.',
    actions: [
      'Standardise your audit questions and implementation flow.',
      'Build repeatable templates for onboarding, testing, and handover.',
      'Keep learning by documenting what changes across niches and what stays reusable.',
    ],
  },
]

const NICHE_WORKFLOWS: NicheWorkflow[] = [
  {
    niche: 'Recruiters',
    icon: '◈',
    problem: 'Too much manual candidate research, note cleanup, and repetitive outreach.',
    stack: ['Gmail MCP for follow-ups', 'Drive MCP for CVs and briefs', 'Skill for candidate summaries and outreach tone'],
    offerIdea: 'Build a recruiting assistant workflow that turns role briefs and candidate info into cleaner summaries, interview prep, and outreach drafts.',
  },
  {
    niche: 'Coaches',
    icon: '⟲',
    problem: 'Session notes, follow-ups, content creation, and client resource prep take too much time.',
    stack: ['Calendar MCP for session context', 'Drive MCP for client notes', 'Skill for recap emails, action plans, and content repurposing'],
    offerIdea: 'Create a coach operating system that turns session data into recaps, action plans, and social content drafts.',
  },
  {
    niche: 'Agencies',
    icon: '◎',
    problem: 'Teams need consistent output across multiple client accounts, but every person writes differently.',
    stack: ['Drive or Filesystem MCP for client assets', 'Canva MCP for first-draft creative', 'Skill packs per client voice and deliverable type'],
    offerIdea: 'Package client-specific brand systems so the agency can produce more consistent deliverables with less rewrite time.',
  },
  {
    niche: 'Ecommerce Brands',
    icon: '▣',
    problem: 'Product descriptions, campaign ideas, support responses, and launch planning all compete for attention.',
    stack: ['Drive MCP for product docs', 'Canva MCP for campaign asset drafts', 'Skills for product copy, campaign planning, and support macros'],
    offerIdea: 'Build a content + support system that helps a small ecommerce team move faster without losing brand consistency.',
  },
]

const MCPS: MCPEntry[] = [
  {
    icon: '◈', label: 'BROWSER', title: 'Claude in Chrome', category: 'browser',
    desc: 'Gives Claude full browser control — it can click, type, scroll, fill forms, and navigate any website. This is how you automate Kling, Higgsfield, or any tool without an API.',
    howToAdd: 'Chrome Web Store → search "Claude for Chrome" by Anthropic → Add to Chrome → pin it → claude.ai Settings → Extensions',
    useCases: ['Automate Kling prompts', 'Fill forms automatically', 'Scrape content', 'Control any web tool'],
    status: 'official',
    url: 'chrome.google.com/webstore',
    whereToUse: 'Use this when the work lives inside a website with buttons, forms, uploads, or dashboards that Claude needs to click through for you.',
    firstPrompt: 'Open the site, go to the login page, and show me the first step I need to take before you continue.',
  },
  {
    icon: '⟲', label: 'GOOGLE_DRIVE', title: 'Google Drive MCP', category: 'productivity',
    desc: 'Claude can search, read, create, and organise your Google Drive files. Ask Claude to find your Q3 report — it searches Drive directly.',
    howToAdd: 'claude.ai → Settings → Integrations → Google Drive → Connect',
    useCases: ['Find documents by content', 'Create files in Drive', 'Organise folders', 'Read spreadsheets'],
    status: 'connected',
    url: 'drivemcp.googleapis.com/mcp/v1',
    whereToUse: 'Use this when your useful information is spread across docs, folders, spreadsheets, or meeting notes stored in Drive.',
    firstPrompt: 'Find the most relevant document in my Drive about [topic] and summarise the key points in 5 bullets.',
  },
  {
    icon: '◎', label: 'GMAIL', title: 'Gmail MCP', category: 'productivity',
    desc: 'Claude reads, drafts, and (with your approval) sends emails. Automate email responses, summarise threads, or draft outreach sequences.',
    howToAdd: 'claude.ai → Settings → Integrations → Gmail → Connect',
    useCases: ['Summarise email threads', 'Draft replies', 'Search emails', 'Automate outreach'],
    status: 'connected',
    url: 'gmailmcp.googleapis.com/mcp/v1',
    whereToUse: 'Use this when the job involves inbox triage, replying faster, searching old threads, or turning email chaos into next actions.',
    firstPrompt: 'Find my latest thread about [topic], summarise what matters, and draft a clear reply I can approve.',
  },
  {
    icon: '▣', label: 'GCAL', title: 'Google Calendar MCP', category: 'productivity',
    desc: 'Claude can read and create calendar events. "Schedule a call next Tuesday at 2pm" — Claude does it directly.',
    howToAdd: 'claude.ai → Settings → Integrations → Google Calendar → Connect',
    useCases: ['Create events', 'Check availability', 'Schedule tasks', 'Summarise week ahead'],
    status: 'connected',
    url: 'calendarmcp.googleapis.com/mcp/v1',
    whereToUse: 'Use this when you want Claude to help plan your week, prep meetings, find free slots, or create events from plain English.',
    firstPrompt: 'Look at my calendar for this week and give me a short briefing on my busiest days and what needs prep.',
  },
  {
    icon: '⬡', label: 'VERCEL', title: 'Vercel MCP', category: 'development',
    desc: 'Claude can deploy projects, check deployment status, read logs, and manage your Vercel projects — without you opening the Vercel dashboard.',
    howToAdd: 'claude.ai → Settings → Integrations → Vercel → Connect',
    useCases: ['Deploy projects', 'Check build logs', 'List deployments', 'Manage domains'],
    status: 'connected',
    url: 'mcp.vercel.com',
    whereToUse: 'Use this while shipping web projects, especially when you need fast answers about deploy status, logs, or what just failed in production.',
    firstPrompt: 'Check the latest deployment for this project and tell me whether it passed, failed, or needs attention.',
  },
  {
    icon: '▦', label: 'CANVA', title: 'Canva MCP', category: 'design',
    desc: 'Claude generates designs, presentations, and brand materials directly in Canva. Ask for a social post — Claude creates it.',
    howToAdd: 'claude.ai → Settings → Integrations → Canva → Connect',
    useCases: ['Generate social posts', 'Build presentations', 'Create brand assets', 'Export designs'],
    status: 'connected',
    url: 'mcp.canva.com/mcp',
    whereToUse: 'Use this when you want Claude to move beyond text and help create first-draft visual assets, slides, or branded social content.',
    firstPrompt: 'Create a first-draft Canva post for [topic] using a clean layout and give me 3 headline options.',
  },
  {
    icon: '◑', label: 'CLOUDFLARE', title: 'Cloudflare MCP', category: 'development',
    desc: 'Claude manages your Cloudflare Workers, KV stores, R2 buckets, and D1 databases. Deploy serverless functions by just describing what you want.',
    howToAdd: 'claude.ai → Settings → Integrations → Cloudflare → Connect',
    useCases: ['Deploy Workers', 'Manage KV storage', 'Query D1 databases', 'Configure domains'],
    status: 'connected',
    url: 'bindings.mcp.cloudflare.com/mcp',
    whereToUse: 'Use this when your project depends on Cloudflare infrastructure and you need help with Worker deploys, storage, or simple operational checks.',
    firstPrompt: 'Show me the current state of my Cloudflare project and point out the safest next action to take.',
  },
  {
    icon: '◉', label: 'FILESYSTEM', title: 'Filesystem MCP', category: 'development',
    desc: 'Claude reads and writes files on your actual computer. Perfect for VS Code workflows — Claude can edit your project files directly.',
    howToAdd: 'Install via npm: `npx @modelcontextprotocol/server-filesystem` → add to claude_desktop_config.json',
    useCases: ['Read local files', 'Write code to disk', 'Organise project structure', 'Edit configs'],
    status: 'community',
    url: 'github.com/modelcontextprotocol/servers',
    whereToUse: 'Use this when Claude needs direct access to local project files, notes, templates, or docs outside a browser or hosted tool.',
    firstPrompt: 'Open this folder, explain the important files, and tell me the safest first change to make.',
  },
  {
    icon: '◫', label: 'GITHUB', title: 'GitHub MCP', category: 'development',
    desc: 'Claude searches repos, reads code, creates issues, and opens pull requests. Tell Claude to find all open bugs in your repo — it does it.',
    howToAdd: 'Install: `npx @modelcontextprotocol/server-github` → set GITHUB_TOKEN env var → add to config',
    useCases: ['Search repos', 'Create issues', 'Read code', 'Open PRs', 'Manage projects'],
    status: 'community',
    url: 'github.com/modelcontextprotocol/servers',
    whereToUse: 'Use this when the work lives in repositories, issues, pull requests, or project boards and you need Claude to navigate that context directly.',
    firstPrompt: 'Search this repo for the parts related to [topic] and summarise the files or issues I should inspect first.',
  },
  {
    icon: '◬', label: 'BRAVE', title: 'Brave Search MCP', category: 'search',
    desc: 'Claude searches the web in real time. Use when you want Claude to find current info without relying on its training data.',
    howToAdd: 'Get Brave API key (free) → install `npx @modelcontextprotocol/server-brave-search` → add key to config',
    useCases: ['Current news', 'Competitor research', 'Price lookups', 'Real-time data'],
    status: 'community',
    url: 'brave.com/search/api',
    whereToUse: 'Use this when you need current web information like competitors, pricing, product updates, or anything too recent for model memory alone.',
    firstPrompt: 'Search the web for the latest information about [topic] and give me the 5 most relevant findings with links.',
  },
  {
    icon: '◭', label: 'MEMORY', title: 'Memory MCP', category: 'core',
    desc: 'Gives Claude persistent memory across conversations using a knowledge graph. Claude actually remembers context between sessions.',
    howToAdd: 'Install: `npx @modelcontextprotocol/server-memory` → add to claude_desktop_config.json',
    useCases: ['Remember client preferences', 'Track project context', 'Persistent brand voice', 'Long-term workflows'],
    status: 'community',
    url: 'github.com/modelcontextprotocol/servers',
    whereToUse: 'Use this when context needs to accumulate over time, like client preferences, ongoing projects, brand voice, or repeated collaboration patterns.',
    firstPrompt: 'Remember the key facts about this project and give me a short summary of what should stay consistent in future chats.',
  },
  {
    icon: '◮', label: 'PLAYWRIGHT', title: 'Playwright MCP', category: 'browser',
    desc: 'More powerful browser automation than Claude in Chrome. Runs headlessly (in the background). Better for scheduled automations that don\'t need a visible browser.',
    howToAdd: 'Install: `npx @playwright/mcp` → add to config. Requires Node.js.',
    useCases: ['Headless automation', 'Scheduled tasks', 'Screenshot capture', 'Form submission at scale'],
    status: 'community',
    url: 'github.com/microsoft/playwright-mcp',
    whereToUse: 'Use this when the job needs repeatable browser automation in the background, especially for testing, scraping, screenshots, or scheduled flows.',
    firstPrompt: 'Open the target site, take me through the flow once, and tell me whether this is safe to automate headlessly.',
  },
]

const API_STEPS = [
  {
    num: '01', title: 'Get your API key',
    desc: 'Go to console.anthropic.com → API Keys → Create Key. Copy it somewhere safe — you only see it once.',
    code: `ANTHROPIC_API_KEY=sk-ant-...`,
    note: 'Never commit this to GitHub. Add to .env.local',
  },
  {
    num: '02', title: 'The basic API call',
    desc: 'Every Claude API call has the same shape — a model, a max_tokens limit, and a messages array.',
    code: `const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Your prompt here' }],
  }),
})
const data = await response.json()
console.log(data.content[0].text)`,
    note: 'This is the entire API. That\'s it.',
  },
  {
    num: '03', title: 'Add a Skill (system prompt)',
    desc: 'Your skill file becomes the system parameter. This is what makes Claude follow your rules every time.',
    code: `body: JSON.stringify({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: 'You are a content creator for @nocodebuilds...',  // ← your skill
  messages: [{ role: 'user', content: 'Generate 3 content ideas about MCPs' }],
})`,
    note: 'The system prompt = your skill. Change it to change Claude\'s behaviour.',
  },
  {
    num: '04', title: 'Get structured output (JSON)',
    desc: 'Tell Claude to output JSON only. Parse it. Now you have data you can use in your app.',
    code: `// In your system prompt:
'Respond ONLY with a JSON array. No markdown. No explanation.'

// Then parse the response:
const raw = data.content[0].text.replace(/\`\`\`json|\`\`\`/g, '').trim()
const parsed = JSON.parse(raw)`,
    note: 'This is how the content generator we built today works.',
  },
  {
    num: '05', title: 'Use it in Next.js (API route)',
    desc: 'Never call the Anthropic API from the browser — your key gets exposed. Always use an API route.',
    code: `// app/api/generate/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { topic } = await req.json()
  
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'Your skill here...',
      messages: [{ role: 'user', content: topic }],
    }),
  })
  
  const data = await res.json()
  return NextResponse.json({ result: data.content[0].text })
}`,
    note: 'Your API key stays on the server. The browser calls /api/generate instead.',
  },
]

const TOOLS_STEPS = [
  {
    icon: '◈', label: 'GITHUB', title: 'Find skills on GitHub',
    steps: [
      'Go to github.com and search: `claude skills mcp`',
      'Look for repos with a SKILL.md file at the root',
      'Click the file → Raw → copy the contents',
      'Paste into your Claude Project as the system prompt',
      'That\'s the entire install process for a skill',
    ],
    tip: 'Search: `site:github.com SKILL.md claude` for real examples',
  },
  {
    icon: '⟲', label: 'MCP_INSTALL', title: 'Install community MCPs',
    steps: [
      'Open Terminal in VS Code (Ctrl + `)',
      'Run: `npx @modelcontextprotocol/server-NAME` to test it',
      'Open: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)',
      'Add the server config (see example below)',
      'Restart Claude desktop app',
    ],
    tip: 'Config example: `{"mcpServers": {"filesystem": {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]}}}`',
  },
  {
    icon: '◎', label: 'VSCODE', title: 'VS Code setup for AI builds',
    steps: [
      'Install extension: Claude Dev (by Anthropic) from VS Code marketplace',
      'Or: use Cursor IDE — VS Code fork with Claude built in',
      'Create a CLAUDE.md file in your project root',
      'Write your project rules in CLAUDE.md — Claude reads it automatically',
      'Claude now understands your project context without re-explaining',
    ],
    tip: 'CLAUDE.md = a skill file for your entire codebase',
  },
  {
    icon: '▣', label: 'PROJECTS', title: 'Claude Projects for persistent skills',
    steps: [
      'claude.ai → Projects → New Project',
      'Click "Project instructions" — this is your system prompt / skill',
      'Add any files you want Claude to reference (brand guide, code examples)',
      'Every conversation in this project uses your skill automatically',
      'Share the project URL with clients or collaborators',
    ],
    tip: 'This is how you sell packaged AI tools — a Project with your skill already set up',
  },
]

const IDEAS = [
  {
    type: 'START', icon: '◈', title: 'Simple First Offers', badge: 'start',
    items: [
      'Offer 1 — Claude setup session: set up Projects, base skills, and 2-3 reusable prompts for one team. Fast to deliver and easy to sell as a one-off.',
      'Offer 2 — Workflow audit: review how a company handles content, ops, support, or research and show where Claude + MCPs can remove repetitive work.',
      'Offer 3 — Custom skill pack: write role-specific skill files for sales, support, marketing, or internal ops so the team gets repeatable outputs.',
      'Offer 4 — Internal prompt library: build a simple company starter kit with approved prompts, guardrails, and examples for each department.',
      'Offer 5 — AI handover doc: package the setup, usage rules, and walkthrough videos so the company can actually adopt what you built.',
    ],
  },
  {
    type: 'LADDER', icon: '⟲', title: 'Monetisation Ladder', badge: 'ladder',
    items: [
      'Stage 1 — Sell time: short setup calls, audits, and training sessions. You are selling speed and clarity, not software yet.',
      'Stage 2 — Sell assets: custom skills, prompt libraries, SOPs, and internal playbooks. This is more productised and easier to repeat.',
      'Stage 3 — Sell workflows: connect MCPs, define inputs/outputs, and build task flows for real teams like marketing or operations.',
      'Stage 4 — Sell infrastructure: become the person who sets up the company\'s AI operating layer across tools, permissions, docs, and automations.',
      'Stage 5 — Sell retainers: ongoing optimisation, new workflow rollouts, analytics, training, and support as the company matures.',
    ],
  },
  {
    type: 'INFRA', icon: '◎', title: 'What “AI Infrastructure” Means', badge: 'infra',
    items: [
      'AI infrastructure is not just “write prompts”. It means setting up how a company actually uses Claude safely and repeatedly across real work.',
      'Layer 1 — Access: choose accounts, permissions, approved tools, and who can use which MCPs.',
      'Layer 2 — Knowledge: organise source docs, project files, and reference material Claude should work from.',
      'Layer 3 — Behaviour: write skills, prompt templates, output formats, and review rules for each workflow.',
      'Layer 4 — Execution: connect MCPs so Claude can search docs, draft emails, update files, or deploy changes.',
      'Layer 5 — Governance: define approval steps, QA checks, and handoff points so the workflow is usable by a real team.',
    ],
  },
  {
    type: 'COMPANIES', icon: '▣', title: 'Infrastructure Offers For Companies', badge: 'sell',
    items: [
      'Marketing infrastructure: build a content engine with brand voice skills, research prompts, approval rules, and MCPs for docs/assets. Deliver as a monthly retainer.',
      'Sales infrastructure: create outbound research workflows, proposal drafting skills, meeting prep templates, and CRM-adjacent handoff processes.',
      'Support infrastructure: design response skills, escalation prompts, help centre drafting workflows, and QA rules for support teams.',
      'Ops infrastructure: connect files, docs, and calendars so Claude can help with SOP writing, meeting summaries, task prep, and reporting.',
      'Founder infrastructure: set up a personal operating system for inbox triage, note capture, weekly planning, and decision support using MCPs.',
    ],
  },
  {
    type: 'DELIVERY', icon: '⬡', title: 'How To Package The Work', badge: 'package',
    items: [
      'Done-with-you sprint: 1-2 week setup where you build the foundation live with the team and train them at the same time.',
      'Done-for-you implementation: you gather requirements, build the skills/workflows, test them, and deliver a handover package.',
      'Pilot offer: start with one department and one workflow only. This lowers risk and gives you a fast case study.',
      'Retainer model: each month you improve prompts, add workflows, maintain MCP setups, and train new team members.',
      'Template licensing: once one workflow works, sell a tailored version of the same system to similar companies.',
    ],
  },
  {
    type: 'USE_CASES', icon: '▦', title: 'MCP + Skill Use Cases To Sell', badge: 'use',
    items: [
      'Google Drive MCP + project skill: Claude can search company docs, pull the right context, and draft answers in the company\'s voice.',
      'Gmail MCP + sales skill: Claude drafts replies, follow-ups, and personalised outreach based on previous threads and offer rules.',
      'Calendar MCP + founder assistant skill: Claude prepares agendas, follow-ups, and weekly planning from the team calendar.',
      'Filesystem MCP + coding/project skill: Claude updates docs, organises files, and helps maintain internal project structure.',
      'Vercel or Cloudflare MCP + deployment skill: Claude assists with shipping small changes, checking logs, and managing simple operational tasks.',
      'Canva MCP + brand skill: Claude produces first-draft social assets and presentations that match the company\'s messaging system.',
    ],
  },
  {
    type: 'PROOF', icon: '◑', title: 'Proof You Need Before Selling Bigger Deals', badge: 'proof',
    items: [
      'Before/after examples: show how outputs improved once a team used a proper skill instead of ad hoc prompting.',
      'Time saved: measure one workflow before and after your setup. Companies buy saved time faster than they buy hype.',
      'Risk reduction: explain how templates, skills, and guardrails reduce bad outputs or inconsistent messaging.',
      'Repeatability: demonstrate that two different team members can get similar outputs using the same system.',
      'Adoption: record a simple Loom showing the workflow in under 5 minutes so decision-makers can see it is practical.',
    ],
  },
  {
    type: 'CONTENT', icon: '◉', title: 'Content Ideas That Lead To Clients', badge: 'daily',
    items: [
      'Break down one workflow you built: problem, setup, result, and what the company would actually pay for.',
      'Show one skill file and explain the business outcome it creates, not just the prompt structure.',
      'Document one MCP use case in plain English: “here\'s how a small team could use this every week.”',
      'Post mini audits: pick a common business process and explain how Claude infrastructure could improve it.',
      'Share failed tests too: companies trust builders more when they can explain limits, not just wins.',
      'Turn every client-style build into a case study, even if the “client” is your own demo business.',
    ],
  },
]

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    setMounted(true)
  }, [])
  const links: Array<{ id: Section; label: string }> = [
    { id: 'daily', label: 'Daily' },
    { id: 'skills', label: 'Skills' },
    { id: 'mcps', label: 'MCPs' },
    { id: 'radar', label: 'Radar' },
    { id: 'apis', label: 'API' },
    { id: 'tools', label: 'Tools' },
    { id: 'roadmap', label: 'Beginner to Agency' },
    { id: 'ideas', label: 'Ideas' },
  ]
  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-[#0066FF]/12 bg-[var(--page-bg)]/78 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display flex items-center text-base tracking-wider text-[#0066FF]">
            nocodebuilds<span className="ml-[2px] animate-blink text-[#0066FF]">_</span>
          </a>
          <div className="hidden items-center gap-1 lg:flex">
            <a href="#ideas" className="rounded border border-[#0066FF]/20 px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-[#0066FF]/65 transition-all duration-200 hover:scale-105 hover:border-[#0066FF]/55 hover:font-mono hover:tracking-[0.2em] hover:text-[#77B0FF] hover:drop-shadow-[0_0_8px_rgba(0,102,255,0.45)]">Sales</a>
            <a href="#roadmap" className="rounded border border-[#0066FF]/20 px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-[#0066FF]/65 transition-all duration-200 hover:scale-105 hover:border-[#0066FF]/55 hover:font-mono hover:tracking-[0.2em] hover:text-[#77B0FF] hover:drop-shadow-[0_0_8px_rgba(0,102,255,0.45)]">Ops</a>
            <a href="#ideas" className="rounded border border-[#0066FF]/20 px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-[#0066FF]/65 transition-all duration-200 hover:scale-105 hover:border-[#0066FF]/55 hover:font-mono hover:tracking-[0.2em] hover:text-[#77B0FF] hover:drop-shadow-[0_0_8px_rgba(0,102,255,0.45)]">Content</a>
          </div>
        </div>
        <nav className="hidden items-center gap-1 rounded border border-[#0066FF]/20 bg-[var(--page-bg)]/62 p-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="group rounded px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/65 transition-all duration-200 hover:bg-[#0066FF]/10 hover:text-[#B9D7FF]"
            >
              <span className="inline-block transition-all duration-200 group-hover:scale-110 group-hover:font-mono group-hover:tracking-[0.18em] group-hover:drop-shadow-[0_0_8px_rgba(0,102,255,0.45)]">{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={onToggle} type="button" className="theme-toggle-icon" aria-label="Toggle theme">
            <span aria-hidden>{mounted ? (theme === 'dark' ? '☀' : '☾') : '◌'}</span>
          </button>
          <a href="https://nocodebuilds.dev" target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-xs">Main Site</a>
        </div>
        <button onClick={() => setOpen(!open)} className="flex h-8 w-8 flex-col justify-center gap-[5px] md:hidden">
          <span className={`block h-[1px] bg-[#0066FF] transition-all duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`block h-[1px] bg-[#0066FF] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-[1px] bg-[#0066FF] transition-all duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>
      </div>
      <div className={`overflow-hidden bg-[var(--page-bg)]/92 transition-all duration-300 md:hidden ${open ? 'max-h-80 border-b border-[#0066FF]/22' : 'max-h-0'}`}>
        <div className="flex flex-col gap-4 px-6 py-4">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#0066FF]">
              {'>'} {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20">
      <DotGrid />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,102,255,0.1) 0%, transparent 65%)' }} />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent, var(--page-bg))' }} />
      <div className="absolute left-6 top-28 hidden select-none font-mono text-[10px] leading-6 text-[#0066FF]/25 xl:block">
        <div>{'/* sys.online */'}</div>
        <div>{'/* v1.0.0     */'}</div>
        <div>{'/* toolkit    */'}</div>
      </div>
      <div className="absolute right-6 top-28 hidden select-none text-right font-mono text-[10px] leading-6 text-[#0066FF]/25 xl:block">
        <div>SKILLS: LOADED</div>
        <div>MCPS: ACTIVE</div>
        <div>API: READY</div>
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="sr mb-8 inline-flex items-center gap-3 border border-[#0066FF]/25 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#0066FF]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#0066FF]" />
          nocodebuilds — claude toolkit
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#0066FF]" />
        </div>
        <h1 className="sr font-display mb-6 text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4rem]">
          Everything you need<br />
          <span className="text-[#0066FF]">to actually use Claude.</span>
          <span className="ml-2 inline-block h-[0.75em] w-[5px] animate-blink align-middle bg-[#0066FF]" aria-hidden />
        </h1>
        <p className="sr mx-auto mb-10 max-w-xl text-sm leading-relaxed text-white/45 md:text-[0.95rem]">
          Skills. MCPs. APIs. GitHub. VS Code. All explained in plain English — no jargon, no hype. Built by someone figuring it out in public.
        </p>
        <div className="sr mb-16 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="#skills" className="btn-primary">Start with Skills</a>
          <a href="#mcps" className="btn-ghost">Explore MCPs</a>
        </div>
        <div className="sr flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          {[
            { val: '8', label: 'Skill types' },
            { val: '12', label: 'MCPs covered' },
            { val: '5', label: 'API steps' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl text-[#0066FF] md:text-3xl">{s.val}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 select-none flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#0066FF]/35">
        <div>scroll</div>
        <div className="animate-bounce text-base">↓</div>
      </div>
    </section>
  )
}

function DailyTasks() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [activeTrack, setActiveTrack] = useState<string>(NICHE_TRACKS[0]?.name ?? '')
  const [currentDayIndex, setCurrentDayIndex] = useState(0)

  useEffect(() => {
    const storedChecks = window.localStorage.getItem('daily-task-checks')
    const storedNotes = window.localStorage.getItem('daily-task-notes')
    if (storedChecks) setChecks(JSON.parse(storedChecks) as Record<string, boolean>)
    if (storedNotes) setNotes(JSON.parse(storedNotes) as Record<string, string>)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('daily-task-checks', JSON.stringify(checks))
  }, [checks])

  useEffect(() => {
    window.localStorage.setItem('daily-task-notes', JSON.stringify(notes))
  }, [notes])

  const totalTasks = DAILY_TASKS.reduce((count, day) => count + day.tasks.length, 0)
  const completedTasks = Object.values(checks).filter(Boolean).length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  const selectedTrack = NICHE_TRACKS.find((track) => track.name === activeTrack) ?? NICHE_TRACKS[0]
  const currentPlan = DAILY_TASKS[currentDayIndex]

  return (
    <section id="daily" className="px-6 py-20" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="section-label sr">{'/* 00. DAILY LEARNING PLAN */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">Daily Tasks</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            A 7-day checklist you can tick off while you learn. Each day includes a space to log what clicked, what broke, and what to improve next.
          </p>
        </div>

        <div className="sr mb-6 card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066FF]/45">weekly progress</span>
            <span className="font-display text-xl text-[#0066FF]">{completedTasks}/{totalTasks} ({progress}%)</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-[#0066FF]/10">
            <div className="h-full bg-[#0066FF] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="sr mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentDayIndex((prev) => (prev === 0 ? DAILY_TASKS.length - 1 : prev - 1))}
            className="rounded border border-[#0066FF]/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0066FF]/75 transition-colors hover:border-[#0066FF]/55 hover:text-[#0066FF]"
          >
            ← Prev Day
          </button>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Day {currentDayIndex + 1} of {DAILY_TASKS.length}
          </div>
          <button
            type="button"
            onClick={() => setCurrentDayIndex((prev) => (prev === DAILY_TASKS.length - 1 ? 0 : prev + 1))}
            className="rounded border border-[#0066FF]/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0066FF]/75 transition-colors hover:border-[#0066FF]/55 hover:text-[#0066FF]"
          >
            Next Day →
          </button>
        </div>

        {currentPlan && (
          <div className="sr-group grid gap-5">
            <div key={currentPlan.day} className="sr card group relative p-5">
              <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />

              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{currentPlan.day.toUpperCase()}]</span>
                <span className="badge">{currentPlan.tasks.filter((_, idx) => checks[`${currentPlan.day}-${idx}`]).length}/{currentPlan.tasks.length}</span>
              </div>

              <h3 className="font-display mb-2 text-base transition-colors group-hover:text-[#0066FF]">{currentPlan.title}</h3>
              <p className="mb-4 text-xs leading-relaxed text-white/45">{currentPlan.focus}</p>

              <div className="space-y-2">
                {currentPlan.tasks.map((task, idx) => {
                  const taskKey = `${currentPlan.day}-${idx}`
                  const inputId = `task-${currentPlan.day.replace(/\s+/g, '-').toLowerCase()}-${idx}`
                  return (
                    <div key={taskKey} className="rounded border border-[#0066FF]/10 p-3 hover:border-[#0066FF]/35">
                      <div className="flex items-start justify-between gap-3">
                        <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={Boolean(checks[taskKey])}
                            onChange={() => setChecks((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }))}
                            className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0066FF]"
                          />
                          <span className={`text-xs leading-relaxed ${checks[taskKey] ? 'text-white/30 line-through' : 'text-white/55'}`}>{task.label}</span>
                        </label>
                        <a
                          href={`#${task.section}`}
                          title={`Jump to ${task.sectionLabel}`}
                          className="shrink-0 rounded border border-[#0066FF]/20 px-2 py-1 font-mono text-[10px] text-[#0066FF]/70 transition-colors hover:border-[#0066FF]/60 hover:text-[#0066FF]"
                          aria-label={`Jump to ${task.sectionLabel} section`}
                        >
                          ↗
                        </a>
                      </div>
                      <div className="mt-3 space-y-2 pl-7">
                        <div>
                          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Where to find it</div>
                          <p className="text-[11px] leading-relaxed text-white/40">{task.whereToGetIt}</p>
                        </div>
                        <div>
                          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Do this first</div>
                          <p className="text-[11px] leading-relaxed text-white/40">{task.firstAction}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {DAILY_GUIDES[currentPlan.day] && (
                <div className="mt-4 space-y-4 border-t border-[#0066FF]/15 pt-4">
                  <div>
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/45">Exact steps</div>
                    <ol className="space-y-2">
                      {DAILY_GUIDES[currentPlan.day].exactSteps.map((step, idx) => (
                        <li key={step} className="flex items-start gap-3 text-[11px] leading-relaxed text-white/42">
                          <span className="font-mono text-[#0066FF]/40 shrink-0">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/45">Common blockers</div>
                    <div className="space-y-2">
                      {DAILY_GUIDES[currentPlan.day].blockers.map((blocker) => (
                        <div key={blocker.issue} className="rounded border border-[#0066FF]/10 bg-[#0066FF]/[0.02] p-3">
                          <div className="mb-1 font-mono text-[10px] text-[#0066FF]/55">blocked: {blocker.issue}</div>
                          <p className="text-[11px] leading-relaxed text-white/42">{blocker.fix}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/45">What I learned today</div>
                <textarea
                  value={notes[currentPlan.day] ?? ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [currentPlan.day]: e.target.value }))}
                  placeholder="Write your wins, mistakes, and takeaways..."
                  rows={4}
                  className="w-full resize-y border border-[#0066FF]/20 bg-[#0066FF]/[0.03] p-3 text-xs leading-relaxed text-white/70 placeholder:text-white/25"
                />
              </div>
            </div>
          </div>
        )}

        <div className="sr mt-16 card p-6">
          <div className="mb-3 section-label">{'/* NICHE TRACKS */'}</div>
          <h3 className="font-display mb-3 text-2xl">Niche Tracks (Alternative 7-Step Paths)</h3>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/45">
            These are alternative paths using the same 7-day structure, not an additional second plan. Pick one niche track instead of doing all of them.
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {NICHE_TRACKS.map((track) => (
              <button
                key={track.name}
                type="button"
                onClick={() => setActiveTrack(track.name)}
                className={`rounded border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${activeTrack === track.name ? 'border-[#0066FF]/60 bg-[#0066FF]/10 text-[#0066FF]' : 'border-[#0066FF]/20 text-white/45 hover:border-[#0066FF]/40 hover:text-[#0066FF]'}`}
              >
                {track.icon} {track.name}
              </button>
            ))}
          </div>

          {selectedTrack && (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_1.9fr]">
              <div className="rounded border border-[#0066FF]/15 bg-[#0066FF]/[0.03] p-5">
                <div className="mb-2 font-display text-xl text-[#0066FF]">{selectedTrack.icon} {selectedTrack.name}</div>
                <p className="text-sm leading-relaxed text-white/45">{selectedTrack.summary}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selectedTrack.days.map((day) => (
                  <div key={`${selectedTrack.name}-${day.day}`} className="rounded border border-[#0066FF]/12 p-4">
                    <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/45">[{day.day.toUpperCase()}]</div>
                    <p className="text-xs leading-relaxed text-white/48">{day.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section id="skills" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="section-label sr">{'/* 01. WHAT ARE SKILLS */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">Claude Skills</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            A skill is a <span className="text-[#0066FF]">.md file Claude reads before acting.</span> It sets the rules. Think of it as a cheat sheet that makes Claude consistent every time.
          </p>
        </div>
        <div className="sr-group grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SKILLS.map((skill, i) => (
            <div
              key={skill.title}
              className="sr card group relative flex cursor-pointer flex-col p-6"
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors duration-300 group-hover:border-[#0066FF]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors duration-300 group-hover:border-[#0066FF]" />
              <div className="mb-3 font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{skill.label}]</div>
              <div className="mb-3 text-2xl text-[#0066FF]">{skill.icon}</div>
              <h3 className="font-display mb-2 text-base transition-colors group-hover:text-[#0066FF]">{skill.title}</h3>
              <p className="mb-4 flex-grow text-xs leading-relaxed text-white/40">{skill.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`badge ${skill.difficulty === 'beginner' ? 'badge-green' : skill.difficulty === 'intermediate' ? 'badge-amber' : 'badge-purple'}`}>
                  {skill.difficulty}
                </span>
                <span className="font-mono text-[10px] text-[#0066FF]/40">{active === i ? '▲ less' : '▼ more'}</span>
              </div>
              {active === i && (
                <div className="mt-4 border-t border-[#0066FF]/15 pt-4 space-y-3">
                  <div>
                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">How to use</div>
                    <p className="text-xs leading-relaxed text-white/50">{skill.howTo}</p>
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Where to find</div>
                    <p className="text-xs leading-relaxed text-white/50">{skill.where}</p>
                  </div>
                  <div className="rounded border border-[#0066FF]/15 bg-[#0066FF]/5 p-3">
                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Example trigger</div>
                    <p className="font-mono text-[11px] leading-relaxed text-[#0066FF]/70">{skill.example}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MCPs() {
  const [active, setActive] = useState<number | null>(null)
  const statusColor = (s: string) => s === 'official' ? 'badge-green' : s === 'connected' ? '' : 'badge-amber'
  return (
    <section id="mcps" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="section-label sr">{'/* 02. MCP DIRECTORY */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">MCPs</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            MCPs give Claude <span className="text-[#0066FF]">hands</span> — the ability to click, type, read files, send emails, deploy code. Each one is a plugin that connects Claude to a real tool.
          </p>
        </div>
        <div className="sr-group grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MCPS.map((mcp, i) => (
            <div
              key={mcp.title}
              className="sr card group relative flex cursor-pointer flex-col p-6"
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{mcp.label}]</span>
                <span className={`badge ${statusColor(mcp.status)}`}>{mcp.status}</span>
              </div>
              <div className="mb-3 text-2xl text-[#0066FF]">{mcp.icon}</div>
              <h3 className="font-display mb-2 text-base transition-colors group-hover:text-[#0066FF]">{mcp.title}</h3>
              <p className="mb-4 flex-grow text-xs leading-relaxed text-white/40">{mcp.desc}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {mcp.useCases.slice(0, 2).map((u) => (
                  <span key={u} className="rounded border border-[#0066FF]/15 px-2 py-0.5 font-mono text-[10px] text-[#0066FF]/50">{u}</span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#0066FF]/40 self-end">{active === i ? '▲ less' : '▼ how to add'}</span>
              {active === i && (
                <div className="mt-4 border-t border-[#0066FF]/15 pt-4 space-y-3">
                  <div>
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">How to add</div>
                    <p className="text-xs leading-relaxed text-white/50">{mcp.howToAdd}</p>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Where you actually use it</div>
                    <p className="text-xs leading-relaxed text-white/50">{mcp.whereToUse}</p>
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">All use cases</div>
                    <ul className="space-y-1">
                      {mcp.useCases.map((u) => (
                        <li key={u} className="text-xs text-white/40 before:mr-2 before:text-[#0066FF]/40 before:content-['→']">{u}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded border border-[#0066FF]/15 bg-[#0066FF]/5 p-3">
                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">First prompt to try</div>
                    <p className="font-mono text-[11px] leading-relaxed text-[#0066FF]/70">{mcp.firstPrompt}</p>
                  </div>
                  <div className="font-mono text-[10px] text-[#0066FF]/35">{mcp.url}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MCPRadar() {
  const [items, setItems] = useState<RadarItem[]>([])
  const [fetchedAt, setFetchedAt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [pathFilter, setPathFilter] = useState<string>('all')
  const [nicheFilter, setNicheFilter] = useState<string>('all')
  const [keyword, setKeyword] = useState('')

  const shortText = (value: string, max: number) => {
    if (value.length <= max) return value
    return `${value.slice(0, max - 1)}…`
  }

  const nicheOf = (item: RadarItem) => {
    const haystack = `${item.monetizationPath} ${item.description} ${item.whyItCouldMakeMoney} ${item.firstIdea}`.toLowerCase()

    if (/(content|creative|brand|social|canva|presentation|copy|marketing|video|higgsfield|kling|creator|thumbnail)/.test(haystack)) return 'content'
    if (/(business|client|sales|outreach|founder|support|ops|knowledge|revenue)/.test(haystack)) return 'business'
    if (/(automation|automate|workflow|browser|playwright|task|repetitive|scheduled)/.test(haystack)) return 'automations'
    if (/(developer|dev|code|deploy|cloudflare|vercel|github|filesystem|technical)/.test(haystack)) return 'technical'
    if (/(research|search|web|rss|intel|analysis)/.test(haystack)) return 'research'
    return 'other'
  }

  const loadRadar = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/mcp-radar', { cache: 'no-store' })
      const data = await response.json() as RadarResponse

      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'Unable to load radar')
      }

      setItems(data.items)
      setFetchedAt(data.fetchedAt ?? '')
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRadar()
  }, [])

  const categories = ['all', ...Array.from(new Set(items.map((item) => item.monetizationPath)))]
  const filteredByPath = pathFilter === 'all' ? items : items.filter((item) => item.monetizationPath === pathFilter)
  const filteredByNiche = nicheFilter === 'all' ? filteredByPath : filteredByPath.filter((item) => nicheOf(item) === nicheFilter)
  const filteredItems = keyword.trim() === ''
    ? filteredByNiche
    : filteredByNiche.filter((item) => {
        const haystack = `${item.name} ${item.fullName} ${item.description} ${item.monetizationPath} ${item.whyItCouldMakeMoney} ${item.firstIdea}`.toLowerCase()
        return haystack.includes(keyword.toLowerCase())
      })

  return (
    <section id="radar" className="px-6 py-20" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-label">{'/* 03. LIVE MCP RADAR */'}</div>
            <h2 className="font-display text-3xl md:text-4xl">Live MCP Radar</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
              Live GitHub scan for recently updated MCP-related repos, filtered through a simple question: could this unlock a workflow people would pay for?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 md:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">niche</span>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="border border-[#0066FF]/20 bg-[var(--page-bg)]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70"
              >
                <option value="all">All</option>
                <option value="content">Content</option>
                <option value="business">Business</option>
                <option value="automations">Automations</option>
                <option value="technical">Technical</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="hidden items-center gap-2 md:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">search</span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="higgsfield, kling, canva..."
                className="w-44 border border-[#0066FF]/20 bg-[var(--page-bg)]/80 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-white/75 placeholder:text-white/30"
              />
            </label>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              {fetchedAt ? `last scan: ${new Date(fetchedAt).toLocaleString()}` : 'waiting for scan'}
            </div>
            <button type="button" onClick={() => void loadRadar()} className="btn-ghost px-4 py-2 text-xs">
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 card p-6">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066FF]/45">how to use this</div>
          <p className="text-sm leading-relaxed text-white/45">
            Look for MCPs that map to painful business workflows: sales, content, support, ops, research, or delivery. If a repo helps Claude act inside a tool people already pay for, it may be the start of a monetisable service.
          </p>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-[#0066FF]/65">
            Content automation tip: try filters `Content` + search `browser`, `playwright`, `canva`, `higgsfield`, or `kling`.
          </p>
        </div>

        {items.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setPathFilter(category)}
                className={`rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${pathFilter === category ? 'border-[#0066FF]/60 bg-[#0066FF]/10 text-[#0066FF]' : 'border-[#0066FF]/20 text-white/45 hover:border-[#0066FF]/45 hover:text-[#0066FF]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-8 rounded border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card animate-pulse p-6">
                <div className="mb-4 h-4 w-24 bg-[#0066FF]/10" />
                <div className="mb-3 h-6 w-2/3 bg-[#0066FF]/10" />
                <div className="mb-2 h-3 w-full bg-[#0066FF]/10" />
                <div className="mb-6 h-3 w-5/6 bg-[#0066FF]/10" />
                <div className="h-20 bg-[#0066FF]/10" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded border border-[#0066FF]/20 bg-[#0066FF]/[0.03] p-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066FF]/45">No MCP Results Yet</div>
            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/45">
              The scanner is live, but there are no repos in this filter right now. Try another category or refresh for a fresh scan.
            </p>
            <button type="button" onClick={() => void loadRadar()} className="btn-ghost px-4 py-2 text-xs">
              Run Scan Again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="card group relative p-4">
                <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />

                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="badge">{item.freshness}</span>
                  <span className="font-mono text-[10px] text-white/30">★ {item.stars}</span>
                </div>

                <h3 className="font-display mb-1 text-sm transition-colors group-hover:text-[#0066FF]">{item.name}</h3>
                <div className="mb-2 font-mono text-[10px] tracking-[0.1em] text-[#0066FF]/40">{shortText(item.fullName, 48)}</div>
                <p className="mb-3 text-[11px] leading-relaxed text-white/45">{shortText(item.description, 130)}</p>

                <div className="mb-3 rounded border border-[#0066FF]/15 bg-[#0066FF]/5 p-2.5">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Money path</div>
                  <p className="text-[11px] leading-relaxed text-white/55">{shortText(item.monetizationPath, 58)}</p>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed text-white/45">
                  <p><span className="text-[#0066FF]/55">why:</span> {shortText(item.whyItCouldMakeMoney, 110)}</p>
                  <p><span className="text-[#0066FF]/55">idea:</span> {shortText(item.firstIdea, 100)}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#0066FF]/15 pt-3">
                  <span className="font-mono text-[10px] text-white/30">updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-ghost px-2.5 py-1.5 text-[10px]">
                    View Repo
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function APIs() {
  const [active, setActive] = useState<number | null>(0)
  return (
    <section id="apis" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="section-label sr">{'/* 03. CLAUDE API */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">The API</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            The API is just a <span className="text-[#0066FF]">fetch call</span> to Anthropic. You send a prompt, you get a response. That&apos;s the whole thing.
          </p>
        </div>
        <div className="sr grid gap-5 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            {API_STEPS.map((step, i) => (
              <button
                key={step.num}
                onClick={() => setActive(i)}
                className={`w-full text-left card group relative p-4 transition-all ${active === i ? 'border-[#0066FF]/55 bg-[#0066FF]/05' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#0066FF]/40">{step.num}</span>
                  <span className={`text-sm font-medium transition-colors ${active === i ? 'text-[#0066FF]' : 'text-white/60 group-hover:text-[#0066FF]'}`}>{step.title}</span>
                </div>
              </button>
            ))}
          </div>
          {active !== null && (
            <div className="terminal lg:col-span-3">
              <div className="terminal-header">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#0066FF]/40" />
                  <div className="h-2 w-2 rounded-full bg-[#0066FF]/20" />
                  <div className="h-2 w-2 rounded-full bg-[#0066FF]/10" />
                </div>
                <span className="font-mono text-[10px] text-[#0066FF]/40">step-{API_STEPS[active].num}.ts</span>
              </div>
              <div className="p-6">
                <p className="mb-4 text-sm leading-relaxed text-white/55">{API_STEPS[active].desc}</p>
                <pre className="mb-4 overflow-x-auto rounded border border-[#0066FF]/15 bg-[#0066FF]/05 p-4 font-mono text-[11px] leading-relaxed text-[#0066FF]/80">
                  {API_STEPS[active].code}
                </pre>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-[#0066FF]/50">{'// note:'}</span>
                  <span className="text-xs text-white/35">{API_STEPS[active].note}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Tools() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section id="tools" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="section-label sr">{'/* 04. GITHUB + VSCODE */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">Tools & Setup</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            Where to find skills on GitHub, how to install MCPs, and how to set up VS Code so Claude understands your entire project.
          </p>
        </div>
        <div className="sr-group grid gap-5 md:grid-cols-2">
          {TOOLS_STEPS.map((tool, i) => (
            <div key={tool.title} className="sr card group relative cursor-pointer p-6" onClick={() => setActive(active === i ? null : i)}>
              <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="mb-3 font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{tool.label}]</div>
              <div className="mb-3 text-2xl text-[#0066FF]">{tool.icon}</div>
              <h3 className="font-display mb-3 text-base transition-colors group-hover:text-[#0066FF]">{tool.title}</h3>
              <ol className={`space-y-2 ${active === i ? '' : 'max-h-24 overflow-hidden'}`}>
                {tool.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-xs leading-relaxed text-white/40">
                    <span className="font-mono text-[#0066FF]/40 shrink-0">{j + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              {active === i && (
                <div className="mt-4 border-t border-[#0066FF]/15 pt-4">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Pro tip</div>
                  <p className="font-mono text-[11px] leading-relaxed text-[#0066FF]/60">{tool.tip}</p>
                </div>
              )}
              <span className="mt-3 block font-mono text-[10px] text-[#0066FF]/40">{active === i ? '▲ less' : '▼ see all steps'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Roadmap() {
  const [activeStage, setActiveStage] = useState(0)
  const [showDetails, setShowDetails] = useState(true)
  const [done, setDone] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const saved = window.localStorage.getItem('agency-path-done')
    if (saved) setDone(JSON.parse(saved) as Record<number, boolean>)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('agency-path-done', JSON.stringify(done))
  }, [done])

  const journey = [
    {
      phase: 'Phase 1',
      span: 'Days 1-7',
      title: 'Learn The Core Stack',
      summary: 'Understand skills, Projects, one MCP, and one API call without overcomplicating your setup.',
      actions: [
        'Build one tiny workflow end-to-end so you understand all moving parts.',
        'Use one MCP you already need in real life (Drive, Gmail, or Calendar).',
        'Save one working API template and one working skill template.',
      ],
      builderMove: 'Beginner move: learn by shipping tiny systems, not by reading everything first.',
    },
    {
      phase: 'Phase 2',
      span: 'Days 8-14',
      title: 'Turn Learning Into Proof',
      summary: 'Make your work visible and testable so it looks like capability, not theory.',
      actions: [
        'Create one mini case study with problem, setup, result, and limitation.',
        'Record one quick demo showing the workflow from start to finish.',
        'Capture before/after outputs to prove quality or time improvement.',
      ],
      builderMove: 'Builder move: experiments become assets only when documented clearly.',
    },
    {
      phase: 'Phase 3',
      span: 'Days 15-21',
      title: 'Pick A Niche And Shape Offers',
      summary: 'Choose one business lane and define simple services around one painful workflow.',
      actions: [
        'Pick one lane first: content, sales, support, or operations.',
        'Define three starter offers with clear deliverables.',
        'Map which skills + MCPs power each offer so it feels concrete.',
      ],
      builderMove: 'Agency move: sell one solved problem before trying to sell a full transformation.',
    },
    {
      phase: 'Phase 4',
      span: 'Days 22-30',
      title: 'Package As Infrastructure',
      summary: 'Move from ad-hoc help into repeatable delivery with audit, setup, QA, and handover.',
      actions: [
        'Package one pilot offer with a start, end, and handover checklist.',
        'Create your implementation flow: audit, build, test, train, handoff.',
        'Publish three content pieces showing exactly how the workflow works.',
      ],
      builderMove: 'System move: you are no longer just prompting; you are designing an operating layer.',
    },
    {
      phase: 'Phase 5',
      span: 'Ongoing',
      title: 'Grow Into Agency Delivery',
      summary: 'Standardise what works so you can repeat delivery across clients and niches.',
      actions: [
        'Build reusable onboarding, testing, and handover templates.',
        'Track what varies by niche and what stays reusable in your system.',
        'Use retainers to improve and expand workflows over time.',
      ],
      builderMove: 'Agency move: consistent process beats one-off genius every time.',
    },
  ]

  const current = journey[activeStage]
  const progress = Math.round((Object.values(done).filter(Boolean).length / journey.length) * 100)

  return (
    <section id="roadmap" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="section-label">{'/* 05. BEGINNER TO AGENCY */'}</div>
          <h2 className="font-display text-3xl md:text-4xl">Beginner to Agency</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            One merged journey that combines your 30-day direction and beginner-to-agency process into a cleaner stage-by-stage path.
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveStage((prev) => (prev === 0 ? journey.length - 1 : prev - 1))}
            className="rounded border border-[#0066FF]/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#0066FF]/75 transition-colors hover:border-[#0066FF]/55 hover:text-[#0066FF] sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Prev</span>
          </button>
          <div className="text-center font-mono text-[9px] uppercase tracking-[0.12em] text-white/40 sm:text-[10px] sm:tracking-[0.2em]">
            <span className="hidden sm:inline">{current.phase} • </span>
            {activeStage + 1}/{journey.length}
          </div>
          <button
            type="button"
            onClick={() => setActiveStage((prev) => (prev === journey.length - 1 ? 0 : prev + 1))}
            className="rounded border border-[#0066FF]/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#0066FF]/75 transition-colors hover:border-[#0066FF]/55 hover:text-[#0066FF] sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">→</span>
            <span className="hidden sm:inline">Next →</span>
          </button>
        </div>

        <div className="mb-6 card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066FF]/45">journey completion</span>
            <span className="font-display text-lg text-[#0066FF]">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-[#0066FF]/10">
            <div className="h-full bg-[#0066FF] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div key={activeStage} className="card group relative p-6" style={{ animation: 'roadmapStageIn 280ms ease' }}>
          <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{current.span.toUpperCase()}]</span>
            <span className="badge">{current.phase.toLowerCase()}</span>
          </div>
          <h3 className="font-display mb-2 text-xl transition-colors group-hover:text-[#0066FF]">{current.title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-white/55">{current.summary}</p>

          <div className="mb-4 rounded border border-[#0066FF]/15 bg-[#0066FF]/5 p-3">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Builder move</div>
            <p className="text-xs leading-relaxed text-white/55">{current.builderMove}</p>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="rounded border border-[#0066FF]/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0066FF]/75 transition-colors hover:border-[#0066FF]/55 hover:text-[#0066FF]"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            <button
              type="button"
              onClick={() => setDone((prev) => ({ ...prev, [activeStage]: !prev[activeStage] }))}
              className={`rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${done[activeStage] ? 'border-emerald-400/40 text-emerald-300' : 'border-[#0066FF]/25 text-[#0066FF]/75 hover:border-[#0066FF]/55 hover:text-[#0066FF]'}`}
            >
              {done[activeStage] ? 'Marked done' : 'Mark phase done'}
            </button>
          </div>

          {showDetails && (
            <ul className="space-y-2">
              {current.actions.map((action) => (
                <li key={action} className="flex items-start gap-3 text-xs leading-relaxed text-white/45">
                  <span className="font-mono text-[#0066FF]/40 shrink-0">→</span>
                  {action}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {journey.map((stage, idx) => (
            <button
              key={stage.phase}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors sm:px-2.5 sm:py-1.5 sm:text-[10px] sm:tracking-[0.12em] ${idx === activeStage ? 'border-[#0066FF]/60 bg-[#0066FF]/10 text-[#0066FF]' : 'border-[#0066FF]/20 text-white/45 hover:border-[#0066FF]/45 hover:text-[#0066FF]'}`}
            >
              <span className="sm:hidden">{idx + 1}</span>
              <span className="hidden sm:inline">{stage.phase}</span>
            </button>
          ))}
        </div>

        <style jsx>{`
          @keyframes roadmapStageIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.995);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </section>
  )
}

function Ideas() {
  return (
    <section id="ideas" className="px-6 py-28" style={{ borderTop: '1px solid rgba(0,102,255,0.08)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="section-label sr">{'/* 06. OFFERS + INFRASTRUCTURE */'}</div>
          <h2 className="sr font-display text-3xl md:text-4xl">Offers & Agency Ideas</h2>
          <p className="sr mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            Ideas for turning what you learn into useful company-facing services, especially around skills, MCPs, and lightweight AI infrastructure.
          </p>
        </div>

        <div className="mb-16">
          <div className="section-label sr">{'/* AGENCY OFFERS */'}</div>
          <div className="sr-group grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {AGENCY_OFFERS.map((offer) => (
              <div key={offer.title} className="sr card group relative p-6">
                <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
                <div className="mb-3 text-2xl text-[#0066FF]">{offer.icon}</div>
                <h3 className="font-display mb-2 text-base transition-colors group-hover:text-[#0066FF]">{offer.title}</h3>
                <p className="mb-4 text-xs leading-relaxed text-white/45">{offer.who}</p>
                <ul className="space-y-2">
                  {offer.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-3 text-xs leading-relaxed text-white/40">
                      <span className="font-mono text-[#0066FF]/40 shrink-0">→</span>
                      {deliverable}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-[#0066FF]/15 pt-4">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Why it matters</div>
                  <p className="text-xs leading-relaxed text-white/50">{offer.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="section-label sr">{'/* NICHE EXAMPLES */'}</div>
          <div className="sr-group grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {NICHE_WORKFLOWS.map((workflow) => (
              <div key={workflow.niche} className="sr card group relative p-6">
                <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl text-[#0066FF]">{workflow.icon}</span>
                  <h3 className="font-display text-base transition-colors group-hover:text-[#0066FF]">{workflow.niche}</h3>
                </div>
                <div className="mb-3">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Common problem</div>
                  <p className="text-xs leading-relaxed text-white/45">{workflow.problem}</p>
                </div>
                <div className="mb-3">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Useful stack</div>
                  <ul className="space-y-2">
                    {workflow.stack.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-xs leading-relaxed text-white/40">
                        <span className="font-mono text-[#0066FF]/40 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-[#0066FF]/15 pt-4">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#0066FF]/40">Offer idea</div>
                  <p className="text-xs leading-relaxed text-white/50">{workflow.offerIdea}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sr-group grid gap-5 md:grid-cols-2">
          {IDEAS.map((idea) => (
            <div key={idea.title} className="sr card group relative p-6">
              <div className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[#0066FF]/30 transition-colors group-hover:border-[#0066FF]" />
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#0066FF]/35">[{idea.type}]</span>
                <span className={`badge ${idea.badge === 'money' || idea.badge === 'sell' ? 'badge-green' : idea.badge === 'series' ? 'badge-purple' : ''}`}>{idea.badge}</span>
              </div>
              <div className="mb-3 text-2xl text-[#0066FF]">{idea.icon}</div>
              <h3 className="font-display mb-4 text-base transition-colors group-hover:text-[#0066FF]">{idea.title}</h3>
              <ul className="space-y-3">
                {idea.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-xs leading-relaxed text-white/40">
                    <span className="font-mono text-[#0066FF]/40 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="sr mt-12 terminal p-8 text-center">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0066FF]/40">{'/* the formula */'}</div>
          <div className="font-display text-xl text-white/80 md:text-2xl">
            Learn it → Build it → Document it → <span className="text-[#0066FF]">Sell it</span>
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/35">
            Every section of this tracker is a content idea. Every build is proof. Every piece of proof is a sale.
          </p>
          <div className="mt-6 font-mono text-[11px] text-[#0066FF]/40">
            {'>'} nocodebuilds<span className="animate-blink">_</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 py-8" style={{ borderTop: '1px solid rgba(0,102,255,0.1)' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="font-display flex items-center gap-1 text-sm text-[#0066FF]">
          nocodebuilds<span className="animate-blink">_</span>
        </div>
        <div className="text-center font-mono text-[10px] text-white/15">
          © {new Date().getFullYear()} nocodebuilds · Claude Toolkit · Built with Next.js
        </div>
        <a href="https://nocodebuilds.dev" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-[#0066FF] transition-colors">
          ← main site
        </a>
      </div>
    </footer>
  )
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [theme, setTheme] = useState<Theme>('dark')

  useScrollReveal()

  useEffect(() => {
    const saved = window.localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
      return
    }
    setTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <Nav theme={theme} onToggle={() => setTheme((p) => p === 'dark' ? 'light' : 'dark')} />
      <main>
        <Hero />
        <DailyTasks />
        <Skills />
        <MCPs />
        <MCPRadar />
        <APIs />
        <Tools />
        <Roadmap />
        <Ideas />
      </main>
      <Footer />
    </>
  )
}
