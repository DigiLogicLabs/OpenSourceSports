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

Required at the top of `<body>`. Two valid shapes — **prefer the rich shape**
for new entries; the legacy shape stays accepted for older files.

**Rich shape (preferred for new entries):**

```html
<!--
METADATA
{
  "sport_name": "Basketball (WNBA)",
  "category": "Team Sports",
  "type": "official",
  "organization": "WNBA",
  "base_sport": "Basketball",
  "source_name": "Official Rules of the WNBA",
  "source_url": "https://www.wnba.com/wnba-rule-book",
  "version_label": "2025 Official WNBA Rule Book",
  "effective_date": "2025-01-01",
  "last_verified_at": "2026-05-10",
  "confidence": 0.95,
  "season": "summer",
  "location": "indoor",
  "vibe": "competitive",
  "time_estimate": "long",
  "tags": ["basketball", "wnba", "professional", "official"]
}
-->
```

**Legacy shape (still accepted):**

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
| `sport_name` (or legacy `sport`) | Yes | Full sport name. Drives the slug — see "Slug Generation" below. |
| `category` | Yes | Parent category (e.g., "Team Sports", "Combat Sports") |
| `type` | Yes | `official` / `custom` (rich) or `OFFICIAL` / `CUSTOM` (legacy — both accepted) |
| `organization` (or legacy `governingBody`) | Yes | Governing body name or abbreviation (empty string for custom) |
| `base_sport` | Rarely | Almost always unnecessary — the parser auto-infers `baseSport` from the directory name once the directory has multiple files (see "Variant Linkage" below). Declare explicitly only for the rare cross-dir grouping case. |
| `source_name` | Recommended | Name of the official document being cited (e.g. `"NBA Official Rules 2025-2026"`) |
| `source_url` | Recommended | Direct URL to the official rulebook/regulations PDF or page (NOT the org homepage) |
| `version_label` | Recommended | Human label for the rulebook edition (e.g. `"2026 NTT INDYCAR SERIES Rulebook"`) |
| `effective_date` | Recommended | ISO date `YYYY-MM-DD` — when this version became effective |
| `last_verified_at` | Recommended | ISO date `YYYY-MM-DD` — when a contributor last cross-checked the content against the source |
| `confidence` | Recommended | `0.0`–`1.0` — contributor's confidence in completeness/accuracy |
| `version` (legacy) | Yes if legacy shape | `YYYY.N` for official, `X.Y.Z` for custom — superseded by `version_label` + `effective_date` in rich shape |
| `lastUpdated` (legacy) | Yes if legacy shape | ISO date `YYYY-MM-DD` — superseded by `last_verified_at` |
| `author` | Yes | `OpenSourceSports` or contributor name |
| `tags` | Yes | Array of searchable tags |
| `season` | No | `spring`, `summer`, `fall`, `winter`, or `all` (year-round). Inferred from category if omitted. |
| `location` | No | `indoor`, `outdoor`, or `both`. Used by Game Finder. |
| `vibe` | No | `chill`, `competitive`, `party`, or `athletic`. Used by Game Finder to match games to player mood. |
| `time_estimate` | No | `quick` (<15m), `medium` (15–60m), or `long` (60m+). Used by Game Finder to match games to a time budget. |

> **Game Finder fields.** `vibe`, `time_estimate`, `location`, and `season` power the `/play` Game Finder on opensourcesports.io. They're optional — sports without them still render and still appear in search/browse, they just won't surface to filtered Game Finder results. If you're adding a new sport and the values are obvious, please include them.

> **Provenance fields.** `source_name`, `source_url`, `version_label`,
> `effective_date`, `last_verified_at`, and `confidence` show up on the
> public sport page as a trust signal so readers can verify the rulebook
> against its source. If you can fill them, please do.

### Relative Asset Paths

Compute relative paths based on your file's depth from the repo root:

| File Location | Relative Prefix |
|--------------|----------------|
| `Official/Team Sports/Football/NFL_Official_Rulebook.html` | `../../../` |
| `Custom/Casual/party-games/beerpong/beerpong-rules.html` | `../../../../` |

---

## Categorization, Slugs & Variant Linkage

This section covers three closely-related conventions that affect how your
entry shows up on opensourcesports.io. Following them keeps the corpus
internally consistent and prevents the most common contribution mistakes.

### Categorization (top-level categories)

Every Official entry sits under one top-level category. Pick the right one
the first time — moving an entry later is possible but cumbersome.

**Active categories (use these for almost everything):**

`Combat Sports`, `Esports`, `Individual Sports`, `Motor Sports`,
`Racquet Sports`, `Team Sports`, `Water Sports`, `Winter Sports`,
`Equestrian`.

