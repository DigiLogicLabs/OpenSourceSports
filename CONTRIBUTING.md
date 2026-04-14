# Contributing to OpenSourceSports

Thank you for your interest in contributing! OpenSourceSports is maintained by [OpenClaw](https://digilogiclabs.com) (Digi Logic Labs' AI-powered automation) and welcomes community contributions.

---

## How This Repo Works

| Process | Schedule | What It Does |
|---------|----------|-------------|
| **OSSAgent** | Daily 10am | Adds 1 sport/day from a curated queue via Claude CLI |
| **PR Reviewer** | Every 30 min | Reviews open PRs: validates structure, checks rule accuracy, approves or requests changes |

Every automated commit is tagged with its action type (`[OFFICIAL]`, `[CUSTOM]`, `[STYLE]`, `[REFINE]`, `[UPDATE]`, `[BRAND]`) and attributed to the automation pipeline.

---

## Contribution Types

### 1. Add a New Sport

Create a new HTML rulebook following the standards below and submit a pull request.

### 2. Fix Rule Inaccuracies

If you spot an outdated or incorrect rule, either:
- [Open an issue](https://github.com/DigiLogicLabs/OpenSourceSports/issues/new?template=incorrect-rules.md) with the correct rule and a source
- Submit a PR with the fix and cite the official source

### 3. Request a New Sport

[Open an issue](https://github.com/DigiLogicLabs/OpenSourceSports/issues/new?template=new-sport-request.md) with the sport name, governing body, and category.

---

## Accuracy Standards

**This is the most important part of contributing.** We are strict on accuracy, especially for officially governed sports.

### Official Sports (REQUIRED)

- **Source from the latest official published rulebook** of the governing body (current season edition)
- **Cite specific rule numbers**, articles, or sections (e.g., "Rule 5, Section II, Article a" or "Law 11.1")
- **Name the official document** being referenced (e.g., "NBA Official Rules 2025-2026", "FIFA Laws of the Game 2025/26")
- **Include exact measurements** and specifications (metric AND imperial where applicable)
- **Use the governing body's official terminology** and definitions
- **Note recent rule changes** with effective dates when applicable
- **Do NOT fabricate or approximate rules** — if you're unsure about a specific detail, omit it rather than guessing
- **Fewer correct rules are better than many inaccurate ones**

### Custom Sports

- Write clear, fun rules suitable for casual or competitive play
- Include common house rules and variations where relevant
- Be consistent and unambiguous in rule descriptions

---

## HTML File Standards

Every rulebook must follow a consistent structure. The PR reviewer validates these automatically.

### Required 8-Section Structure

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

### Structural Requirements (9 automated checks)

Your PR will be automatically validated for:

1. **8 required sections** — All section IDs must be present (`introduction`, `equipment`, `playing-area`, `players-officials`, `rules-of-play`, `scoring`, `violations-penalties`, `safety-considerations`)
2. **METADATA comment block** — Valid JSON inside `<!-- METADATA { ... } -->` at the top of `<body>`
3. **Closing tags** — `</html>` and `</body>` must be present
4. **Stylesheet link** — `<link>` to `assets/css/opensourcesports.css` (relative path)
5. **Favicon link** — `<link>` to `assets/images/favicon.ico` (relative path)
6. **Header logo** — `<img>` with class `oss-header-logo` referencing `assets/images/logo.png`
7. **Table of Contents** — `<nav>` with class `oss-toc` containing links to all 8 sections
8. **Branded footer** — `<a>` with class `oss-footer-brand` linking to digilogiclabs.com
9. **File naming convention** — See naming conventions below

Each section must end with a back-to-contents link:
```html
<div class="oss-section-foot">
  <a href="#toc" class="oss-back-top">Back to Contents</a>
</div>
```

### METADATA Comment Block

Required at the top of `<body>`:

```html
<!--
METADATA
{
  "sport": "Basketball",
  "category": "Team Sports",
  "type": "OFFICIAL",
  "governingBody": "NBA",
  "version": "2026.1",
  "lastUpdated": "2026-03-04",
  "author": "OpenSourceSports",
  "tags": ["basketball", "nba", "team-sport"]
}
-->
```

| Field | Required | Description |
|-------|----------|-------------|
| `sport` | Yes | Full sport name |
| `category` | Yes | Parent category (e.g., "Team Sports", "Combat Sports") |
| `type` | Yes | `OFFICIAL` or `CUSTOM` |
| `governingBody` | Yes | Organization abbreviation (empty string for custom) |
| `version` | Yes | `YYYY.N` for official, `X.Y.Z` for custom |
| `lastUpdated` | Yes | ISO date `YYYY-MM-DD` |
| `author` | Yes | `OpenSourceSports` or contributor name |
| `tags` | Yes | Array of searchable tags |
| `season` | No | `spring`, `summer`, `fall`, `winter`, or `all` (year-round). Inferred from category if omitted. |
| `location` | No | `indoor`, `outdoor`, or `both`. Used by Game Finder. |
| `vibe` | No | `chill`, `competitive`, `party`, or `athletic`. Used by Game Finder to match games to player mood. |
| `time_estimate` | No | `quick` (<15m), `medium` (15–60m), or `long` (60m+). Used by Game Finder to match games to a time budget. |

> **Game Finder fields.** `vibe`, `time_estimate`, `location`, and `season` power the `/play` Game Finder on opensourcesports.io. They're optional — sports without them still render and still appear in search/browse, they just won't surface to filtered Game Finder results. If you're adding a new sport and the values are obvious, please include them.

### Relative Asset Paths

Compute relative paths based on your file's depth from the repo root:

| File Location | Relative Prefix |
|--------------|----------------|
| `Official/Team Sports/Football/NFL_Official_Rulebook.html` | `../../../` |
| `Custom/Casual/party-games/beerpong/beerpong-rules.html` | `../../../../` |

---

## Directory & Naming Conventions

### Directories

| Type | Convention | Examples |
|------|-----------|----------|
| Official categories | Title Case with spaces | `Team Sports`, `Combat Sports`, `Racquet Sports` |
| Official sport dirs | Title Case with spaces | `Football`, `Boxing`, `Basketball` |
| Custom categories | lowercase-kebab | `party-games`, `ball-games`, `playground-games` |
| Custom sport dirs | lowercase-kebab | `beerpong`, `thumb-wrestling`, `hide-and-seek` |

### Files

| Type | Pattern | Examples |
|------|---------|----------|
| Official | `[Org]_[RuleType].html` | `NFL_Official_Rulebook.html`, `FIFA_Laws_of_Game.html` |
| Custom | `[sport]-rules.html` | `beerpong-rules.html`, `end-zone-exchange-rules.html` |
| Archived | `[Org]_[RuleType]_[Year].html` | `NFL_Official_Rulebook_2025.html` |

### metadata.json

Every sport directory must contain a `metadata.json`:

```json
{
  "sport": "Basketball",
  "organization": "NBA",
  "category": "Team Sports",
  "type": "OFFICIAL",
  "files": ["NBA_Official_Rulebook.html"],
  "created_at": "2026-03-04T00:00:00Z"
}
```

---

## Submitting a Pull Request

1. **Fork** the repository
2. **Create a branch** — `add/sport-name` or `fix/sport-name-issue`
3. **Add your file** following the HTML standards and naming conventions above
4. **Include a `metadata.json`** in the sport directory
5. **Submit the PR** — fill out the [pull request template](.github/PULL_REQUEST_TEMPLATE.md)
6. **OpenClaw reviews** — automated review within 30 minutes (9 structural checks + AI content review)
7. **Maintainer merges** — a human maintainer gives final approval

### Branch Naming

```
add/basketball-nba        # New official sport
add/spikeball              # New custom sport
fix/nfl-scoring-rules      # Rule correction
update/fifa-2026-changes   # Annual rule update
style/improve-formatting   # Styling or formatting
```

### Commit Messages

```
[OFFICIAL] add: Basketball (NBA) — full rulebook with 8 sections
[CUSTOM]   add: Spikeball — full rulebook with 8 sections
[UPDATE]   2025-2026 rule updates for NFL
[FIX]      correct NBA three-point line distance (Rule 1, Section II)
[STYLE]    upgrade: Sport (Org) — add stylesheet + branding
[REFINE]   convert: Sport (Org) — convert to structured HTML
```

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Prioritize accuracy and cite sources
- Follow the established conventions
- Collaborate positively

---

## Questions?

- [Open an issue](https://github.com/DigiLogicLabs/OpenSourceSports/issues) for questions or suggestions
- Check the [README](README.md) for repo structure and design details

---

Maintained by [Digi Logic Labs](https://digilogiclabs.com) — *A Workshop for Digital Craftsmanship*
