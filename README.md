# OpenSourceSports

The world's most accessible, version-controlled collection of sports rules and regulations — open source, community-driven, and always up to date.

## What Is This?

OpenSourceSports is a structured repository of sports rulebooks rendered as standalone HTML pages. Every file is self-contained, mobile-friendly, and works offline. Rules are kept current with the latest official governing body publications.

**Official Sports** — Rules from recognized governing bodies (NFL, FIFA, NBA, UFC, NHL, etc.), updated annually to reflect the latest rule changes.

**Custom Sports** — Community-created games organized into two tiers:
- **Casual** — Fun, loosely structured games (beer pong, thumb wrestling, hide & seek)
- **Competitive** — Structured sports with organized rulesets that aren't yet governed by an official body

## Repository Structure

```
OpenSourceSports/
├── Official/
│   ├── Team Sports/
│   │   ├── Football/          → NFL_Official_Rulebook.html
│   │   ├── Soccer/            → FIFA_Laws_of_Game.html
│   │   ├── Hockey/            → NHL_Official_Rulebook.html
│   │   └── Basketball/        → NBA_Official_Rulebook.html (queued)
│   ├── Combat Sports/
│   │   ├── MMA/               → UFC_Unified_Rulebook.html
│   │   ├── Boxing/            → WBA_Official_Rulebook.html, WBC_Official_Rulebook.html
│   │   └── PowerSlap/         → PowerSlap_Official_Rulebook.html
│   ├── Racquet Sports/        → (queued)
│   └── Individual Sports/     → (queued)
│
├── Custom/
│   ├── Casual/                → Fun, loosely structured games
│   │   ├── party-games/       → beerpong/
│   │   ├── playground-games/  → hide-and-seek/
│   │   ├── mini-sports/       → thumb-wrestling/
│   │   └── ball-games/        → football-variants/end-zone-exchange/
│   └── Competitive/           → Structured but not officially regulated
│
├── assets/
│   ├── css/opensourcesports.css
│   └── images/dll-logo.png
│
├── .github/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
└── README.md
```

## HTML File Format

Every rulebook follows a consistent 8-section structure with embedded metadata, a collapsible table of contents, and per-section navigation.

### Required Sections

| # | Section ID | Content |
|---|-----------|---------|
| 1 | `introduction` | Sport overview, history, governing body |
| 2 | `equipment` | Required gear, specifications, standards |
| 3 | `playing-area` | Field/court/ring dimensions and markings |
| 4 | `players-officials` | Team sizes, positions, officials, roles |
| 5 | `rules-of-play` | Core gameplay rules and mechanics |
| 6 | `scoring` | Point systems, win conditions |
| 7 | `violations-penalties` | Fouls, infractions, consequences |
| 8 | `safety-considerations` | Player safety, equipment standards, protocols |

### Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sport - Official Rulebook</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="[RELATIVE_PATH]/assets/css/opensourcesports.css">
</head>
<body>
  <!--
  METADATA
  {
    "sport": "Sport Name",
    "category": "Category",
    "type": "OFFICIAL",
    "governingBody": "Organization",
    "version": "2026.1",
    "lastUpdated": "2026-03-03",
    "author": "OpenSourceSports",
    "tags": ["tag1", "tag2"]
  }
  -->

  <header id="top">
    <h1>Sport Name - Official Rulebook</h1>
    <p class="governing-body">Governing Body: Organization</p>
    <p class="last-updated">Last Updated: March 03, 2026</p>
  </header>

  <nav class="oss-toc" id="toc">
    <details open>
      <summary>Table of Contents</summary>
      <ol>
        <li><a href="#introduction"><span class="toc-number">1.</span> Introduction</a></li>
        <!-- ... all 8 sections ... -->
      </ol>
    </details>
  </nav>

  <main>
    <section id="introduction">
      <h2>Section 1: Introduction</h2>
      <!-- Content -->
      <div class="oss-section-foot">
        <a href="#toc" class="oss-back-top">↑ Back to Contents</a>
      </div>
    </section>
    <!-- ... remaining sections ... -->
  </main>

  <footer>
    <!-- OpenSourceSports copyright + DLL branding -->
  </footer>