**Pre-staged for promotion** (these have site styling already; the first
non-trivial entry to land under one promotes it to "active"):
`Athletics`, `Aquatics`, `Cycling`, `Gymnastics`, `Precision Sports`.

**Common edge cases:**

- A sport sometimes lives in two categories on Wikipedia (e.g. ice hockey).
  Use the category that matches the rulebook's most authoritative
  governing body (IIHF rules → `Winter Sports`; NHL rules → `Team Sports`).
- Combined collegiate events (e.g. NCAA Swimming and Diving) split into
  two entries that mirror existing single-sport directories rather than
  inventing a combined directory.
- Western horse sports, racing, polo, and rodeo all sit under `Equestrian`
  — not `Individual Sports` or `Team Sports`.

### Slug Generation

Slugs are generated automatically from `sport_name + organization`. The
exact algorithm:

1. If the lowercased sport_name already contains the lowercased
   organization, use sport_name alone. Otherwise concatenate them with a
   dash.
2. Lowercase everything.
3. Replace every run of non-alphanumeric characters with a single dash
   via `/[^a-z0-9]+/g`.
4. Trim leading/trailing dashes.

**Examples:**

| sport_name | organization | Slug |
|---|---|---|
| `Football` | `NFL` | `football-nfl` |
| `Basketball (WNBA)` | `WNBA` | `basketball-wnba` |
| `Golf` | `R&A` | `golf-r-a` |
| `KPMG Women's PGA Championship` | `PGA of America` | `kpmg-women-s-pga-championship-pga-of-america` |
| `Beer Pong` | (empty) | `beer-pong` |

**Common mistake:** the apostrophe in `Women's` becomes a dash
(`women-s`), NOT removed. Same for `&`, parens, dots, slashes — they all
collapse to dashes. Mentally round-trip your sport_name through the regex
before committing; if the slug isn't what you expect, rename the
sport_name.

**Slugs are permanent.** Once a sport row exists in production, changing
the slug breaks URLs, favorites, page-view tracking, and any external
links. Renaming a sport requires explicit maintainer coordination.

### NCAA Naming Convention

Two valid patterns exist in the corpus, picked by what's needed for slug
clarity:

**Plain (default — match in-dir precedent):**
`sport_name: "<Sport>"` + `organization: "NCAA"` →
slug `<sport>-ncaa`. Use this when there's no in-dir name clash.
Examples: `sport_name: "Baseball"` + org `NCAA` → slug `baseball-ncaa`
(matches MLB's plain pattern in the same dir);
`sport_name: "Softball"` + org `NCAA` → slug `softball-ncaa`.

**Parens (use only when needed for disambiguation):**
- The NCAA rulebook diverges meaningfully from the international/pro
  body's rules in the same directory (e.g. NCAA folkstyle wrestling vs
  UWW freestyle — both share the Wrestling/ dir but represent different
  rule sets).
- Multiple NCAA variants need to coexist under the same directory and
  would otherwise collide on the same slug (e.g. `Basketball (NCAA Men)`
  + `Basketball (NCAA Women)` to produce `basketball-ncaa-men` and
  `basketball-ncaa-women`).
- Variants stack: `Track and Field (NCAA Indoor)` →
  `track-and-field-ncaa-indoor`.

The two existing parens NCAA entries (`american-football-ncaa` and
`wrestling-ncaa-folkstyle`) are precedent and stay as-is — do NOT
rename them.

### Variant Linkage (`base_sport`)

The parser groups sibling rulebooks in the same directory automatically
— `baseSport` is auto-inferred from the directory name whenever a
directory has multiple files. So Boxing's WBA / WBC / WBO / IBF cluster,
Football's NFL / NCAA / CFL, and Basketball's NBA / FIBA / WNBA all get
the right `baseSport` value without any METADATA work.

**You almost never need to declare `base_sport` explicitly.** Just place
your file under the right sport directory and the linkage happens
automatically.

**Declare an explicit `base_sport` only when** the variant lives in a
single-file directory but should still group with siblings elsewhere.
This is rare — most cross-dir grouping is handled by the top-level
category instead.

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

Every sport directory must contain a `metadata.json` describing the sport
itself (NOT a single rulebook — sport directories may contain multiple
rulebook HTMLs, one per governing body):

