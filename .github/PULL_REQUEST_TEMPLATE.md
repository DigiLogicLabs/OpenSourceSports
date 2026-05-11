## Summary

<!-- Brief description of what this PR adds or changes -->

## Sport Details

- **sport_name (METADATA):**
- **Organization:**
- **Predicted slug:** <!-- mentally apply generateSlug — apostrophes/&/parens collapse to dashes -->
- **Category:**
- **base_sport (if variant):**
- **Source URL:** <!-- direct link to the rulebook PDF/page, NOT the org homepage -->
- **Type:** New sport / Variant of existing / Rule update / Style upgrade

## Structural Checklist

- [ ] HTML file follows the 8-section structure (introduction, equipment, playing-area, players-officials, rules-of-play, scoring, violations-penalties, safety-considerations)
- [ ] `<!-- METADATA { ... } -->` comment block is present with valid JSON (parsed locally — no trailing commas)
- [ ] File includes `<link>` to shared stylesheet (`assets/css/opensourcesports.css`)
- [ ] Branded footer with OpenSourceSports copyright is present
- [ ] File naming follows convention: `Organization_Rulebook_Type.html`
- [ ] No broken links or missing closing tags

## Metadata & Linkage Checklist

- [ ] `sport_name` round-trips through `generateSlug` to the predicted slug above
- [ ] If this is a tournament/championship/league/series companion to an existing ruleset, `base_sport` is set to the canonical sport name
- [ ] If the entry is NCAA, `sport_name` follows the locked parens form (`Sport (NCAA)` or `Sport (NCAA <Variant>)`)
- [ ] `source_url` points to the actual rulebook PDF or rule-index page (NOT a homepage)
- [ ] `source_name`, `version_label`, `effective_date`, `last_verified_at`, and `confidence` are populated where known

## metadata.json

- [ ] Sport directory has a `metadata.json` (NEW directory) **OR** the existing `metadata.json` was updated to add the new file to `files` and the new org to `governing_bodies` (EXISTING directory)

## Accuracy

- [ ] Content is factually accurate (rules match the governing body's official rulebook)
- [ ] Specific rule numbers / articles / sections are cited in prose
- [ ] No long copied passages — paraphrased and cited