</body>
</html>
```

### Metadata Comment Block

The `METADATA` JSON comment is **required** at the top of `<body>`. It powers automation, indexing, and validation.

| Field | Required | Description |
|-------|----------|-------------|
| `sport` | Yes | Full sport name |
| `category` | Yes | Parent category (e.g., "Team Sports") |
| `type` | Yes | `OFFICIAL` or `CUSTOM` |
| `governingBody` | Yes | Organization abbreviation (or empty for custom) |
| `version` | Yes | `YYYY.N` for official, `X.Y.Z` for custom |
| `lastUpdated` | Yes | ISO date `YYYY-MM-DD` |
| `author` | Yes | `OpenSourceSports` or contributor name |
| `tags` | Yes | Array of searchable tags |

## Naming Conventions

### Directories

| Type | Convention | Examples |
|------|-----------|----------|
| Official categories | Title Case with spaces | `Team Sports`, `Combat Sports` |
| Official sport dirs | Title Case with spaces | `Football`, `Boxing` |
| Custom categories | lowercase-kebab | `party-games`, `ball-games` |
| Custom sport dirs | lowercase-kebab | `beerpong`, `thumb-wrestling` |

### Files

| Type | Pattern | Examples |
|------|---------|----------|
| Official | `[Org]_[RuleType].html` | `NFL_Official_Rulebook.html`, `FIFA_Laws_of_Game.html` |
| Custom | `[sport]-rules.html` | `beerpong-rules.html`, `end-zone-exchange-rules.html` |
| Archived | `[Org]_[RuleType]_[Year].html` | `NFL_Official_Rulebook_2025.html` |

### Commit Messages

```
[OFFICIAL] add: Basketball (NBA) — full rulebook with 8 sections
[CUSTOM]   add: Spikeball — full rulebook with 8 sections
[UPDATE]   2025-2026 rule updates for NFL, UFC, NHL, FIFA
[STYLE]    upgrade: Sport (Org) — add stylesheet + DLL branding
[REFINE]   convert: Sport (Org) — convert to structured HTML
[BRAND]    upgrade footer with real DLL logo
```

## Contributing

We welcome contributions! OpenSourceSports uses a hybrid automation + community model.

### How It Works

1. **Daily automation** — [OpenClaw](https://digilogiclabs.com), our AI-powered automation agent, adds one new sport per day from a curated queue, generates structured HTML via Claude CLI, validates the output, and commits to this repo.

2. **Community PRs** — Anyone can submit a pull request to add a new sport, fix rule inaccuracies, or improve existing content. OpenClaw reviews PRs automatically every 30 minutes:
   - Validates HTML structure (8 required sections, metadata block, closing tags)
   - Checks naming conventions and file placement
   - For rule changes to official sports, compares against the latest published ruleset from the governing body
   - Approves valid PRs or requests changes with specific feedback

### Submitting a Pull Request

1. **Fork** the repository
2. **Create a branch** — `add/sport-name` or `fix/sport-name-issue`
3. **Add your file** following the HTML template and naming conventions above
4. **Submit the PR** — fill out the pull request template
5. **OpenClaw reviews** — automated review within 30 minutes
6. **Maintainer merges** — a human maintainer gives final approval

### What Makes a Good Contribution?

- Follows the 8-section structure exactly
- Includes the METADATA comment block with valid JSON
- Contains accurate, factual rules (cite official sources for OFFICIAL sports)
- Uses proper semantic HTML (`<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`)
- Includes the shared stylesheet link and branded footer
- Places the file in the correct directory with proper naming

### Reporting Inaccuracies

If you spot an outdated or incorrect rule, [open an issue](https://github.com/DigiLogicLabs/OpenSourceSports/issues/new?template=incorrect-rules.md) with:
- The sport and section affected
- What the current text says
- What the correct rule is (with source)

### Requesting a New Sport

[Open an issue](https://github.com/DigiLogicLabs/OpenSourceSports/issues/new?template=new-sport-request.md) with:
- Sport name and governing body (if official)
- Category (`Official` or `Custom/Casual` or `Custom/Competitive`)
- Priority and any relevant links

## Versioning

**Official sports** use `YYYY.N` format (e.g., `2026.1`). Rules are updated when governing bodies publish annual changes. Previous versions can be archived in an `archive/` subdirectory.

**Custom sports** use semantic versioning `X.Y.Z`:
- **Major** — Significant rule changes affecting gameplay
- **Minor** — Clarifications or adjustments
- **Patch** — Typo or formatting fixes

## Design

All HTML files share a single stylesheet (`assets/css/opensourcesports.css`) with:
- **Teal/Orange/Navy** color palette aligned with the [Digi Logic Labs](https://digilogiclabs.com) design system
- [Manrope](https://fonts.google.com/specimen/Manrope) font family
- Responsive layout (mobile-first, max-width 880px)
- Dark mode support via `prefers-color-scheme`
- Collapsible table of contents with anchor navigation
- Per-section "Back to Contents" links
- Print-optimized styles
- Section highlighting on anchor navigation (`:target`)

## Automation

This repository is maintained by **OpenClaw** — Digi Logic Labs' AI-powered automation platform.

| Process | Schedule | What It Does |
|---------|----------|-------------|
| **OSSAgent** | Daily 10am | Adds 1 sport/day from a 52-entry queue via Claude CLI |
| **PR Reviewer** | Every 30 min | Reviews open PRs: validates structure, checks rules accuracy, approves or requests changes |

The automation is transparent — every commit is tagged with its action type (`[OFFICIAL]`, `[CUSTOM]`, `[STYLE]`, `[REFINE]`, `[UPDATE]`, `[BRAND]`) and attributed to the automation pipeline.

## License

MIT License — see [LICENSE](LICENSE) for details.

You are free to fork, modify, and use this repository for any purpose. Contributions to this official repository must follow the PR process above.

---

Maintained by [Digi Logic Labs](https://digilogiclabs.com) — *A Workshop for Digital Craftsmanship*