```json
{
  "name": "Basketball",
  "category": "Team Sports",
  "type": "OFFICIAL",
  "description": "Basketball, a fast-paced team sport played with a round ball on a rectangular court with elevated hoops at each end",
  "governing_bodies": ["NBA", "FIBA", "WNBA"],
  "tags": ["basketball", "team-sport", "indoor", "olympic"],
  "files": [
    "NBA_Official_Rulebook.html",
    "FIBA_Official_Rules.html",
    "WNBA_Official_Rulebook.html"
  ],
  "created_at": "2026-03-04T00:00:00Z",
  "created_by": "OpenSourceSports"
}
```

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Sport name (e.g. `"Basketball"`) |
| `category` | Yes | Top-level category (see "Categorization Conventions" below) |
| `type` | Yes | `OFFICIAL` or `CUSTOM` |
| `description` | Recommended | One-sentence summary of the sport |
| `governing_bodies` | Yes | Array of EVERY governing body whose rulebook lives in this directory |
| `tags` | Recommended | Array of searchable tags |
| `files` | Yes | Array of EVERY rulebook HTML in this directory |
| `created_at` | Yes | ISO timestamp `YYYY-MM-DDTHH:MM:SSZ` |
| `created_by` | Recommended | `"OpenSourceSports"` or contributor name |

**When adding a NEW rulebook to an EXISTING sport directory** (e.g. adding
`WNBA_Official_Rulebook.html` to the existing `Basketball/` directory):

1. Add the new file under the existing directory.
2. Update the directory's `metadata.json` to add the new org to
   `governing_bodies` and the new file to `files`. Keep `name`,
   `category`, `description`, `created_at`, and `created_by` unchanged.
3. The sync will treat the new file as a separate sport row (own slug
   from sport_name + org); the directory listing groups them together.

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
[OFFICIAL] add: Basketball (WNBA) — variant under existing Basketball/, base_sport linked
[OFFICIAL] add: Softball (NCAA) — first softball entry, IS the base
[OFFICIAL] add: Thoroughbred Racing (HISA) — first non-FEI Equestrian entry
[CUSTOM]   add: Spikeball — full rulebook with 8 sections
[UPDATE]   2025-2026 rule updates for NFL
[FIX]      correct NBA three-point line distance (Rule 1, Section II)
[STYLE]    upgrade: Sport (Org) — add stylesheet + branding
[REFINE]   convert: Sport (Org) — convert to structured HTML
```

**For variant adds**, mention the `base_sport` linkage in the message so
the PR reviewer can confirm it's wired up correctly. For the first entry
under a previously-empty pre-staged category (Equestrian, Athletics,
Aquatics, Cycling, Gymnastics, Precision Sports), call it out so the
reviewer can verify cross-app styling work has landed.

---

## Common Mistakes

Most rejected PRs fail one of these checks. Skim before submitting.

1. **Slug doesn't round-trip.** Predicted slug doesn't match what
   `generateSlug` produces. Apostrophes, parens, `&`, slashes, and dots
   collapse to dashes — see "Slug Generation" above. Worked example:
   `KPMG Women's PGA Championship` becomes
   `kpmg-women-s-pga-championship-...`, not `kpmg-womens-...`.
2. **Sport name doesn't match the in-dir precedent.** Most existing
   directories use plain `sport_name` (e.g. `"Basketball"`, `"Baseball"`,
   `"Golf"`) with the org as a separate field. Don't introduce a parens
   form (e.g. `"Basketball (WNBA)"`) when the dir's other entries use
   plain — match what's already there. Parens are only needed when slugs
   would otherwise collide (see NCAA Naming Convention above).
3. **Parent `metadata.json` not updated.** Adding a new rulebook to an
   existing sport directory? The directory's `metadata.json` must list
   the new file in `files` and the new org in `governing_bodies`. Two
   commits touching only the HTML file will fail validation.
4. **NCAA naming wrong.** Use the parens form
   (`Sport (NCAA)` / `Sport (NCAA <Variant>)`), not
   `NCAA <Sport>`.
5. **`source_url` points to a homepage.** It must point to the actual
   rulebook PDF or rule-index page — not `https://example-org.com/`.
6. **Section IDs misspelled.** All 8 IDs must match exactly:
   `introduction`, `equipment`, `playing-area`, `players-officials`,
   `rules-of-play`, `scoring`, `violations-penalties`,
   `safety-considerations`. No alternative spellings; the validator is
   case-sensitive.
7. **METADATA JSON is invalid.** Parse it locally before committing — a
   single trailing comma silently breaks the entire metadata block and
   the entry inherits defaults.
8. **Promoting a pre-staged category but skipping the lockstep work.**
   When you add the first entry under `Athletics` / `Aquatics` /
   `Cycling` / `Gymnastics` / `Precision Sports`, also confirm the OSS
   web app already has the icon/color mapping (it does, for the
   pre-staged ones) — but for any TRULY new category, the styling has
   to land in the app first or the category will render with default
   gray styling.

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
