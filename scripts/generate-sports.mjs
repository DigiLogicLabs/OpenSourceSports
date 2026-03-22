#!/usr/bin/env node
/**
 * Batch generator for Olympic sport HTML rulebooks.
 * Creates directory structure, HTML files, and metadata.json for each sport.
 * Run: node scripts/generate-sports.mjs
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const TODAY = '2026-03-20';
const TODAY_DISPLAY = 'March 20, 2026';

// ═══════════════════════════════════════════════════════════════
// SPORT DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const SPORTS = [
  // ── Winter Sports (15) ─────────────────────────────────────
  {
    name: 'Alpine Skiing', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Alpine_Skiing_Rules.html',
    tags: ['olympic','professional','alpine skiing','fis','slalom','downhill','giant slalom','super-g'],
    intro: `Alpine skiing is one of the original winter Olympic disciplines, contested since the 1936 Garmisch-Partenkirchen Games. The Fédération Internationale de Ski et de Snowboard (FIS) governs the sport under the <strong>International Competition Rules (ICR), Book IV — Alpine Skiing</strong>, updated annually. Alpine skiing comprises five individual events — Downhill (DH), Super-G (SG), Giant Slalom (GS), Slalom (SL), and Alpine Combined — plus the Team Event introduced at the 2018 PyeongChang Olympics.`,
    equipment: { items: [
      { name: 'Skis', spec: 'Minimum length varies by event: DH/SG men 218 cm (85.8 in), women 210 cm (82.7 in); GS men 193 cm (76 in), women 188 cm (74 in); SL men 165 cm (65 in), women 155 cm (61 in). Minimum radius specified per event (Article 222, ICR).' },
      { name: 'Boots', spec: 'Must not exceed sole length of 43% of body height. Maximum boot sole height 45 mm (1.77 in) at toe, 55 mm (2.17 in) at heel.' },
      { name: 'Helmet', spec: 'FIS-approved helmet mandatory for all events. Must conform to EN 1077 Class A for speed events (DH, SG) and Class A or B for technical events (GS, SL).' },
      { name: 'Poles', spec: 'Must be non-collapsible. Handguards permitted in DH/SG. No aerodynamic attachments allowed.' },
    ]},
    area: { desc: 'Courses are set on natural or prepared snow slopes. Homologation (official course approval) is required for all FIS-sanctioned competitions.', specs: [
      'Downhill: vertical drop 800–1100 m (2625–3609 ft) for men, 500–800 m (1640–2625 ft) for women',
      'Super-G: vertical drop 400–650 m (1312–2133 ft) for men, 400–600 m (1312–1969 ft) for women',
      'Giant Slalom: vertical drop 300–450 m (984–1476 ft) for men, 300–400 m (984–1312 ft) for women',
      'Slalom: vertical drop 180–220 m (591–722 ft) for men, 140–200 m (459–656 ft) for women',
      'Course width minimum 40 m (131 ft) for DH, 30 m (98 ft) for SG',
    ]},
    players: { desc: 'Individual competition. A competition jury consists of: Technical Delegate (TD), Referee, Assistant Referee, Chief of Race, Start Referee, Finish Referee. Gate judges are positioned throughout the course. Electronic timing is mandatory with precision to 1/100th of a second.' },
    rules: [
      'Competitors must pass through all gates. A gate consists of two poles (turning poles and outside poles). Missing a gate results in a Did Not Finish (DNF) unless the competitor hikes back and passes through the missed gate.',
      'In Slalom, a gate is two poles. In GS, a gate is two pairs of poles (4 poles total). The competitor must pass with both ski tips and both feet around the turning pole.',
      'Start intervals vary by event: DH/SG typically 60 seconds, GS 60 seconds, SL variable. Competitors start in bib order, determined by FIS points ranking.',
      'Two runs are contested in SL and GS. One run in DH and SG. Combined consists of one DH/SG run + one SL run.',
    ],
    scoring: 'Times are measured electronically to 1/100th of a second. Rankings determined by total time (sum of runs for two-run events). FIS points are calculated using the formula: P = (Tx / T0 - 1) × F, where Tx is competitor time, T0 is winner time, and F is a discipline-specific factor.',
    violations: [
      'Straddling a gate (not passing correctly): DSQ (Disqualification)',
      'Missing a gate: DNF unless corrected by hiking',
      'False start: may be recalled; second false start results in DSQ',
      'Using artificial aids or receiving outside assistance: DSQ',
      'Equipment violations (ski length, suit permeability >30 l/m²/s): DSQ',
    ],
    safety: 'Safety netting (A-net, B-net) is installed along course edges. Airbag systems are deployed at high-risk sections. FIS mandates minimum course inspection time. Competitions may be delayed or cancelled due to weather (visibility, wind exceeding 8 m/s at exposed sections). All competitors must wear back protectors in DH and SG.',
  },
  {
    name: 'Cross-Country Skiing', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Cross_Country_Rules.html',
    tags: ['olympic','professional','cross-country skiing','fis','nordic','xc skiing'],
    intro: `Cross-country skiing is one of the founding Olympic winter sports, contested at every Winter Games since 1924. Governed by FIS under <strong>ICR Book II — Cross-Country Skiing</strong>, the discipline features two distinct techniques: Classic (diagonal stride, restricted to set tracks) and Free (skating technique, unrestricted). Olympic events include individual distances (10 km, 15 km, 30 km, 50 km), Sprint (1.2–1.8 km), Team Sprint, Relay (4×5 km women, 4×10 km men), and Skiathlon (combined classic + free).`,
    equipment: { items: [
      { name: 'Skis', spec: 'Classic skis: minimum length = competitor height minus 20 cm. Skating skis: minimum length = competitor height minus 10 cm. Maximum ski width 48 mm (1.89 in) for classic, no maximum for skating. Fluorocarbon wax banned since 2023-2024 season (Article 343.10, ICR).' },
      { name: 'Boots', spec: 'Must be commercially available. Boot-binding system must be FIS-approved.' },
      { name: 'Poles', spec: 'Classic: maximum pole length = 83% of body height. Skating: maximum pole length = 100% of body height. Baskets must not exceed 100 cm² (15.5 in²).' },
    ]},
    area: { desc: 'Competition courses must be homologated by FIS. Courses should include approximately 1/3 uphill, 1/3 flat, and 1/3 downhill terrain.', specs: [
      'Sprint courses: 1.0–1.8 km with total climb 30–60 m (98–197 ft)',
      '10 km courses: total climb 250–420 m (820–1378 ft), maximum climb 50–80 m (164–262 ft)',
      '50 km courses: total climb 1400–2000 m (4593–6562 ft)',
      'Minimum track width 3 m (9.8 ft) for classic, 6 m (19.7 ft) for free technique',
      'Stadium area must accommodate start, finish, penalty loop, and warm-up area',
    ]},
    players: { desc: 'Individual and team events. Competition jury: Technical Delegate, Chief of Competition, Competition Secretary. Track control personnel stationed every 500 m. Official timekeeping to 1/10th second for distance races, 1/100th for sprints.' },
    rules: [
      'Classic technique: skating movements prohibited. Both skis must remain in set tracks on uphills and flats. Herringbone and snowplow permitted on uphills. Violations detected by technique controllers result in warnings or time penalties.',
      'Free technique: any technique permitted including skating. No track restrictions.',
      'Interval start races: 30-second intervals standard. Mass start races: all competitors start simultaneously.',
      'Skiathlon: first half classic technique, second half free technique. Ski change in transition zone, maximum 15 seconds transition time.',
      'Relay: exchange zones are 30 m long. Body contact (tag) required for valid exchange.',
    ],
    scoring: 'Distance events timed to 1/10th of a second. Sprint events timed to 1/100th. FIS points calculated similarly to alpine skiing. Sprint qualification determines top 30 for heats. Sprint heats: quarterfinals (5 heats of 6), semifinals (2 heats of 6), final (6 competitors).',
    violations: [
      'Technique violation in classic race: first offense oral warning, second 5-minute time penalty, third DSQ',
      'Obstructing another competitor: time penalty or DSQ depending on severity',
      'Receiving unauthorized assistance: DSQ',
      'Fluorocarbon wax detection: DSQ and equipment confiscation',
    ],
    safety: 'Course markings with directional arrows mandatory. Emergency vehicles must have access to all course sections. Competitions cancelled if temperature drops below -20°C (-4°F) at the coldest point. Wind chill equivalent of -25°C (-13°F) also triggers cancellation.',
  },
  {
    name: 'Ski Jumping', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Ski_Jumping_Rules.html',
    tags: ['olympic','professional','ski jumping','fis','nordic'],
    intro: `Ski jumping has been an Olympic event since the inaugural 1924 Winter Games (men), with women's ski jumping added at Sochi 2014. Governed by FIS under <strong>ICR Book III — Ski Jumping</strong>, athletes launch from purpose-built hills and are judged on both distance and style. Olympic events include Individual Normal Hill (HS 98–109), Individual Large Hill (HS 127–145), Large Hill Team, and Mixed Team. The sport underwent significant equipment reform in the 2010s, including body mass index (BMI) requirements linking ski length to body weight.`,
    equipment: { items: [
      { name: 'Skis', spec: 'Maximum length 145% of body height, with BMI-linked adjustments. Skis must be flat (no concave/convex surfaces). Width: 105–118 mm (4.1–4.6 in) at the binding. Weight minimum 4 kg (8.8 lb) per pair.' },
      { name: 'Suit', spec: 'Maximum material thickness 6 mm (0.24 in). Maximum air permeability 40 l/m²/s (±5). No aerodynamic aids. Suit must fit body contour — maximum tolerance 2 cm (0.79 in) from body at any measured point (Article 426, ICR).' },
      { name: 'Helmet', spec: 'Mandatory FIS-approved helmet. Smooth surface, no aerodynamic modifications.' },
      { name: 'Boots', spec: 'Maximum boot height 30 cm (11.8 in). Must allow forward lean angle of binding.' },
    ]},
    area: { desc: 'Competition takes place on homologated FIS hills classified by Hill Size (HS).', specs: [
      'Normal Hill: HS 98–109 (K-point typically 90 m / 295 ft)',
      'Large Hill: HS 127–145 (K-point typically 120 m / 394 ft)',
      'Ski Flying Hill: HS 185–240+ (K-point typically 200 m / 656 ft)',
      'Inrun track length 80–120 m (262–394 ft), gradient 33–38 degrees',
      'Landing slope gradient 33–37 degrees at K-point',
      'Outrun minimum 100 m (328 ft) of flat or uphill deceleration zone',
    ]},
    players: { desc: 'Individual competitors or teams of 4. Judges panel: 5 style judges (highest and lowest marks discarded, 3 counting). Wind and gate judges monitor conditions. Jump measurement by video distance measurement system.' },
    rules: [
      'Competitors take off from the in-run, maintaining aerodynamic position. The gate (starting position) is adjusted by the jury based on wind and weather conditions.',
      'V-style flight position is standard: ski tips spread apart at 25–35 degrees. Body forward lean creates lift.',
      'Landing must be in telemark position (one ski ahead of the other) for maximum style points. Both feet landing simultaneously (two-footed landing) receives lower style marks.',
      'Wind and gate compensation system: points added or deducted based on wind advantage/disadvantage and gate changes during competition (introduced 2010-2011 season).',
      'Team event: 4 jumpers per team, each jumps twice. Total points determine team ranking.',
    ],
    scoring: 'Total score = Distance Points + Style Points + Gate/Wind Compensation. Distance points: 60 points at K-point; 1.8 points per metre (NH) or 1.2 points per metre (LH) above/below K-point. Style points: each judge awards 0–20 points. Gate compensation: points adjusted for gate changes. Wind compensation: points adjusted based on real-time wind measurements.',
    violations: [
      'Equipment non-compliance (suit thickness, ski length vs BMI): DSQ',
      'Touching snow with hands during landing: deduction in style points',
      'Fall on landing: significant style deductions (typically 7+ points per judge)',
      'Failure to cross the fall line: jump not measured',
    ],
    safety: 'Wind limits for competition: maximum 4 m/s (8.9 mph) tailwind, wind direction changes require competition pause. Hill profile must include safety zones. Landing slope maintained with specific snow preparation standards. Medical team on standby with ambulance access to outrun.',
  },
  {
    name: 'Freestyle Skiing', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Freestyle_Skiing_Rules.html',
    tags: ['olympic','professional','freestyle skiing','fis','moguls','aerials','halfpipe','slopestyle','ski cross'],
    intro: `Freestyle skiing encompasses multiple acrobatic ski disciplines governed by FIS under <strong>ICR Book V — Freestyle Skiing</strong>. Olympic disciplines include Moguls (since 1992), Aerials (since 1994), Ski Cross (since 2010), Ski Halfpipe (since 2014), and Ski Slopestyle (since 2014). The sport combines technical skiing ability with acrobatic performance, judged on criteria including turns, air, speed, amplitude, difficulty, and execution depending on the discipline.`,
    equipment: { items: [
      { name: 'Skis', spec: 'Moguls: minimum 180 cm (70.9 in) men, 170 cm (66.9 in) women. Slopestyle/Halfpipe: minimum 160 cm (63 in). Aerials: minimum 160 cm (63 in). All skis must have functioning release bindings.' },
      { name: 'Helmet', spec: 'FIS-approved helmet mandatory in all disciplines. Must conform to EN 1077 or equivalent.' },
      { name: 'Back Protector', spec: 'Recommended for all disciplines, mandatory for Aerials, Ski Cross, and Halfpipe.' },
      { name: 'Poles', spec: 'Mandatory for Moguls. Optional for other disciplines. Must not have sharp points exposed.' },
    ]},
    area: { desc: 'Each discipline uses specifically designed competition venues.', specs: [
      'Moguls course: length 220–270 m (722–886 ft), width minimum 18 m (59 ft), gradient 26–32 degrees, with 2 air sites',
      'Aerials: jumping hill with water ramp for training. Competition kickers at 2.0 m, 3.2 m, and 3.8 m (6.6, 10.5, 12.5 ft) table heights',
      'Halfpipe: minimum 150 m (492 ft) length, 19–22 m (62–72 ft) width, wall height 6.0–7.0 m (19.7–23.0 ft), gradient 17.5–18.5 degrees',
      'Slopestyle: minimum 400 m (1312 ft) length, 30 m (98 ft) width, with 6–9 features (jumps, rails, boxes)',
      'Ski Cross: course length 800–1200 m (2625–3937 ft) with banked turns, rollers, jumps, vertical drop 130–250 m (427–820 ft)',
    ]},
    players: { desc: 'Moguls and Aerials: individual. Ski Cross: head-to-head racing (4 competitors per heat). Slopestyle and Halfpipe: individual runs. Judging panels vary: 5–7 judges for style-based disciplines, photo finish for Ski Cross.' },
    rules: [
      'Moguls: two runs in qualification, one in final. Scored on turns (60%), air (20%), and speed (20%). Air maneuvers performed on two kicker sites.',
      'Aerials: qualification round (2 jumps, best counts) + finals (2 jumps for semifinal, 1 jump for super final). Scored on air (20%), form (50%), landing (30%), multiplied by degree of difficulty.',
      'Slopestyle: qualification runs (best of 2 counts) + finals (best of 3 counts). Overall impression scoring 0–100 by panel.',
      'Halfpipe: qualification (best of 2) + finals (best of 3). Scored 0–100 on overall impression including amplitude, difficulty, variety, execution, and progression.',
      'Ski Cross: timed qualification determines seedings. Heats of 4 racers, top 2 advance. No intentional contact.',
    ],
    scoring: 'Varies by discipline. Moguls: combined score from turns (max 60), air (max 20), speed (max 20). Aerials: execution scores × degree of difficulty (DD ranges 2.1–5.0+). Slopestyle/Halfpipe: overall impression 0–100. Ski Cross: race placement.',
    violations: [
      'Intentional contact in Ski Cross: yellow card (warning) or red card (DSQ for that heat)',
      'Missing a gate in Ski Cross: DSQ',
      'Unauthorized aerial maneuver (exceeding declared DD in Aerials): scoring adjusted',
      'Equipment non-compliance: DSQ',
    ],
    safety: 'Landing areas prepared with specific snow depth minimums. Airbag landing systems for Aerials training. Course inspections mandatory before each competition. Wind limits specific to each discipline. Medical personnel with stretcher access required at all jump/feature locations.',
  },
  {
    name: 'Snowboard', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Snowboard_Rules.html',
    tags: ['olympic','professional','snowboard','fis','halfpipe','slopestyle','snowboard cross','parallel giant slalom'],
    intro: `Snowboarding became an Olympic sport at the 1998 Nagano Games and is governed by FIS under <strong>ICR Book VI — Snowboard</strong>. Olympic disciplines include Halfpipe, Slopestyle, Snowboard Cross (SBX), Parallel Giant Slalom (PGS), and Big Air. The sport bridges athletic competition with progressive action-sport culture, featuring both judged and timed events. FIS oversees all World Cup, World Championship, and Olympic snowboard competitions.`,
    equipment: { items: [
      { name: 'Snowboard', spec: 'Halfpipe/Slopestyle/Big Air: no minimum length. PGS: minimum 163 cm (64.2 in) men, 153 cm (60.2 in) women. SBX: no minimum. Board must have functional highback bindings or step-in system.' },
      { name: 'Helmet', spec: 'FIS-approved helmet mandatory in all disciplines. Must conform to EN 1077.' },
      { name: 'Back/Impact Protector', spec: 'Strongly recommended; mandatory for Halfpipe and Slopestyle at World Cup level.' },
      { name: 'Wrist Guards', spec: 'Recommended for all athletes. No requirement but strongly suggested especially for Halfpipe.' },
    ]},
    area: { desc: 'Venues are purpose-built or adapted for each discipline.', specs: [
      'Halfpipe: minimum 150 m (492 ft) length, 19–22 m (62–72 ft) width, wall height 6.0–7.0 m (19.7–23 ft)',
      'Slopestyle: minimum 400 m (1312 ft) length, 30 m (98 ft) width, 6–9 features',
      'Snowboard Cross: 1000–1500 m (3281–4921 ft) length, vertical drop 150–250 m (492–820 ft), average gradient 12–22 degrees',
      'PGS: vertical drop 120–200 m (394–656 ft), 20–30 gates, gate offset 10–15 m (33–49 ft)',
      'Big Air: single jump feature, takeoff height 3–5 m (10–16 ft), landing slope gradient 33–38 degrees',
    ]},
    players: { desc: 'Halfpipe, Slopestyle, Big Air: individual runs. SBX: heats of 4–6 riders. PGS: head-to-head elimination bracket. Judging panels of 5–6 judges for style events, electronic timing for race events.' },
    rules: [
      'Halfpipe: qualification (best of 2 runs) + finals (best of 3 runs). Scored 0–100 on overall impression: amplitude, difficulty, variety, execution, progression.',
      'Slopestyle: qualification (best of 2) + finals (best of 3). Overall impression 0–100. Athletes choose their own line through the course features.',
      'Big Air: 3 runs in finals, best 2 count. Must include tricks in different rotational directions across scoring runs.',
      'Snowboard Cross: timed qualification for seedings. Heats of 4 or 6 riders, top 2–3 advance. First to finish wins.',
      'PGS: two runs on parallel courses. Combined time determines advancement in elimination bracket. Courses switched between runs for fairness.',
    ],
    scoring: 'Halfpipe/Slopestyle/Big Air: overall impression 0–100. SBX: placement (first to finish). PGS: combined time from two runs.',
    violations: [
      'Intentional contact in SBX: yellow or red card',
      'Missing a gate in PGS or SBX: DSQ for that run',
      'Dangerous riding causing risk to others: DSQ',
      'Equipment violations: DSQ',
    ],
    safety: 'Landing areas maintained with minimum snow depth standards. Course features inspected before each training and competition session. Wind and visibility limits enforced. Medical team with toboggan access required at all feature locations. Safety nets at high-speed sections of SBX courses.',
  },
  {
    name: 'Figure Skating', org: 'ISU', category: 'Winter Sports',
    file: 'ISU_Figure_Skating_Rules.html',
    tags: ['olympic','professional','figure skating','isu','ice skating','ice dance'],
    intro: `Figure skating has been an Olympic event since the 1908 London Games (Summer Olympics), making it one of the oldest Olympic sports. It became a permanent fixture of the Winter Games from 1924. The International Skating Union (ISU) governs the sport under the <strong>ISU Special Regulations & Technical Rules — Single & Pair Skating and Ice Dance</strong>. Olympic disciplines include Men's Singles, Women's Singles, Pairs, Ice Dance, and the Team Event (introduced 2014). The International Judging System (IJS), implemented in 2004, replaced the former 6.0 system.`,
    equipment: { items: [
      { name: 'Skates', spec: 'Figure skating boots with attached blades. Blade length approximately 28–32 cm (11–12.6 in) depending on boot size. Blade thickness 3–4 mm (0.12–0.16 in). Toe pick required for singles and pairs. Ice dance blades may have shorter tail and smaller toe pick.' },
      { name: 'Costume', spec: 'Must be modest, dignified, and appropriate for athletic competition (Rule 501, ISU). Men must wear full-length trousers. Excessive decoration, props, and accessories that could detach are prohibited. Costumes must not create the illusion of excessive nudity.' },
      { name: 'Music', spec: 'Music with lyrics permitted in all disciplines since 2014-2015 season. Music submitted electronically in advance. Backup CD required at competition.' },
    ]},
    area: { desc: 'Competitions held on regulation ice rinks.', specs: [
      'Ice surface: 56–60 m × 26–30 m (184–197 ft × 85–98 ft)',
      'Preferred Olympic/ISU Championship size: 60 m × 30 m (197 ft × 98 ft)',
      'Ice temperature: -3°C to -5°C (23°F to 27°F)',
      'Corners rounded with radius of 7–8.5 m (23–28 ft)',
      'Boards height approximately 1.17–1.22 m (3.8–4.0 ft)',
    ]},
    players: { desc: 'Singles: individual. Pairs: one man and one woman. Ice Dance: one man and one woman. Team Event: teams of up to 5 entries. Judging panel: Technical Panel (Technical Controller, Technical Specialist, Assistant Technical Specialist) + 9 judges scoring components.' },
    rules: [
      'Singles/Pairs Short Program: maximum 2 minutes 40 seconds. Contains 7 required elements (jumps, spins, step sequences for singles; lifts, throws, death spiral, spins, step sequences for pairs).',
      'Singles/Pairs Free Skating: 4 minutes men/pairs, 4 minutes women (reduced from 4:30 in 2022). Free choice of elements within ISU maximums.',
      'Ice Dance Rhythm Dance: 2 minutes 50 seconds. Includes required pattern dance, set of twizzles, and a step sequence.',
      'Ice Dance Free Dance: 4 minutes. Free composition including lifts, twizzles, spins, step sequences, and choreographic elements.',
      'Jump elements: Toe jumps (Toe Loop, Flip, Lutz), Edge jumps (Salchow, Loop, Axel). Quad jumps (4 revolutions) are standard in men\'s competition.',
    ],
    scoring: 'IJS (International Judging System): Total Score = Technical Element Score (TES) + Program Component Score (PCS) - Deductions. Each element has a Base Value multiplied by Grade of Execution (GOE, -5 to +5). Program Components scored 0–10 in five categories: Skating Skills, Transitions, Performance, Composition, Interpretation. Highest and lowest scores trimmed, remaining averaged.',
    violations: [
      'Time violation (program too long/short by >10 seconds): -1.0 deduction',
      'Fall: -1.0 deduction per fall (singles/pairs), -1.0 per fall (ice dance)',
      'Illegal element (e.g., backflip): element receives zero value',
      'Music violation (inappropriate content): deduction at referee discretion',
      'Costume violation (props, excessive decoration): -1.0 deduction',
    ],
    safety: 'Ice maintenance between groups with Zamboni resurfacing. Warm-up period of 6 minutes per group. Medical team on-site. Pairs: lift height restrictions (no overhead lifts in ice dance). Blade guards required when not on ice surface.',
  },
  {
    name: 'Speed Skating', org: 'ISU', category: 'Winter Sports',
    file: 'ISU_Speed_Skating_Rules.html',
    tags: ['olympic','professional','speed skating','isu','long track'],
    intro: `Long track speed skating has been an Olympic sport since the inaugural 1924 Winter Games (men) and 1960 (women). Governed by the ISU under <strong>ISU Special Regulations Speed Skating and General Regulations</strong>, the sport features individual racing on a 400 m oval. Olympic distances include 500 m, 1000 m, 1500 m, 3000 m (women), 5000 m, 10000 m (men), Team Pursuit, and Mass Start (added 2018). The Netherlands, Norway, and South Korea have traditionally dominated the sport.`,
    equipment: { items: [
      { name: 'Skates', spec: 'Clap skates with hinged blade mechanism permitted since 1998. Blade length 33–50 cm (13–19.7 in). Blade thickness minimum 1.0 mm (0.04 in), maximum 1.3 mm (0.05 in). Blade radius of rocker: 22–28 m for long distances, 21–24 m for sprints.' },
      { name: 'Suit', spec: 'Skin-tight speed skating suit. Maximum material thickness 3 mm (0.12 in). No artificial devices to reduce air resistance. Cut-resistant fabric on lower legs mandatory (Rule 291, ISU).' },
      { name: 'Protective Equipment', spec: 'Cut-resistant neck protection recommended. Cut-resistant gloves or hand protection mandatory. Helmet not required for long track (unlike short track).' },
    ]},
    area: { desc: 'Standard 400 m oval track with two lanes.', specs: [
      'Track: 400 m (1312 ft) oval, two lanes',
      'Inner lane radius: 25–26 m (82–85 ft)',
      'Lane width: minimum 4 m (13.1 ft) each lane',
      'Crossing straight: clearly marked lane-change zone at each straightaway',
      'Ice temperature: approximately -6°C to -8°C (21°F to 17.6°F)',
      'Indoor venues preferred for World Cup and Olympic competitions',
    ]},
    players: { desc: 'Individual time trials with two skaters racing simultaneously in separate lanes. Mass Start: up to 24 skaters racing together. Team Pursuit: teams of 3. Referee, assistant referees, starter, lap counters, electronic timing to 1/1000th of a second (rounded to 1/100th for results).' },
    rules: [
      'Standard races: two skaters start simultaneously, one in inner lane, one in outer lane. Skaters must change lanes at each crossing straight (once per lap). Inner-lane skater has right of way in the crossing zone.',
      'Distances: 500 m (1.25 laps), 1000 m (2.5 laps), 1500 m (3.75 laps), 3000 m (7.5 laps), 5000 m (12.5 laps), 10000 m (25 laps).',
      'Team Pursuit: 2 teams of 3 skaters race simultaneously on opposite sides of the track. 8 laps (3200 m men), 6 laps (2400 m women). Time taken when 3rd skater crosses finish line.',
      'Mass Start: 24 skaters, 16 laps (6400 m). Sprint points awarded at laps 4, 8, and 12. Final sprint determines winner. Sprint points used as tiebreaker.',
      '500 m: single race determines final ranking (changed from best-of-two in 2018).',
    ],
    scoring: 'Rankings determined by time. Times recorded to 1/100th of a second. In Mass Start, final placement is primary ranking, with accumulated sprint points as tiebreaker. Team Pursuit: elimination bracket based on times.',
    violations: [
      'Lane obstruction: disqualification of the offending skater',
      'False start: one false start warning, second results in DSQ',
      'Failure to change lanes at crossing zone: DSQ',
      'Deliberate impedance in Mass Start: DSQ',
      'Equipment violation (suit thickness, blade dimensions): DSQ',
    ],
    safety: 'Padded mats around outer track walls. Safety pads at curve ends minimum 60 cm (24 in) thick. Cut-resistant lower leg protection mandatory. Track surface maintained between race pairs. Competition suspended if ice conditions become unsafe.',
  },
  {
    name: 'Short Track Speed Skating', org: 'ISU', category: 'Winter Sports',
    file: 'ISU_Short_Track_Rules.html',
    tags: ['olympic','professional','short track','isu','speed skating'],
    intro: `Short track speed skating became an Olympic sport at the 1992 Albertville Games, though it appeared as a demonstration event in 1988. Governed by the ISU under <strong>ISU Special Regulations Short Track Speed Skating</strong>, the sport features pack-style racing on a 111.12 m oval marked on a standard hockey rink. Olympic events include 500 m, 1000 m, 1500 m (individual), 5000 m Relay (men), 3000 m Relay (women), and Mixed Team Relay (added 2022). South Korea, China, Canada, and the Netherlands are traditionally dominant.`,
    equipment: { items: [
      { name: 'Skates', spec: 'Fixed-blade speed skates (clap skates not permitted). Blade length minimum 30.5 cm (12 in) to maximum proportional to boot size. Blade must be symmetrically ground. Blade radius between 11 m and 12 m.' },
      { name: 'Helmet', spec: 'Hard-shell helmet mandatory, conforming to ISU specifications. Chin strap secured at all times on ice. No protrusions or aerodynamic aids.' },
      { name: 'Protective Equipment', spec: 'Cut-resistant suit (entire suit must meet cut-resistance standards). Cut-resistant neck protection mandatory. Shin guards and knee pads mandatory. Eye protection (glasses/goggles) optional. Gloves with cut-resistant fingertips.' },
    ]},
    area: { desc: 'Races held on a standard-size ice hockey rink with track marked by rubber blocks.', specs: [
      'Track: 111.12 m (364.6 ft) per lap, marked on a 60 m × 30 m (197 ft × 98 ft) rink',
      'Corner radius: 8 m (26.2 ft)',
      'Track width: minimum 7 m (23 ft)',
      'Track markers: rubber apex blocks placed at each corner',
      'Padding: safety mats around entire rink perimeter, minimum 60 cm (24 in) thick',
    ]},
    players: { desc: 'Pack racing: 4–8 skaters per heat depending on distance and round. Referee, assistant referees, video review officials. Electronic timing with photo finish capability. Video replay system mandatory for penalty review.' },
    rules: [
      '500 m: 4.5 laps. Heats of 4 skaters, advancement based on placement (top 2 advance typically).',
      '1000 m: 9 laps. Heats progressing to quarterfinals, semifinals, finals.',
      '1500 m: 13.5 laps. Semifinal format with advancement.',
      'Relay: 5000 m men (45 laps), 3000 m women (27 laps). Teams of 4, skaters exchange by push (physical push from behind). No required exchange pattern — teams manage their own strategy. Last 2 laps must be completed by one skater.',
      'Mixed Team Relay: teams of 2 men + 2 women. Format varies by competition.',
      'All racing is counter-clockwise. Passing on the inside (left) requires the overtaking skater to be ahead before entering the corner.',
    ],
    scoring: 'Placement-based advancement through rounds. Final rankings determined by finishing position in the final races. Time is used only as a tiebreaker or for seeding purposes.',
    violations: [
      'Causing a collision through irregular movement: penalty (advancement denied or DSQ)',
      'Impeding another skater: penalty',
      'Crossing the track (cutting inside the apex blocks): penalty',
      'Late exchange in relay (pushing after the exchange zone): penalty',
      'Penalties reviewed by video referee — decisions are final',
    ],
    safety: 'Full perimeter padding mandatory (minimum 60 cm / 24 in thick). Cut-resistant full-body suits required. Helmet mandatory at all times on ice. Maximum 8 skaters per race to reduce collision risk. Medical team with stretcher immediately available.',
  },
  {
    name: 'Curling', org: 'WCF', category: 'Winter Sports',
    file: 'WCF_Curling_Rules.html',
    tags: ['olympic','professional','curling','wcf'],
    intro: `Curling has been an official Olympic sport since the 1998 Nagano Games, with mixed doubles added at PyeongChang 2018. The World Curling Federation (WCF) governs the sport under <strong>The Rules of Curling and Rules of Competition</strong> (latest edition October 2024). Originating in medieval Scotland, curling is played by two teams who slide polished granite stones on a rectangular sheet of ice towards a circular target (the house). Olympic disciplines include Men's, Women's, and Mixed Doubles.`,
    equipment: { items: [
      { name: 'Stones', spec: 'Each stone weighs between 17.24 kg and 19.96 kg (38 lb and 44 lb) including handle and bolt (Rule C1(a)). Circumference not greater than 91.44 cm (36 in). Height minimum 11.43 cm (4.5 in). Stones are made of granite, traditionally from Ailsa Craig, Scotland, or Trefor, Wales.' },
      { name: 'Brooms/Brushes', spec: 'Used for sweeping the ice surface ahead of a moving stone. Must comply with WCF specifications. Broom heads must be WCF-approved fabric. No devices that alter the stone path beyond sweeping friction are permitted.' },
      { name: 'Shoes', spec: 'Slider shoe (Teflon or similar) on the delivery foot for gliding during stone delivery. Gripper shoe on the other foot for traction. Slider must be clean and unmodified.' },
    ]},
    area: { desc: 'Played on a prepared ice sheet with specific markings.', specs: [
      'Sheet length: 45.72 m (150 ft) from hack to hack',
      'Sheet width: maximum 5.0 m (16 ft 5 in)',
      'House (target): four concentric circles with diameters of 1.83 m (6 ft), 2.44 m (8 ft), 3.66 m (12 ft)',
      'Tee line: center of the house, 3.66 m (12 ft) from the back board',
      'Hog line: 6.40 m (21 ft) from the tee line — stones must be released before the near hog line and cross the far hog line to remain in play',
      'Ice temperature: approximately -5°C (23°F). Pebbled surface (water droplets frozen onto flat ice to create texture)',
    ]},
    players: { desc: 'Teams of 4 players: Lead, Second, Third (Vice-Skip), and Skip. Mixed Doubles: 2 players per team. Each team has a coach. Officials include a Chief Umpire, Deputy Chief Umpire, and game umpires. Timing clocks used in most international competitions.' },
    rules: [
      'Standard game: 10 ends. Mixed Doubles: 8 ends. Each team delivers 8 stones per end (4 in Mixed Doubles). Stones alternate between teams.',
      'Delivery: player pushes off from the hack, slides with the stone, and releases it before the near hog line. The stone must cross the far hog line or be removed from play.',
      'Sweeping: two players may sweep their team\'s stone from the tee line at the delivery end to the tee line at the playing end. Only one player may sweep behind the tee line at the playing end. Sweeping raises ice temperature slightly, reducing friction and allowing the stone to travel farther and curl less.',
      'Free Guard Zone (FGZ): the first 5 stones of each end (3 per team in alternation) that come to rest in the FGZ (between hog line and tee line, excluding the house) may not be removed by the opposing team. Violation: removed stone is replaced, offending stone removed.',
      'Mixed Doubles positioning: one stone per team is pre-placed before each end (one in the house, one as a guard).',
    ],
    scoring: 'After all 16 stones are delivered in an end, the team with the stone closest to the tee (center) scores. That team scores one point for each stone closer to the tee than the opponent\'s closest stone. Only one team can score per end. If no stones are in the house, the end is blanked (no score), and the team with last-stone advantage retains it.',
    violations: [
      'Hog line violation: stone released after the hog line is removed from play. Electronic handle (Eye on the Hog) detects release point automatically.',
      'Touched running stone (burned stone): if a moving stone is touched by a player or equipment, the non-offending team decides the stone\'s final position.',
      'Stone delivered out of rotation order: if noticed before the next stone is delivered, the stone is removed and redelivered in correct order.',
      'Time violation: thinking time expires — team forfeits the game.',
    ],
    safety: 'Clean footwear required to prevent falls. Ice surface maintained between games. No running on ice. Brooms must not be thrown. Team members must be aware of moving stones at all times.',
  },
  {
    name: 'Biathlon', org: 'IBU', category: 'Winter Sports',
    file: 'IBU_Biathlon_Rules.html',
    tags: ['olympic','professional','biathlon','ibu','shooting','skiing'],
    intro: `Biathlon, combining cross-country skiing and rifle marksmanship, has been an Olympic sport since 1960 (men) and 1992 (women). The International Biathlon Union (IBU) governs the sport under the <strong>IBU Event and Competition Rules (ECR)</strong>. Olympic events include Individual (20 km men, 15 km women), Sprint (10 km men, 7.5 km women), Pursuit (12.5 km men, 10 km women), Mass Start (15 km men, 12.5 km women), Relay (4×7.5 km men, 4×6 km women), and Mixed Relay. The sport\'s origins trace to Scandinavian military training traditions.`,
    equipment: { items: [
      { name: 'Rifle', spec: '.22 LR calibre (5.6 mm) bolt-action rifle. Minimum weight 3.5 kg (7.7 lb). No automatic or semi-automatic actions. Magazine capacity 5 rounds. No optical sights, telescopic sights, or lens systems permitted. Maximum trigger pull not regulated but must be safe.' },
      { name: 'Ammunition', spec: '.22 Long Rifle (LR) rimfire cartridges. Athletes carry their own ammunition. 5 rounds per shooting stage, plus 3 spare rounds per stage in Sprint/Pursuit/Mass Start for use on the penalty loop alternative.' },
      { name: 'Skis', spec: 'Free technique (skating) skis. Minimum length per FIS cross-country regulations. No fluorocarbon wax.' },
      { name: 'Harness', spec: 'Rifle carried on the back in a custom harness during skiing. Rifle must be secured with barrel pointing upward.' },
    ]},
    area: { desc: 'Competition venue includes skiing course and shooting range.', specs: [
      'Shooting range: 50 m (164 ft) distance from firing line to targets. 30 lanes minimum for World Cup/Olympics. Prone targets: 45 mm (1.77 in) diameter. Standing targets: 115 mm (4.53 in) diameter.',
      'Course: designed per IBU specifications with varying terrain. Sprint course: 2.5 km per lap (men), 2.5 km per lap (women). Individual course: 4 km or 5 km per lap.',
      'Penalty loop: 150 m (492 ft) loop near the range for each missed target in Sprint, Pursuit, Mass Start, and Relay.',
      'Stadium: must accommodate start/finish, shooting range, penalty loop, and spectator areas.',
    ]},
    players: { desc: 'Individual sport with relay team events. Competition jury: Technical Delegate, Chief of Competition, Range Officer, Course Chief. Shooting judges monitor target hits via electronic target systems. Timing to 1/10th second.' },
    rules: [
      'Individual: longest event. 4 shooting stages alternating prone and standing. 1 minute time penalty added per missed target (no penalty loop).',
      'Sprint: 2 shooting stages (1 prone, 1 standing). 1 penalty loop (150 m) per missed target.',
      'Pursuit: starts based on Sprint results (time gaps). 4 shooting stages. 1 penalty loop per miss.',
      'Mass Start: all athletes start together. 4 shooting stages. 1 penalty loop per miss.',
      'Relay: 4 athletes per team. Each skis 3 laps with 2 shooting stages. 3 spare rounds per stage available if initial 5 miss. After 8 total shots, penalty loop for each remaining miss.',
      'Athletes must complete each shooting stage before continuing on course. Shooting position: prone (lying flat) or standing, as specified per stage.',
    ],
    scoring: 'Finish time determines ranking. In Individual, 1 minute added per missed target. In Sprint/Pursuit/Mass Start, penalty loops add approximately 20–25 seconds per miss. Relay: team finish time. Mixed Relay: combined format.',
    violations: [
      'Safety violation on range (pointing rifle incorrectly): DSQ and potential competition ban',
      'Early start: 1 minute time penalty (Sprint, Individual) or restart',
      'Equipment violation: DSQ',
      'Crossing into wrong shooting lane: time penalty',
      'Unsportsmanlike conduct: yellow card, red card, or DSQ',
    ],
    safety: 'Range safety officer controls access. No loaded rifles outside designated range area. Rifles inspected before competition. Athletes must keep barrel pointed skyward when carrying rifle. Range cleared and checked between competition groups. Ammunition storage and handling per IBU safety regulations.',
  },
  {
    name: 'Bobsled', org: 'IBSF', category: 'Winter Sports',
    file: 'IBSF_Bobsled_Rules.html',
    tags: ['olympic','professional','bobsled','bobsleigh','ibsf'],
    intro: `Bobsled (bobsleigh) has been an Olympic sport since the inaugural 1924 Winter Games. The International Bobsled and Skeleton Federation (IBSF) governs the sport under the <strong>IBSF International Rules</strong>. Olympic events include two-man (two-woman from 2022), four-man, and monobob (women, added 2022). Crews pilot gravity-powered sleds down purpose-built ice tracks at speeds exceeding 150 km/h (93 mph), navigating up to 20 curves through a combination of driving skill and athletic power at the start.`,
    equipment: { items: [
      { name: 'Sled', spec: 'Two-man: maximum weight without crew 170 kg (375 lb), maximum combined weight (sled + crew) 390 kg (860 lb). Four-man: maximum weight without crew 210 kg (463 lb), maximum combined weight 630 kg (1389 lb). Monobob: standardized IBSF sled, weight 162 kg (357 lb). Runners: steel, minimum hardness 63 HRC, temperature not to exceed ice temperature by more than 4°C (7.2°F) at time of inspection.' },
      { name: 'Helmet', spec: 'Full-face helmet mandatory, meeting IBSF specifications. Must conform to ECE 22.06 or Snell SA2020 or higher.' },
      { name: 'Shoes', spec: 'Start shoes (spike shoes) with maximum 44 spikes per shoe. Spike length maximum 5 mm (0.2 in). Must be IBSF-approved.' },
      { name: 'Suit', spec: 'Skin-tight aerodynamic suit. Maximum material thickness regulated. No artificial aerodynamic aids.' },
    ]},
    area: { desc: 'Purpose-built artificially refrigerated ice tracks.', specs: [
      'Track length: 1200–1650 m (3937–5413 ft)',
      'Vertical drop: 100–150 m (328–492 ft)',
      'Number of curves: 15–20',
      'Average gradient: 8–15%',
      'Start section: 50 m (164 ft) push zone, gradient 2–5%',
      'Minimum curve radius: 20 m (66 ft)',
      'Ice thickness: approximately 3–5 cm (1.2–2 in) on artificially refrigerated concrete base',
    ]},
    players: { desc: 'Two-man/monobob: 1 pilot + 1 brakeman (two-man) or 1 pilot (monobob). Four-man: 1 pilot + 1 brakeman + 2 pushers. Jury: Technical Delegate, Race Director, Track Chief. Electronic timing to 1/100th of a second. Start time measured separately over first 50 m.' },
    rules: [
      'Competition format: 4 runs over 2 days (2 runs per day). Combined time determines final ranking.',
      'Start: crew pushes sled from standstill for approximately 50 m before loading. Start time (measured at a specific point) is a critical competitive factor.',
      'Pilot steers using two D-rings connected to a steering mechanism that adjusts the front runners. Precise steering through curves is essential to maintain speed.',
      'Brakeman operates the brake only after crossing the finish line. Braking before the finish results in disqualification.',
      'Sled inspection: weight, runner temperature, and equipment compliance checked before and after each run.',
    ],
    scoring: 'Combined time of all runs (typically 4 runs) determines final ranking. Times recorded to 1/100th second. Start time, split times at curve markers, and finish time are all recorded. Rankings are by total combined time.',
    violations: [
      'Brake applied before finish line: DSQ',
      'Runner temperature violation (too warm): DSQ for that run',
      'Sled weight exceeds maximum: DSQ',
      'Equipment modifications after inspection: DSQ',
      'Missing mandatory equipment: not permitted to start',
    ],
    safety: 'Track walls lined with specialized ice and concrete. High-G-force curves profiled to contain sleds. Safety run-off areas at critical points. Emergency braking zones. Speed-reducing chicanes if needed. Medical team with sled-mounted stretcher at track bottom. Track inspection before each training and competition session.',
  },
  {
    name: 'Luge', org: 'FIL', category: 'Winter Sports',
    file: 'FIL_Luge_Rules.html',
    tags: ['olympic','professional','luge','fil'],
    intro: `Luge has been an Olympic sport since the 1964 Innsbruck Games. The Fédération Internationale de Luge de Course (FIL) governs the sport under the <strong>FIL International Luge Regulations (ILR)</strong>. Athletes lie supine (face up, feet first) on a small sled and navigate the same artificially refrigerated tracks used for bobsled. Olympic events include Men's Singles, Women's Singles, Doubles, and Team Relay (added 2014). Luge is the fastest of the sliding sports, with athletes reaching speeds exceeding 150 km/h (93 mph).`,
    equipment: { items: [
      { name: 'Sled', spec: 'Singles: maximum weight 23 kg (50.7 lb) men, 21 kg (46.3 lb) women. Doubles: maximum weight 27 kg (59.5 lb). Length: singles maximum 150 cm (59 in), doubles maximum 167 cm (65.7 in). Width: maximum 55 cm (21.7 in) singles, 60 cm (23.6 in) doubles. Steel runners: maximum temperature not to exceed track surface temperature by more than 5°C (9°F).' },
      { name: 'Helmet', spec: 'Aerodynamic visor helmet mandatory. Must meet FIL specifications. Face shield required.' },
      { name: 'Suit', spec: 'Skin-tight aerodynamic suit. Maximum material thickness as specified. No additional weight or aerodynamic modifications permitted.' },
      { name: 'Gloves', spec: 'Spiked gloves for start (paddle start). Maximum spike length 4 mm (0.16 in).' },
    ]},
    area: { desc: 'Races held on artificially refrigerated tracks (shared with bobsled/skeleton).', specs: [
      'Track length: 1000–1350 m (3281–4429 ft) for men, 800–1100 m (2625–3609 ft) for women',
      'Vertical drop: 85–130 m (279–427 ft)',
      'Number of curves: 13–20',
      'Average gradient: 8–11%',
      'Start area: seated start with handles for paddle push-off',
    ]},
    players: { desc: 'Singles: 1 athlete. Doubles: 2 athletes on one sled (one atop the other). Team Relay: 1 women\'s singles + 1 men\'s singles + 1 doubles, sequential runs with touch-pad relay exchange. Jury: Race Director, Technical Delegate, Track Chief. Electronic timing to 1/1000th of a second.' },
    rules: [
      'Singles: 4 runs over 2 days (2 runs per day). Combined time determines ranking.',
      'Doubles: 2 runs over 1 day. Combined time determines ranking.',
      'Start: athletes sit on the sled, grip handles on the start ramp, and use spiked gloves to paddle/push off. Start time measured over first meters.',
      'Steering: athletes steer by applying pressure with calves to the sled runners and shifting body weight. No mechanical steering mechanism.',
      'Athletes must remain in contact with the sled at all times during the run. Separation from the sled results in DSQ.',
      'Team Relay: three sleds race sequentially. The finishing sled triggers a touch pad that opens a start gate for the next sled. Combined time of all three runs determines ranking.',
    ],
    scoring: 'Combined time of all runs determines ranking. Times to 1/1000th second. Start time, intermediate times, and finish time recorded.',
    violations: [
      'Runner temperature violation: DSQ for that run',
      'Sled weight violation: DSQ',
      'Modification of sled after inspection: DSQ',
      'Adding weight to athlete or sled beyond regulations: DSQ',
      'Leaving sled during run (unintentional separation): DSQ',
    ],
    safety: 'Helmet with visor mandatory. Track walls padded at high-G sections. Speed monitoring throughout. Medical team at track finish. Track inspection before each session. Weather conditions (temperature, wind) monitored continuously.',
  },
  {
    name: 'Skeleton', org: 'IBSF', category: 'Winter Sports',
    file: 'IBSF_Skeleton_Rules.html',
    tags: ['olympic','professional','skeleton','ibsf'],
    intro: `Skeleton returned to the Olympic program at the 2002 Salt Lake City Games after a 54-year absence. Governed by the IBSF under the <strong>IBSF International Rules</strong>, athletes race head-first in a prone position (face down) on a small sled down the same tracks used for bobsled and luge. Olympic events include Men's and Women's individual competitions. The sport is distinguished from luge by the head-first orientation and running start, with athletes reaching speeds exceeding 140 km/h (87 mph).`,
    equipment: { items: [
      { name: 'Sled', spec: 'Maximum weight: 43 kg (94.8 lb) men, 35 kg (77.2 lb) women. Maximum combined weight (sled + athlete): 120 kg (264.6 lb) men, 92 kg (202.8 lb) women. Maximum length 120 cm (47.2 in). Maximum width 38 cm (15 in). Steel runners.' },
      { name: 'Helmet', spec: 'Chin guard helmet mandatory, meeting IBSF specifications. Must provide chin and face protection due to head-first orientation.' },
      { name: 'Suit', spec: 'Skin-tight suit. Maximum thickness regulated. No aerodynamic aids.' },
      { name: 'Shoes', spec: 'Spike shoes for running start. Maximum spike length 7 mm (0.28 in).' },
    ]},
    area: { desc: 'Races held on artificially refrigerated tracks (shared with bobsled and luge).', specs: [
      'Track length: 1200–1650 m (3937–5413 ft)',
      'Vertical drop: 100–150 m (328–492 ft)',
      'Athletes use the same track as bobsled (full-length start)',
      'Running start zone: approximately 30–40 m (98–131 ft)',
    ]},
    players: { desc: 'Individual competition. Jury: Technical Delegate, Race Director. Electronic timing to 1/100th second. Start time, split times, and finish time recorded.' },
    rules: [
      'Competition format: 4 runs over 2 days (2 runs per day). Combined time determines final ranking.',
      'Start: athlete sprints while pushing the sled for approximately 30–40 m, then dives head-first onto the sled.',
      'Athlete steers by shifting body weight and applying pressure with shoulders, knees, and toes to the sled.',
      'Athlete must cross the finish line on the sled. Separating from the sled before the finish results in a DNF.',
      'Sled inspection including runner temperature and weight conducted before and after each run.',
    ],
    scoring: 'Combined time of all 4 runs determines final ranking. Times recorded to 1/100th second.',
    violations: [
      'Runner temperature exceeds limit: DSQ for that run',
      'Sled or combined weight exceeds maximum: DSQ',
      'Equipment modification after inspection: DSQ',
      'Athlete not on sled at finish: DNF',
    ],
    safety: 'Chin guard helmet mandatory due to head-first position. Track padding at high-impact zones. Medical team at finish area. Speed monitoring. Track inspection before each session.',
  },
  {
    name: 'Ice Hockey', org: 'IIHF', category: 'Winter Sports',
    file: 'IIHF_Ice_Hockey_Rules.html',
    tags: ['olympic','professional','ice hockey','iihf','international'],
    intro: `Ice hockey has been an Olympic sport since the 1920 Antwerp Games (Summer Olympics) and has been part of every Winter Olympics since 1924. The International Ice Hockey Federation (IIHF) governs international competition under the <strong>IIHF Official Rule Book</strong> (latest edition 2024-2028). Note: IIHF rules differ from NHL rules in several key areas including rink size, icing rules, and fighting penalties. IIHF rules are used at the Olympic Games, World Championships, and all IIHF-sanctioned tournaments. Women's ice hockey was added to the Olympics in 1998.`,
    equipment: { items: [
      { name: 'Stick', spec: 'Maximum length 163 cm (64 in) from heel to end of shaft. Blade length 25–32 cm (9.8–12.6 in), width 5–7.5 cm (2–3 in). Blade curvature maximum 1.5 cm (0.59 in). No illegal curves allowed (Rule 32, IIHF Official Rule Book).' },
      { name: 'Protective Equipment', spec: 'Helmet with full face shield (cage or visor) mandatory. Neck guard mandatory for goalkeepers. Full body protection including shoulder pads, elbow pads, gloves, shin guards, hockey pants. Mouthguard recommended.' },
      { name: 'Puck', spec: 'Vulcanized rubber. Diameter 7.62 cm (3 in). Thickness 2.54 cm (1 in). Weight 156–170 g (5.5–6 oz). Frozen before use.' },
      { name: 'Goalkeeper Equipment', spec: 'Leg pads maximum width 28 cm (11 in). Blocker and catching glove. Chest and arm protector. Goalkeeper mask mandatory.' },
    ]},
    area: { desc: 'Played on a regulation ice rink with standard markings.', specs: [
      'IIHF rink: 60 m × 30 m (197 ft × 98.4 ft) — wider than NHL rinks (60.96 m × 25.91 m / 200 ft × 85 ft)',
      'Corner radius: 7–8.5 m (23–28 ft)',
      'Goal: 183 cm (6 ft) wide × 122 cm (4 ft) high',
      'Blue lines: 22.86 m (75 ft) from the goal line, dividing ice into defending, neutral, and attacking zones',
      'Center ice circle: 4.5 m (14.8 ft) radius',
      'Goal crease: semi-circular area in front of goal, radius 1.8 m (5.9 ft)',
    ]},
    players: { desc: '6 players per team on ice (5 skaters + 1 goalkeeper). Roster: maximum 22 players (20 skaters + 2 goalkeepers). On-ice officials: 1 referee + 2 linesmen (3-official system) or 2 referees + 2 linesmen (4-official system for major tournaments). Off-ice officials include goal judges, timekeeper, penalty timekeeper, statisticians. Video review available for goal/no-goal decisions.' },
    rules: [
      'Game duration: 3 periods × 20 minutes running time. Overtime in elimination games: 20-minute sudden-death periods. Shootout if tied after overtime in preliminary rounds (5 shooters per team, then sudden death).',
      'Offside: a player may not precede the puck into the attacking zone (across the blue line). If offside, play is stopped and a faceoff held in the neutral zone.',
      'Icing: shooting the puck from behind the center red line across the opposing goal line without it being touched. Results in a faceoff in the offending team\'s defending zone. No-touch icing used in IIHF (automatic whistle when puck crosses goal line). IIHF does NOT use hybrid icing.',
      'Body checking: permitted for men\'s hockey. Prohibited in women\'s hockey under IIHF rules. Checking from behind is always illegal.',
      'Fighting: IIHF imposes a match penalty (ejection from the game + automatic 1-game suspension) for fighting. This is significantly stricter than NHL rules.',
    ],
    scoring: 'A goal is scored when the entire puck crosses the goal line between the posts and below the crossbar. Goals may be reviewed by video. Team with the most goals at end of regulation time wins.',
    violations: [
      'Minor penalty: 2 minutes in penalty box (tripping, hooking, holding, interference, etc.)',
      'Major penalty: 5 minutes for serious infractions (boarding, charging, fighting)',
      'Misconduct: 10 minutes (unsportsmanlike conduct) — team does not play short-handed',
      'Match penalty: ejection from game + automatic suspension (fighting, deliberate intent to injure)',
      'Penalty shot: awarded for infractions preventing clear scoring opportunities (breakaway fouls, covering puck in crease)',
    ],
    safety: 'Full face protection mandatory for all players. Neck guards mandatory for goalkeepers, recommended for skaters. Head contact penalties strictly enforced. Concussion protocols: player must leave ice and be evaluated. Blood rule: player with visible bleeding must leave ice until bleeding is controlled. Defibrillator and emergency medical equipment required at all IIHF competitions.',
  },
  {
    name: 'Nordic Combined', org: 'FIS', category: 'Winter Sports',
    file: 'FIS_Nordic_Combined_Rules.html',
    tags: ['olympic','professional','nordic combined','fis','ski jumping','cross-country'],
    intro: `Nordic combined has been an Olympic event since the inaugural 1924 Winter Games and is governed by FIS under <strong>ICR Book III (Ski Jumping) and Book II (Cross-Country Skiing)</strong> with combined-specific regulations. The discipline uniquely combines ski jumping and cross-country skiing, requiring athletes to excel in both power/technique (jumping) and endurance (skiing). Olympic events include Individual Normal Hill/10 km, Individual Large Hill/10 km, and Team Large Hill/4×5 km Relay. Women's Nordic combined is scheduled for Olympic debut at the 2026 Milano-Cortina Games.`,
    equipment: { items: [
      { name: 'Jumping Equipment', spec: 'Per FIS ski jumping rules: maximum ski length 145% of body height with BMI adjustment. Jumping suit with maximum thickness 6 mm (0.24 in) and air permeability 40 l/m²/s. FIS-approved helmet.' },
      { name: 'Cross-Country Equipment', spec: 'Free technique (skating) skis per FIS cross-country regulations. Poles maximum 100% of body height. No fluorocarbon wax.' },
      { name: 'Athletes carry/transport two sets of equipment', spec: 'Jumping equipment for the first phase and cross-country equipment for the second phase. Quick transition between phases is essential.' },
    ]},
    area: { desc: 'Competition uses both a ski jumping hill and cross-country course.', specs: [
      'Jumping: Normal Hill (HS 98–109) or Large Hill (HS 127–145)',
      'Cross-Country course: 10 km (Individual), 5 km per leg (Team Relay)',
      'Stadium must accommodate both jumping hill finish and cross-country start/finish',
      'Transition area between jumping hill and cross-country course for equipment change',
    ]},
    players: { desc: 'Individual and team events. Same athletes compete in both jumping and cross-country phases. Team: 4 athletes per team. Competition jury covers both disciplines. Separate timing systems for jumping and cross-country.' },
    rules: [
      'Competition is conducted in two phases: ski jumping first, then cross-country skiing.',
      'Gundersen method: jumping results are converted into time differences for the cross-country start. The leader starts first, with subsequent athletes starting at time gaps corresponding to their jumping point deficits. First to cross the finish line wins.',
      'Jumping phase: typically 1 competition jump (provisional round + competition round). Scored using standard ski jumping point system (distance + style + wind/gate compensation).',
      'Cross-country phase: mass start with staggered times based on jumping results. Free technique (skating).',
      'Point conversion: approximately 4 points difference in jumping = 1 second gap in cross-country start time (varies by event).',
      'Team event: relay format with jumping phase (each athlete jumps once) followed by 4×5 km cross-country relay.',
    ],
    scoring: 'Final ranking determined by cross-country finish order. The Gundersen method ensures the first athlete across the finish line wins, regardless of jumping score. Jumping scores serve only to determine start time gaps.',
    violations: [
      'Per ski jumping rules for the jumping phase (equipment, technique violations)',
      'Per cross-country rules for the skiing phase (technique violations, obstruction)',
      'Equipment non-compliance in either discipline: DSQ from the entire competition',
    ],
    safety: 'Safety requirements of both ski jumping and cross-country apply. Athletes must comply with helmet requirements for jumping. Competition cancelled or modified if conditions are unsafe for either discipline. Medical teams stationed at both venues.',
  },
  // ── Combat Sports (4) ──────────────────────────────────────
  {
    name: 'Judo', org: 'IJF', category: 'Combat Sports',
    file: 'IJF_Judo_Rules.html',
    tags: ['olympic','professional','judo','ijf','martial arts'],
    intro: `Judo has been an Olympic sport since 1964 (men) and 1992 (women), and mixed team events were added in 2020. The International Judo Federation (IJF) governs the sport under the <strong>IJF Sport and Organization Rules (SOR)</strong>, updated annually. Founded by Jigoro Kano in 1882, judo is a grappling martial art emphasizing throws (nage-waza), pins (osaekomi-waza), arm locks (kansetsu-waza), and chokes (shime-waza). The IJF has undergone significant rule modernization since 2017, including banning leg grabs and introducing the golden score overtime system.`,
    equipment: { items: [
      { name: 'Judogi (Uniform)', spec: 'Must be either white or blue (assigned by draw). Jacket must cover the thighs and reach the wrists when arms extended. Minimum space between wrist and jacket sleeve: 5 cm (2 in). Trousers must reach the ankle, minimum 5 cm (2 in) above the ankle bone. Belt tied with a flat knot, ends 20–30 cm (8–12 in) long.' },
      { name: 'Tatami (Competition Mat)', spec: 'Minimum 14 m × 14 m (46 ft × 46 ft) competition area. Contest area: 8 m × 8 m (26 ft × 26 ft) to 10 m × 10 m (33 ft × 33 ft). Safety zone: minimum 3 m (10 ft) wide. Mat material must conform to IJF-approved density and firmness standards.' },
    ]},
    area: { desc: 'Competition takes place on a regulation tatami mat.', specs: [
      'Contest area: 8–10 m × 8–10 m (26–33 ft × 26–33 ft)',
      'Safety zone: minimum 3 m (10 ft) surrounding the contest area',
      'Danger zone: 1 m (3.3 ft) wide red border within the contest area marking the boundary',
      'Total platform area: minimum 14 m × 14 m (46 ft × 46 ft)',
    ]},
    players: { desc: 'Individual and team events. Weight categories: Men (60 kg, 66 kg, 73 kg, 81 kg, 90 kg, 100 kg, +100 kg), Women (48 kg, 52 kg, 57 kg, 63 kg, 70 kg, 78 kg, +78 kg). Officials: 1 mat referee on the tatami + 2 side judges with video review capability.' },
    rules: [
      'Match duration: 4 minutes (men and women). Golden Score: unlimited overtime (no time limit) if tied — first score wins.',
      'Ippon (full point, match-winning): a throw landing the opponent on their back with force, speed, and control; or a pin hold for 20 seconds; or submission by arm lock or choke.',
      'Waza-ari: a partial score — a throw not meeting full ippon criteria. Two waza-ari equal ippon and end the match.',
      'Penalties (Shido): accumulated penalties — first two are warnings, third shido results in hansoku-make (disqualification). Common fouls: passivity, defensive posture, false attacks, gripping below the belt.',
      'Leg grabs (grabbing opponent\'s legs for throws) are prohibited. Direct leg attacks result in immediate hansoku-make.',
      'Ground work (ne-waza): allowed when a throw transitions to groundwork. Referee calls "matte" (stop) if no progress is made on the ground.',
    ],
    scoring: 'Ippon > Waza-ari > Fewer shidos. If no scoring techniques and equal penalties, the match goes to Golden Score. In Golden Score, the first score of any kind (ippon, waza-ari, or opponent receiving third shido) wins.',
    violations: [
      'Shido (minor penalty): passivity (non-combativity), defensive posture (bear hug), false attack, intentional stepping outside, non-standard gripping without immediate attack',
      'Hansoku-make (disqualification): third shido, leg grab, dangerous technique (e.g., head-diving throw), unsportsmanlike conduct',
      'Direct hansoku-make: serious fouls resulting in immediate disqualification and elimination from the tournament',
    ],
    safety: 'Certified tatami mats with proper density. Medical staff at each mat. Referee can stop the match at any time for injury. Arm locks and chokes prohibited for athletes under 18 (cadets). Blood rule: match stopped for treatment. Concussion protocol implemented.',
  },
  {
    name: 'Taekwondo', org: 'World Taekwondo', category: 'Combat Sports',
    file: 'WT_Taekwondo_Rules.html',
    tags: ['olympic','professional','taekwondo','world taekwondo','martial arts'],
    intro: `Taekwondo became an official Olympic sport at the 2000 Sydney Games. World Taekwondo (WT, formerly WTF) governs the sport under the <strong>WT Competition Rules and Interpretation</strong>, with significant technology-driven rule changes including electronic scoring systems (Protector and Scoring System, PSS). Originating in Korea, Olympic taekwondo emphasizes dynamic kicking techniques to the body (trunk) and head, with limited punching to the trunk. Weight categories ensure fair competition across 4 divisions per gender at the Olympics.`,
    equipment: { items: [
      { name: 'Protector (Hogu)', spec: 'WT-approved electronic trunk protector (PSS). Records impact and awards points automatically when struck with sufficient force. Red or blue assigned by draw.' },
      { name: 'Head Protector', spec: 'WT-approved electronic head protector (PSS) with sensors. Points registered for valid head kicks meeting force threshold.' },
      { name: 'Other Protective Gear', spec: 'Forearm guards, shin guards, groin guard (male), hand protectors (electronic gloves in WT events), and mouthguard — all mandatory.' },
      { name: 'Uniform (Dobok)', spec: 'WT-approved uniform. White with V-neck top. Must be clean and properly fitted.' },
    ]},
    area: { desc: 'Competition takes place on a regulation octagonal mat.', specs: [
      'Competition area: 8 m × 8 m (26.2 ft × 26.2 ft) octagonal mat',
      'Boundary line: clearly marked',
      'Safety zone: minimum 2 m (6.6 ft) beyond the boundary',
      'Mat surface: WT-approved, shock-absorbing material',
    ]},
    players: { desc: 'Individual competition. Olympic weight categories: Men (58 kg, 68 kg, 80 kg, +80 kg), Women (49 kg, 57 kg, 67 kg, +67 kg). Officials: 1 center referee + 2 corner judges + 1 review jury. Electronic PSS scoring system primary, with judges for supplementary scoring.' },
    rules: [
      'Match format: 3 rounds × 2 minutes each, with 1 minute rest between rounds.',
      'Valid scoring areas: trunk protector (front and side, no back) and head (all areas of head protector above the collarbone).',
      'Punches: straight punch to trunk protector only (no head punches). Must use closed fist. 1 point.',
      'Kicks to trunk: any valid kick striking the trunk protector. 2 points for a regular kick.',
      'Turning kicks to trunk: kick involving 180° or more rotation. 4 points.',
      'Kicks to head: any valid kick to the head protector. 3 points for a regular head kick.',
      'Turning kicks to head: head kick involving 180° or more rotation. 5 points.',
      'Golden Round: if tied after 3 rounds, a 4th round (2 minutes) is contested. First to score wins. If still tied, superiority decision by judges.',
    ],
    scoring: 'Points registered by the PSS (electronic system) when valid striking area makes contact with valid target with sufficient force. Judges may add points for valid techniques not detected by the PSS. Total points at end of 3 rounds determines winner.',
    violations: [
      'Gam-jeom (penalty point, adds 1 point to opponent): falling down, grabbing/pushing opponent, attacking below the waist, hitting the back, attacking after "kal-yeo" (break), stepping out of boundary, turning back to avoid combat',
      '10 gam-jeom accumulated: automatic disqualification',
      'Instant disqualification: intentional attack after "kal-yeo," violent or extreme unsportsmanlike conduct, manipulation of the PSS equipment',
      'Video replay (Instant Video Replay, IVR): coaches may request review once per match. If successful, additional reviews allowed. If unsuccessful, no more reviews.',
    ],
    safety: 'Full electronic protective equipment mandatory. Medical staff on-site. Referee stops match for injury assessment. Knockout results in mandatory medical examination and 30-day competition suspension. Concussion protocol: athlete must be cleared by medical personnel before resuming competition.',
  },
  {
    name: 'Wrestling', org: 'UWW', category: 'Combat Sports',
    file: 'UWW_Wrestling_Rules.html',
    tags: ['olympic','professional','wrestling','uww','freestyle','greco-roman'],
    intro: `Wrestling is one of the oldest Olympic sports, contested at the ancient Olympics and every modern Games since 1896. United World Wrestling (UWW, formerly FILA) governs the sport under the <strong>International Wrestling Rules</strong>. Olympic wrestling features two styles: Freestyle (men and women) and Greco-Roman (men only). In Freestyle, athletes may use their entire body including legs for attacks. In Greco-Roman, holds below the waist are prohibited, emphasizing upper-body throws. Weight categories at the Olympics include 6 per gender/style.`,
    equipment: { items: [
      { name: 'Singlet', spec: 'One-piece wrestling singlet in red or blue (assigned by draw). Must be UWW-approved. Tight-fitting for safety (prevents grabbing loose clothing).' },
      { name: 'Wrestling Shoes', spec: 'Soft-soled shoes covering the ankle. Laces tucked in or taped. No buckles, metal parts, or hard soles. Red or blue to match singlet.' },
      { name: 'Headgear', spec: 'Optional in international competition but recommended. Mandatory at some age levels. Must be UWW-approved without rigid components.' },
      { name: 'Blood Rag / Handkerchief', spec: 'Athletes must carry a handkerchief (blood rag) during competition for blood management.' },
    ]},
    area: { desc: 'Competition takes place on a regulation wrestling mat.', specs: [
      'Competition surface: circular, 9 m (29.5 ft) diameter',
      'Passivity zone: 1 m (3.3 ft) wide orange/red border at edge of competition surface',
      'Protection area: minimum 1.5 m (4.9 ft) surrounding the competition surface',
      'Total mat area: 12 m × 12 m (39.4 ft × 39.4 ft) minimum',
      'Mat thickness: minimum 6 cm (2.4 in), shock-absorbing',
    ]},
    players: { desc: 'Individual competition. Olympic weight categories: Freestyle Men (57 kg, 65 kg, 74 kg, 86 kg, 97 kg, 125 kg), Freestyle Women (50 kg, 53 kg, 57 kg, 62 kg, 68 kg, 76 kg), Greco-Roman (60 kg, 67 kg, 77 kg, 87 kg, 97 kg, 130 kg). Officials: 1 mat referee + 1 mat judge + 1 mat chairman.' },
    rules: [
      'Match duration: 2 periods × 3 minutes each, with 30 seconds break between periods.',
      'Fall (Pin): both shoulder blades held on the mat for approximately 1-2 seconds — instant win regardless of score. This is the ultimate objective.',
      'Technical Superiority: winning by 10 points or more (8-point lead before 2022 rule changes) ends the match immediately.',
      'Takedown: bringing opponent from standing to the mat — 2 points (Freestyle), 1 point if minimal control.',
      'Exposure (Danger Position): turning opponent\'s back toward the mat at less than 90 degrees — 2–3 points.',
      'Reversal: moving from defensive (bottom) to offensive (top) position — 1 point.',
      'Greco-Roman specific: all attacks must be above the waist. No leg trips, leg hooks, or holds below the waist. Emphasizes throws, gut wrenches, and upper-body techniques.',
      'Passivity: if a wrestler is passive (not attacking), the referee issues a verbal caution, then a passivity call giving the opponent 1 point and choice of par terre (ground) position.',
    ],
    scoring: 'Points accumulated during the match. If no fall or technical superiority, winner is determined by: most points, then if tied: highest-value move, then last point scored, then fewest cautions.',
    violations: [
      'Caution and 1 point to opponent: illegal hold, fleeing the mat, unnecessary roughness',
      'Caution and 2 points: brutal or dangerous throw with intent to injure',
      'Disqualification: 3 cautions in a match, unsportsmanlike conduct, intentional injury',
      'Greco-Roman specific: any leg attack or hold below waist results in caution and 1–2 points to opponent',
    ],
    safety: 'Mat thickness and quality inspected before competition. Referee can stop match for injury at any time. Blood time: match paused for bleeding treatment (maximum cumulative blood time). Medical staff at matside. Weigh-in conducted the morning of competition.',
  },
  {
    name: 'Fencing', org: 'FIE', category: 'Combat Sports',
    file: 'FIE_Fencing_Rules.html',
    tags: ['olympic','professional','fencing','fie','epee','foil','sabre'],
    intro: `Fencing has been part of every modern Olympic Games since 1896. The Fédération Internationale d'Escrime (FIE) governs the sport under the <strong>FIE Rules for Competitions</strong> (latest edition 2024). Three weapons are contested: Foil (thrusting, torso target), Épée (thrusting, full body target), and Sabre (cutting and thrusting, upper body target). Each weapon has distinct rules governing target area, right of way (priority), and scoring. Electronic scoring equipment has been standard since 1956 (foil), 1936 (épée), and 1988 (sabre).`,
    equipment: { items: [
      { name: 'Weapons', spec: 'Foil: maximum weight 500 g (17.6 oz), maximum length 110 cm (43.3 in), flexible rectangular blade. Épée: maximum weight 770 g (27.2 oz), maximum length 110 cm, stiffer triangular blade. Sabre: maximum weight 500 g (17.6 oz), maximum length 105 cm (41.3 in), flat V-shaped blade.' },
      { name: 'Mask', spec: 'Wire mesh mask with bib. Mesh must resist 12 kg punch test (1600 N). Foil/Sabre masks have conductive bib/mesh for electronic scoring. FIE-certified masks required for international competition.' },
      { name: 'Jacket/Lamé', spec: 'Protective jacket covering torso and arms. Foil: conductive lamé vest covering valid target (torso). Sabre: conductive lamé covering valid target (everything above waist, including arms and mask). Épée: no lamé required (entire body is valid target).' },
      { name: 'Glove', spec: 'Padded glove on weapon hand. Must cover forearm partially. Conductive cuff on sabre glove.' },
    ]},
    area: { desc: 'Bouts take place on a regulation fencing strip (piste).', specs: [
      'Piste length: 14 m (45.9 ft)',
      'Piste width: 1.5–2 m (4.9–6.6 ft)',
      'Run-back area: 1.5–2 m (4.9–6.6 ft) beyond each end',
      'En-garde lines: 2 m (6.6 ft) from center line',
      'Warning lines: 2 m (6.6 ft) from rear end of piste',
      'Surface: metallic grounded surface to prevent floor touches from registering',
    ]},
    players: { desc: 'Individual and team events. Individual bouts overseen by a referee (président) who controls the bout and awards touches based on priority (foil/sabre). Side judges no longer used — replaced by electronic scoring apparatus. Video replay available in FIE competitions.' },
    rules: [
      'Direct elimination bouts: 3 periods of 3 minutes each, maximum 15 touches (or first to 15). 1-minute rest between periods.',
      'Pool bouts: 3 minutes or first to 5 touches.',
      'Foil: thrusting weapon. Valid target: torso (front and back), including groin flap. Right of way (priority): attack has priority over counter-attack. Simultaneous actions analyzed for priority — only the attacker\'s touch scores.',
      'Épée: thrusting weapon. Valid target: entire body. No priority — both fencers can score simultaneously (double touch) if touches land within 25 ms of each other.',
      'Sabre: cutting and thrusting weapon. Valid target: everything above the waist (torso, arms, head, mask). Right of way (priority) applies similarly to foil. Actions are faster and more explosive.',
      'Electronic scoring: weapon tip (foil/épée) or blade/tip (sabre) completes an electrical circuit when touching valid target. Colored light for on-target, white/off-color for off-target (foil only — off-target touches in foil stop the action).',
    ],
    scoring: 'Each valid touch = 1 point. Individual: first to 15 touches or most touches after 3 periods. Team: relay format (9 bouts of 3 minutes each, score accumulates to maximum 45 touches).',
    violations: [
      'Group 1 (yellow card warning, then red card = 1 touch against): covering valid target with non-target hand, turning back to opponent, jostling',
      'Group 2 (red card = 1 touch against immediately): brutal action, deliberate body contact, refusal to obey referee',
      'Group 3 (black card = expulsion): fraud, unsportsmanlike conduct of serious nature, doping',
      'Passivity: after 1 minute of non-combativity, P-cards (priority determined by coin flip for the remaining time)',
    ],
    safety: 'All equipment must pass FIE safety testing. Jacket and breeches must resist 800 N of penetration force. Mask must pass 12 kg punch test. Plastron (underarm protector) required under jacket. Chest protectors mandatory for women, recommended for men. Broken blade protocol: immediate halt, blade replaced.',
  },
  // ── Water Sports (6) ───────────────────────────────────────
  {
    name: 'Diving', org: 'World Aquatics', category: 'Water Sports',
    file: 'WorldAquatics_Diving_Rules.html',
    tags: ['olympic','professional','diving','world aquatics','springboard','platform'],
    intro: `Diving has been an Olympic sport since 1904 (men) and 1912 (women). World Aquatics governs the sport under the <strong>World Aquatics Diving Rules (DR)</strong>. Olympic events include 3 m Springboard and 10 m Platform for both men and women, plus Synchronized 3 m Springboard and Synchronized 10 m Platform. Divers perform acrobatic maneuvers from the springboard or platform, and are judged on takeoff, flight, and entry. The sport requires exceptional body control, spatial awareness, and courage.`,
    equipment: { items: [
      { name: 'Springboard', spec: '3 m height above water surface. Board length 4.87 m (16 ft), width 0.5 m (1.6 ft). Made of aluminum alloy with adjustable fulcrum for flexibility. Non-slip surface coating.' },
      { name: 'Platform', spec: '10 m height above water surface. Platform length minimum 6 m (19.7 ft), width minimum 2 m (6.6 ft). Rigid concrete or similar structure with non-slip surface. 5 m and 7.5 m platforms also available for training/junior competition.' },
      { name: 'Swimwear', spec: 'Competitive swimwear conforming to World Aquatics regulations. No loose-fitting or excessive fabric.' },
      { name: 'Chamois', spec: 'Small synthetic shammy towel used to dry skin between dives. Helps maintain grip for takeoff.' },
    ]},
    area: { desc: 'Diving takes place in a purpose-built diving well.', specs: [
      'Pool depth minimum 5 m (16.4 ft) for 10 m platform',
      'Pool depth minimum 3.5 m (11.5 ft) for 3 m springboard',
      'Surface agitation system (bubbles or spray) to help divers see the water surface',
      'Hot tub/shower area near pool for divers to stay warm between dives',
      'Dry-land training facility with harness systems for practicing new dives',
    ]},
    players: { desc: 'Individual and synchronized (pairs). Synchronized: both divers perform the same dive simultaneously. Judging panel: 7 judges for individual events (highest and lowest dropped, 5 counting), 11 judges for synchronized (execution + synchronization panels). Referee oversees competition.' },
    rules: [
      'Individual events: preliminary round, semifinal, final. Men\'s platform: 6 dives in the final. Women\'s platform: 5 dives. Springboard: 5 dives (women), 6 dives (men). Some dives have limited difficulty (DD) in preliminary rounds.',
      'Dive groups: Forward (1xx), Back (2xx), Reverse (3xx), Inward (4xx), Twisting (5xx), Armstand (6xx, platform only). Each dive has a numerical code identifying group, number of somersaults, and number of twists.',
      'Positions: Tuck (C) — body folded; Pike (B) — body bent at waist, legs straight; Straight (A) — body extended; Free (D) — combination of positions.',
      'Degree of Difficulty (DD): calculated based on number of somersaults, twists, position, and starting position. Range approximately 1.2 to 4.1+.',
      'Synchronized diving: pairs judged on both individual execution (3 judges per diver) and synchronization (5 judges). Synchronization assessed on takeoff, flight, and entry timing.',
    ],
    scoring: 'Each judge awards 0–10 in half-point increments. Individual: highest and lowest marks dropped, remaining 5 multiplied by DD and divided by 5, then multiplied by 3. Final score = sum of all dive scores. Synchronized: execution marks (3 per diver) + synchronization marks (5 judges), calculated with DD.',
    violations: [
      'Failed dive: dive significantly differs from announced dive — scored 0',
      'Balk (false start on springboard): first balk — referee deduction of 2 points. Second balk — dive scored 0.',
      'Standing on platform for more than the allowed time: referee warns, then potential 0 score',
      'Incorrect starting position: judge deduction',
    ],
    safety: 'Surface agitation mandatory to break water surface tension. Pool depth must meet minimums for each platform height. Medical team on-site with spinal injury equipment. Dry-land training with overhead spotting rigs for new dives. Cold water spray or bubble machines ensure divers can see the water surface.',
  },
  {
    name: 'Water Polo', org: 'World Aquatics', category: 'Water Sports',
    file: 'WorldAquatics_Water_Polo_Rules.html',
    tags: ['olympic','professional','water polo','world aquatics'],
    intro: `Water polo has been an Olympic sport since the 1900 Paris Games, making it one of the oldest Olympic team sports. Women's water polo was added in 2000. World Aquatics governs the sport under the <strong>World Aquatics Water Polo Rules (WP)</strong>. Played in a pool between two teams of seven players (six field players + one goalkeeper), water polo combines swimming, ball handling, and tactical play. Often described as one of the most physically demanding sports, players tread water for the entire match.`,
    equipment: { items: [
      { name: 'Ball', spec: 'Circumference 68–71 cm (26.8–28 in) for men, 65–67 cm (25.6–26.4 in) for women. Weight 400–450 g (14.1–15.9 oz) for men, 350–400 g (12.3–14.1 oz) for women. Waterproof, non-absorbent, inflated to 90–97 kPa (13–14 psi). (WP Rule 3)' },
      { name: 'Caps', spec: 'Numbered caps secured with chin straps. Blue caps for one team, white for the other. Goalkeeper wears red cap (#1 or #13). Ear guards integrated into caps.' },
      { name: 'Goals', spec: 'Width 3 m (9.84 ft) between inner edges of posts. Crossbar underside 0.90 m (2.95 ft) above water surface (water depth ≥1.50 m / 4.92 ft). Net attached to goal frame. Goals anchored or floating.' },
    ]},
    area: { desc: 'Played in a regulation water polo pool or defined area within a larger pool.', specs: [
      'Field of play: 30 m × 20 m (98.4 ft × 65.6 ft) for men, 25 m × 20 m (82 ft × 65.6 ft) for women',
      'Minimum water depth: 1.80 m (5.9 ft), preferably 2.0 m (6.6 ft) — players must not touch the bottom',
      'Distance markings: 2 m line (red), 5 m line (yellow), 6 m penalty line, half-distance line (white)',
      'Re-entry area: designated area at each end for players returning from exclusion',
    ]},
    players: { desc: '7 players per team in the water (6 field players + 1 goalkeeper). Roster maximum 13. Unlimited substitutions from the re-entry area. Officials: 2 referees (one on each side of the pool), goal judges, timekeepers, secretaries.' },
    rules: [
      'Match duration: 4 periods × 8 minutes of actual playing time (clock stops on every whistle). 2 minutes between periods.',
      'Possession: 30-second shot clock per possession. Team must shoot before the shot clock expires or possession is turned over.',
      'Ball handling: only the goalkeeper may use two hands on the ball. Field players must handle the ball with one hand (except the goalkeeper within 5 m of own goal). Players may not push the ball under water.',
      'Movement: players swim and tread water throughout the game. No standing on the bottom. Intentional splashing in the face of an opponent is a foul.',
      'Set position play: "center forward" (hole set) positions in front of the goal with a defender behind. Much play develops from this position.',
    ],
    scoring: 'A goal is scored when the entire ball crosses the goal line between the posts and under the crossbar. Goals may be scored from anywhere in the field of play. Penalty throws are taken from the 5 m line.',
    violations: [
      'Ordinary foul: free throw to opposing team (impeding, holding ball underwater, taking ball underwater, pushing off opponent)',
      'Exclusion foul (personal foul): 20-second exclusion penalty — player leaves pool for 20 seconds or until a goal is scored or possession changes. Examples: holding/sinking an opponent not holding the ball, interfering with a free throw.',
      '3 exclusion fouls: player permanently excluded, substitute may enter after 20 seconds.',
      'Penalty foul: penalty throw from 5 m line. Awarded for fouls preventing a probable goal within the 5 m area.',
      'Brutality: permanent exclusion with no substitution for 4 minutes of actual play. Red card for violent actions.',
    ],
    safety: 'Minimum water depth enforced to prevent foot-touching injuries. Officials monitor for dangerous play (elbows, kicks under water). Medical team poolside. Concussion protocols apply. Players must trim fingernails. No jewelry or hard hair accessories.',
  },
  {
    name: 'Rowing', org: 'World Rowing', category: 'Water Sports',
    file: 'WorldRowing_Rules.html',
    tags: ['olympic','professional','rowing','world rowing','fisa'],
    intro: `Rowing has been an Olympic sport since the 1900 Paris Games. World Rowing (formerly FISA) governs the sport under the <strong>World Rowing Rules of Racing</strong>. Olympic events include sculling (two oars per rower) and sweep (one oar per rower) disciplines: Single Sculls (1x), Double Sculls (2x), Quadruple Sculls (4x), Pair (2-), Four (4-), Eight (8+), and Lightweight Double Sculls. Racing takes place over a 2000 m straight course.`,
    equipment: { items: [
      { name: 'Boat (Shell)', spec: 'Minimum weights: Single 14 kg (30.9 lb), Double/Pair 27 kg (59.5 lb), Quad/Four 52 kg (114.6 lb), Eight 96 kg (211.6 lb). Boats constructed from carbon fiber, kevlar, or honeycomb composites. Maximum beam width varies by class. Bow ball (rubber safety ball) mandatory.' },
      { name: 'Oars', spec: 'Sculling oars: approximately 285–295 cm (9.4–9.7 ft). Sweep oars: approximately 370–385 cm (12.1–12.6 ft). Blade shapes: cleaver (hatchet) or Macon. Carbon fiber shafts standard.' },
      { name: 'Cox Box', spec: 'Electronic amplification system for the coxswain. Includes stroke rate meter and timer. Weight included in coxswain minimum weight.' },
    ]},
    area: { desc: 'Racing on a straight, sheltered body of water.', specs: [
      'Race distance: 2000 m (6562 ft) for all Olympic events',
      'Course: 6 lanes minimum, each 13.5 m (44.3 ft) wide',
      'Water conditions: calm, minimal current. Course aligned to minimize wind advantage',
      'Buoy lines: plastic buoys every 10 m marking lane boundaries',
      'Start: Albano start system (fixed alignment platforms) or stakeboats',
    ]},
    players: { desc: 'Crew sizes: 1 (single), 2 (pair/double), 4 (four/quad), 8 (eight). Eight includes coxswain (cox) who steers and calls commands. Minimum coxswain weight: 55 kg (121.3 lb) regardless of gender. Lightweight category: men max 72.5 kg (159.8 lb) per rower, 70 kg (154.3 lb) average; women max 59 kg (130.1 lb) per rower, 57 kg (125.7 lb) average. Umpires follow each race in a motorboat.' },
    rules: [
      'Start: all boats align at the start line. Start command: "Attention — Go" (or starting buzzer). False start: crew is warned (yellow flag). Two false starts by the same crew results in exclusion.',
      'Race format: heats, repechages (second chance), semifinals, and finals (A-final for medals, B-final for places 7–12, etc.).',
      'Steering: crews must stay in their assigned lane. A crew that enters another lane and gains advantage or interferes with another crew may be penalized.',
      'Lightweights: weigh-in conducted 1–2 hours before racing. Athletes must make weight individually and as a crew average.',
      'Coxswain: must steer the boat, may not impede other crews\' lanes, and weighs minimum 55 kg. Dead weight carried if underweight.',
    ],
    scoring: 'First to cross the finish line wins. Photo finish used for close results. Times recorded to 1/100th second.',
    violations: [
      'False start: warning (yellow flag). Two warnings = exclusion from race.',
      'Lane encroachment: warning or exclusion if it interferes with another crew.',
      'Equipment violation (boat under minimum weight): exclusion',
      'Unsportsmanlike conduct: warning or exclusion',
      'Doping: per World Rowing and WADA anti-doping rules',
    ],
    safety: 'Bow balls mandatory on all boats. Safety launches on course. All athletes must be able to swim. Personal flotation devices available on safety launches. Weather conditions (wind speed, wave height) monitored — racing postponed if conditions are dangerous.',
  },
  {
    name: 'Canoeing', org: 'ICF', category: 'Water Sports',
    file: 'ICF_Canoeing_Rules.html',
    tags: ['olympic','professional','canoeing','kayak','icf','canoe sprint','canoe slalom'],
    intro: `Canoeing has been an Olympic sport since 1936 (sprint) and 1972 (slalom). The International Canoe Federation (ICF) governs both disciplines under the <strong>ICF Canoe Sprint Competition Rules</strong> and <strong>ICF Canoe Slalom Competition Rules</strong>. Two Olympic disciplines: Canoe Sprint (flatwater racing in kayaks and canoes) and Canoe Slalom (whitewater gate racing). Sprint events are contested on a straight 200 m or 1000 m course. Slalom events are on an artificial or natural whitewater course. Canoe Slalom added Kayak Cross (extreme slalom) in 2024.`,
    equipment: { items: [
      { name: 'Kayak (K)', spec: 'Sprint K1: maximum length 520 cm (204.7 in), minimum weight 8 kg (17.6 lb). K2: max 650 cm (255.9 in), min 12 kg (26.5 lb). K4: max 1100 cm (433.1 in), min 30 kg (66.1 lb). Double-bladed paddle. Athlete sits facing forward. Slalom K1: max 350 cm (137.8 in), min 9 kg (19.8 lb).' },
      { name: 'Canoe (C)', spec: 'Sprint C1: max 520 cm (204.7 in), min 10 kg (22 lb). C2: max 650 cm (255.9 in), min 14 kg (30.9 lb). Single-bladed paddle. Athlete kneels. Slalom C1: max 350 cm (137.8 in), min 8 kg (17.6 lb).' },
      { name: 'Helmet', spec: 'Mandatory for Canoe Slalom and Kayak Cross. Must meet ICF safety standards.' },
      { name: 'PFD/Buoyancy Aid', spec: 'Mandatory for Canoe Slalom. Minimum buoyancy 6 kg (13.2 lb). Must be worn at all times on the water.' },
    ]},
    area: { desc: 'Sprint and slalom have distinct venue requirements.', specs: [
      'Sprint: straight course, 200 m or 1000 m. 9 lanes, each 9 m (29.5 ft) wide. Minimum water depth 3 m (9.8 ft). Wind-protected venue preferred.',
      'Slalom: whitewater course 200–400 m (656–1312 ft) long. Artificial or natural river. 18–25 gates (6 upstream, rest downstream). Gate width minimum 1.2 m (3.9 ft). Water flow rate varies by venue.',
      'Kayak Cross: modified slalom course, 4 paddlers racing simultaneously, approximately 300 m.',
    ]},
    players: { desc: 'Sprint: K1 (single kayak), K2 (double kayak), K4 (quad kayak), C1 (single canoe), C2 (double canoe). Slalom: K1, C1. Kayak Cross: K1 (head-to-head racing). Sprint officials: starter, aligner, finish judges, umpires in motorboats. Slalom officials: gate judges at each gate, section judges, chief judge.' },
    rules: [
      'Sprint: boats start from fixed alignment system. Standing start. Race over 200 m or 1000 m. Heats, semifinals, finals format. Crew must remain in own lane.',
      'Slalom: timed run through gates. Green/white gates: negotiate downstream. Red/white gates: negotiate upstream. Paddler\'s head must pass through gate between the poles. Time penalties for gate touches or misses.',
      'Kayak Cross: 4 paddlers race simultaneously on a modified slalom course. Rolling start from a ramp. Contact allowed but deliberate obstruction prohibited. First and second advance to next round.',
      'Sprint false start: one warning, second = exclusion.',
    ],
    scoring: 'Sprint: first to finish wins. Photo finish. Times to 1/1000th. Slalom: course time + penalty seconds. 2-second penalty per gate touch, 50-second penalty per missed/incorrect gate. Lowest total time wins. Kayak Cross: placement (first/second advance).',
    violations: [
      'Sprint: lane violation, false start (2nd), interference with another crew — warning or exclusion',
      'Slalom gate touch: 2-second penalty per touch (one or both poles)',
      'Slalom missed gate: 50-second penalty',
      'Slalom incorrect negotiation (passing gate from wrong direction): 50-second penalty',
      'Kayak Cross: deliberate obstruction — disqualification from heat',
    ],
    safety: 'PFDs mandatory in slalom. Helmets mandatory in slalom and Kayak Cross. Safety kayakers positioned throughout slalom course. Sprint: rescue boats on standby. All athletes must demonstrate swimming ability. Water quality monitored.',
  },
  {
    name: 'Sailing', org: 'World Sailing', category: 'Water Sports',
    file: 'WorldSailing_Racing_Rules.html',
    tags: ['olympic','professional','sailing','world sailing','isaf','regatta'],
    intro: `Sailing has been an Olympic sport since 1900. World Sailing (formerly ISAF) governs the sport under the <strong>Racing Rules of Sailing (RRS)</strong>, updated every four years with the latest edition effective 2025–2028. Olympic sailing features multiple boat classes, with the 2024 Paris Olympics including 10 events across classes such as ILCA 6, ILCA 7, 49er, 49erFX, Nacra 17 (mixed multihull), 470, IQFoil (windsurfing), and Formula Kite. The sport combines tactical racing, weather reading, and boat handling.`,
    equipment: { items: [
      { name: 'Boats', spec: 'Olympic classes are one-design (identical boats). Key classes: ILCA 7 (men\'s singlehanded dinghy, 4.23 m / 13.9 ft), ILCA 6 (women\'s singlehanded), 49er/49erFX (skiff, 4.99 m / 16.4 ft), 470 (two-person dinghy, 4.70 m / 15.4 ft), Nacra 17 (catamaran, 5.25 m / 17.2 ft, foiling), IQFoil (windsurf board), Formula Kite (kite-powered foiling board).' },
      { name: 'Life Jacket/PFD', spec: 'Personal flotation device mandatory at all times while racing. Minimum buoyancy per World Sailing equipment rules.' },
      { name: 'Safety Equipment', spec: 'Knife or line cutter, whistle, bailer/pump (dinghy classes), VHF radio (keelboat classes). Specific requirements per class rules.' },
    ]},
    area: { desc: 'Racing on open water courses marked by temporary buoys.', specs: [
      'Course types: Windward/Leeward (upwind mark to downwind mark), Triangle, Trapezoid. Course set by race committee based on wind direction.',
      'Course length varies by class and wind conditions. Typical leg length 1–2 nautical miles.',
      'Starting line: between a committee boat and a pin end mark. Approximately 10–20% longer than the fleet width.',
      'Finish line: between a committee boat and a mark.',
    ]},
    players: { desc: 'Crew sizes vary by class: 1 (singlehanded), 2 (double), 2 (mixed in Nacra 17). Race Committee: Principal Race Officer, course-setting team, mark boats, safety boats. International Jury: resolves protests without appeal. Protest hearings are a formal process under RRS Part 5.' },
    rules: [
      'Start: 5-minute starting sequence with visual and sound signals. Boats must be behind the starting line when the start signal is given. Premature starters must return and restart.',
      'Right of way: Port tack gives way to starboard tack. Windward boat keeps clear of leeward boat. Boat astern keeps clear of boat ahead. Boat tacking or gybing keeps clear.',
      'Mark rounding: boats overlapped at the zone (3 hull lengths from the mark) must give each other room to round. Inside boat has right to room.',
      'Protests: filed in writing within protest time limit. Heard by jury/protest committee. Penalties range from scoring penalty to disqualification.',
      'Medal Race (Olympic format): final race with double points. Top 10 boats from the opening series qualify. Medal Race result added to series score to determine final standings.',
      'Scoring: Low Point system — 1 point for first, 2 for second, etc. Worst result(s) discarded after minimum races sailed. Lowest total wins.',
    ],
    scoring: 'Low Point System: finishing place = points (1st = 1 pt, 2nd = 2 pts, etc.). DNF/DSQ/DNS = entries + 1 point. Series score = sum of race points minus discards. Medal Race scores doubled.',
    violations: [
      'Rule 42 (propulsion): no pumping, rocking, or ooching to propel the boat except by wind and water action. Penalty: DSQ for that race.',
      'Touching a mark: one-turn penalty (360° turn) if executed promptly.',
      'Premature start (OCS): boat must return to pre-start side and restart. Failure to return: DSQ.',
      'Black Flag: under black flag starting penalty, premature starters are immediately DSQ without hearing.',
      'Protest: boats involved in an incident may protest. If found at fault by the jury, the penalty is typically DSQ for that race.',
    ],
    safety: 'PFDs mandatory at all times on the water. Safety boats on course for rescue. Weather monitoring — racing abandoned if wind exceeds class-specific limits (typically 25+ knots for dinghies). All sailors must pass a swimming test. VHF communication between race committee and safety fleet.',
  },
  {
    name: 'Surfing', org: 'ISA', category: 'Water Sports',
    file: 'ISA_Surfing_Rules.html',
    tags: ['olympic','professional','surfing','isa','shortboard'],
    intro: `Surfing debuted as an Olympic sport at the 2020 Tokyo Games. The International Surfing Association (ISA) governs the sport under the <strong>ISA Rulebook</strong>, while the World Surf League (WSL) governs the professional tour. Olympic surfing features shortboard events for men and women. Athletes ride ocean waves and are judged on their performance across multiple criteria including commitment, degree of difficulty, innovation, variety, speed, power, and flow. The sport is unique among Olympic sports in being conducted entirely in the ocean with variable natural conditions.`,
    equipment: { items: [
      { name: 'Surfboard', spec: 'Shortboard: typically 5\'6"–6\'6" (168–198 cm) length. Three-fin (thruster) setup standard. No minimum or maximum dimensions in ISA rules, but must be deemed safe by judges. Fins must not have sharp edges. Board must have a leash attachment point.' },
      { name: 'Leash', spec: 'Leg rope/leash mandatory. Connects the surfboard to the surfer\'s ankle or calf. Must be in good condition with no fraying.' },
      { name: 'Rashguard/Jersey', spec: 'Color-coded competition jersey (lycra rashguard). Colors assigned to distinguish surfers: typically red, white, blue, yellow. Must be worn over any wetsuit.' },
      { name: 'Wetsuit', spec: 'Optional, depending on water temperature. No restrictions on thickness or type.' },
    ]},
    area: { desc: 'Competition takes place in the ocean on natural waves.', specs: [
      'Competition zone: defined area in the ocean marked by flags and/or buoys',
      'Wave height: minimum 1 m (3.3 ft) for competition to run. Ideal 1.5–3 m (5–10 ft)',
      'Beach break, point break, or reef break — venue-dependent',
      'Waiting period: competition window of several days to catch the best wave conditions',
      'Olympic venue: Teahupo\'o, Tahiti (2024), variable for future Games',
    ]},
    players: { desc: 'Individual competition. Heats of 2–4 surfers simultaneously. Head Judge leads a panel of 5 judges (highest and lowest scores dropped, 3 counting). Priority system determines who has right of way on a wave.' },
    rules: [
      'Heat format: 20–35 minutes depending on conditions. Each surfer catches as many waves as possible. Best 2 wave scores count toward heat total.',
      'Priority: determined by order of wave-catching. After catching a wave, a surfer goes to lowest priority. The surfer with highest priority has first choice of waves.',
      'Interference: surfer without priority may not ride a wave being ridden by the priority surfer, paddle into their path, or obstruct their ride. Interference results in the offender\'s second-best score being halved.',
      'Judging criteria: commitment and degree of difficulty (proportion relative to wave size and conditions), innovative and progressive maneuvers, combination of major maneuvers, variety of maneuvers, speed, power, and flow.',
      'Scoring range: 0.0–10.0 per wave in 0.1 increments. 0.0–1.9: poor, 2.0–3.9: fair, 4.0–5.9: average, 6.0–7.9: good, 8.0–10.0: excellent.',
    ],
    scoring: 'Heat score = sum of best 2 wave scores (maximum 20.0). Highest heat score wins and advances. Rounds: Round of 32 → Round of 16 → Quarterfinals → Semifinals → Medal matches.',
    violations: [
      'Interference: second-best wave score is halved. Second interference in the same heat: second-best score reduced to zero.',
      'Unsportsmanlike conduct: may result in heat disqualification',
      'Paddling for a wave without priority when priority surfer is paddling: interference if it affects the priority surfer',
      'Excessive time in the competition zone without catching waves: no penalty, but strategy risk',
    ],
    safety: 'Water safety team (jet ski rescue) on standby at all times. Lifeguards positioned on the beach and in the water. Competition paused for shark sightings or dangerous conditions (lightning, extreme currents). Surfers must be competent ocean swimmers. Board and fin inspections before competition.',
  },
  // ── Individual Sports (9 additions) ────────────────────────
  {
    name: 'Cycling', org: 'UCI', category: 'Individual Sports',
    file: 'UCI_Cycling_Rules.html',
    tags: ['olympic','professional','cycling','uci','road','track','bmx','mountain bike'],
    intro: `Cycling has been an Olympic sport since the first modern Games in 1896. The Union Cycliste Internationale (UCI) governs all disciplines under the <strong>UCI Regulations</strong>. Olympic cycling includes four disciplines: Road (road race, time trial), Track (sprint, team sprint, keirin, team pursuit, madison, omnium), BMX (racing and freestyle), and Mountain Bike (cross-country). The UCI regulates bicycle specifications, race formats, anti-doping, and safety standards across all competitive cycling.`,
    equipment: { items: [
      { name: 'Road Bicycle', spec: 'Double triangle frame. Minimum weight 6.8 kg (15 lb). Maximum saddle-to-bar drop regulated. No aerodynamic fairings. Wheels: maximum 80 mm rim depth for road race, disc wheels permitted for time trial rear wheel. UCI Type-Approved frame required.' },
      { name: 'Track Bicycle', spec: 'Fixed gear (no freewheel), no brakes. Minimum weight 6.8 kg (15 lb). Disc rear wheel permitted. Handlebar extensions for pursuit/time trial events. Drop bars for sprint events.' },
      { name: 'Helmet', spec: 'Mandatory in all disciplines. Road/Track: aerodynamic helmet with rear coverage. BMX: full-face helmet mandatory. Mountain Bike: enduro-style helmet with extended rear coverage.' },
      { name: 'BMX Bicycle', spec: 'Racing: 20-inch wheels, single speed. Freestyle: 20-inch wheels, pegs, gyro braking system. No minimum weight restriction for BMX.' },
    ]},
    area: { desc: 'Venues vary by discipline.', specs: [
      'Road Race: public roads, typical Olympic distance 230–240 km (143–149 mi) men, 130–140 km (81–87 mi) women',
      'Time Trial: individual against the clock, 30–40 km (19–25 mi) men, 25–35 km (16–22 mi) women',
      'Track: velodrome with 250 m banked oval (standard Olympic size), surface: wooden or synthetic',
      'BMX Racing: 300–400 m (984–1312 ft) course with jumps, berms, starting hill 8 m (26 ft) height',
      'BMX Freestyle: park course with bowls, ramps, quarter-pipes, spines',
      'Mountain Bike XCO: 4–6 km loop, 1h15–1h30 race time, technical terrain',
    ]},
    players: { desc: 'Road: teams and individuals. Track: individual and team events. BMX: individual. MTB: individual. Officials: commissaires (referees), finish judges, timekeepers. Photo finish and transponder timing standard.' },
    rules: [
      'Road Race: mass start. Tactics include peloton riding, breakaways, sprints. Drafting (slipstreaming) is legal and central to tactics. First across the finish line wins.',
      'Time Trial: individual start at intervals (typically 90 seconds). No drafting — riders must maintain distance. Fastest time wins.',
      'Track Sprint: 2–3 laps, only last 200 m timed. Tactical cat-and-mouse riding in early laps. Match sprint format (best of 3 races).',
      'Track Team Pursuit: 2 teams of 4 riders on opposite sides of the track. 4 km (men), 4 km (women). Team time = 3rd rider crossing the line. Fastest time or catching the opposing team wins.',
      'BMX Racing: 8 riders per heat, gate start from 8 m hill. 3 rounds of heats, quarterfinals, semifinals, final. First across line advances.',
      'BMX Freestyle: 1-minute runs judged on difficulty, execution, originality, height, style. Best run counts.',
    ],
    scoring: 'Road/Time Trial/Track/BMX Racing: time or placement. BMX Freestyle: judges\' scores (0–100). Track Omnium: points accumulated across 4 events (scratch race, tempo race, elimination race, points race).',
    violations: [
      'Drafting in time trial: disqualification',
      'Equipment violation (bike weight, dimensions): start refusal or disqualification',
      'Dangerous riding: relegation, disqualification, or fine',
      'Motor doping (mechanical fraud): lifetime ban under UCI regulations',
      'Track: riding above the sprinters\' line inappropriately in team pursuit: relegation',
    ],
    safety: 'Helmet mandatory in all disciplines. Motorcade and vehicle management on road courses. Crash barriers at track events. BMX: full-face helmet, long sleeves, long pants, gloves mandatory. Medical support vehicles on course. Neutral service cars/motorcycles on road courses.',
  },
  {
    name: 'Equestrian', org: 'FEI', category: 'Individual Sports',
    file: 'FEI_Equestrian_Rules.html',
    tags: ['olympic','professional','equestrian','fei','dressage','show jumping','eventing'],
    intro: `Equestrian sports have been part of the Olympics since 1900 (polo) and in their modern form since 1912. The Fédération Equestre Internationale (FEI) governs the sport under the <strong>FEI General Regulations and discipline-specific rules</strong>. Olympic equestrian includes three disciplines: Dressage, Show Jumping, and Eventing (three-day event combining dressage, cross-country, and show jumping). Uniquely, equestrian is the only Olympic sport where men and women compete against each other on equal terms, and the only sport involving an animal athlete.`,
    equipment: { items: [
      { name: 'Horse', spec: 'Any breed eligible. Minimum age: 9 years for Olympic Dressage, 9 years for Eventing, 9 years for Show Jumping. Horses must hold a valid FEI passport and pass veterinary inspections (horse inspection/jog). FEI Equine Anti-Doping and Controlled Medication Regulations apply.' },
      { name: 'Saddle', spec: 'Dressage: deep-seated dressage saddle. Show Jumping: forward-seat jumping saddle. Eventing: all-purpose or specific saddles for each phase. No weight restrictions on saddle.' },
      { name: 'Helmet', spec: 'ASTM/SEI or equivalent certified riding helmet mandatory at all times when mounted. Must have a fixed harness. No modification allowed.' },
      { name: 'Attire', spec: 'Dressage: shadbelly (tailcoat) or short jacket, white breeches, top hat or helmet. Show Jumping: show jacket, white or beige breeches, helmet. Eventing XC: body protector (BETA Level 3) mandatory, medical armband with contact info.' },
    ]},
    area: { desc: 'Venues vary by discipline.', specs: [
      'Dressage arena: 60 m × 20 m (197 ft × 66 ft). Letters placed around the perimeter for movements (A, K, E, H, C, M, B, F). Surface: sand or specialized footing.',
      'Show Jumping ring: minimum 2500 m² (26,910 ft²) for Olympic competition. 10–16 obstacles with 12–15 jumping efforts. Maximum fence height 1.60 m (5.25 ft) for individual Grand Prix.',
      'Eventing Cross-Country: 5700–6270 m (3.5–3.9 mi) course. 25–40 jumping efforts. Fixed obstacles (logs, ditches, water, banks). Maximum fence height 1.20 m (3.9 ft), maximum spread 1.80 m (5.9 ft).',
    ]},
    players: { desc: 'Individual and team events. Dressage judged by 5–7 judges at positions around the arena. Show Jumping: 1 course designer, multiple judges monitoring faults. Eventing: course designer, fence judges at each obstacle, veterinary officials. Veterinary inspections before and during competition.' },
    rules: [
      'Dressage: rider performs a prescribed test of movements (walk, trot, canter, piaffe, passage, pirouettes, flying changes, extended gaits). Movements scored 0–10 by each judge. Freestyle (Grand Prix Freestyle) includes music and choreography.',
      'Show Jumping: horse and rider navigate a course of colored fences within a time allowed. Faults: 4 penalties per knocked rail, 1 penalty per second over time allowed. Jump-off for tied competitors (shortened course, fastest clear round wins).',
      'Eventing: 3 phases scored cumulatively. Dressage phase: percentage-based scoring converted to penalty points. Cross-Country: time penalties (0.4 penalty per second over optimum time) + 20 penalties per refusal (3 refusals = elimination). Show Jumping: same fault system as show jumping.',
      'Horse welfare: FEI Code of Conduct for the Welfare of the Horse. Blood rule: horse with blood must be inspected by veterinarian; may be eliminated if blood is caused by rider\'s equipment.',
    ],
    scoring: 'Dressage: percentage score (average of judges\' marks / maximum marks × 100). Higher is better. Show Jumping: fewest faults wins, then fastest time. Eventing: lowest total penalty score wins (dressage penalties + XC penalties + SJ penalties).',
    violations: [
      'Dressage: error of course (wrong movement): 0.5% deduction first error, 1% second, elimination on third',
      'Show Jumping: knocked rail = 4 faults. Refusal (horse stops) = 4 faults. Second refusal = elimination. Fall of rider = elimination.',
      'Eventing XC: refusal = 20 penalties. Second refusal at same fence = 40 penalties. Third refusal = elimination. Fall of rider = elimination.',
      'Blood on horse flanks (from spur use): warning or elimination',
      'Excessive use of the whip: yellow card, elimination, or disqualification',
    ],
    safety: 'Body protector (BETA Level 3) mandatory for cross-country. Air vest recommended. Helmet mandatory at all times when mounted. Veterinary inspections monitor horse soundness. Course design reviewed for safety. Medical and veterinary teams on standby. Frangible/collapsible cross-country fences reduce horse fall risk.',
  },
  {
    name: 'Archery', org: 'World Archery', category: 'Individual Sports',
    file: 'WA_Archery_Rules.html',
    tags: ['olympic','professional','archery','world archery','wa','recurve'],
    intro: `Archery has been an Olympic sport intermittently since 1900, becoming a permanent fixture from 1972. World Archery (WA, formerly FITA) governs the sport under the <strong>World Archery Rulebook</strong> (Constitution and Rules). Olympic archery features recurve bow shooting at 70 m (229.7 ft) in individual and team events for both men and women, plus a mixed team event added in 2020. South Korea has been the dominant force in Olympic archery, particularly in women's competition.`,
    equipment: { items: [
      { name: 'Recurve Bow', spec: 'Only recurve bows permitted in Olympic competition. No compound bows. Maximum draw weight not regulated (typically 38–50 lb / 17–23 kg). Bow length typically 66–70 inches (168–178 cm). Stabilizers, sight (non-magnifying), clicker, arrow rest, and plunger permitted.' },
      { name: 'Arrows', spec: 'Maximum diameter 9.3 mm (0.37 in) shaft. Points must not damage targets excessively. All arrows marked with archer\'s name or initials. Fletching (vanes or feathers). Nocks. Maximum 6 arrows per end (3 per end in matchplay).' },
      { name: 'Protective Equipment', spec: 'Finger tab or glove for drawing. Arm guard (bracer) on bow arm. Chest guard optional. No binoculars or rangefinders permitted on the shooting line.' },
    ]},
    area: { desc: 'Outdoor competition on a flat, designated range.', specs: [
      'Distance: 70 m (229.7 ft) from shooting line to target face',
      'Target face: 122 cm (48 in) diameter for ranking round, 80 cm (31.5 in) for elimination rounds',
      'Target face: 10 concentric scoring rings. X-ring (inner 10): 12.2 cm (4.8 in) diameter for 122 cm face',
      'Shooting field: minimum width 5 m (16.4 ft) per target',
      'Safety zone: minimum 110 m (361 ft) behind targets, 25 m (82 ft) to each side',
    ]},
    players: { desc: 'Individual and team events (3 archers per team). Mixed team: 1 man + 1 woman. Officials: Director of Shooting, judges, timers. Shot clock enforced: 20 seconds per arrow (individual matchplay), 2 minutes for 6 arrows (ranking round). Arrows scored by judges with dispute resolution via measurement devices.' },
    rules: [
      'Ranking Round: 72 arrows shot in ends of 6 at 70 m. Total score (max 720) determines seedings for the elimination bracket.',
      'Individual Matchplay: set system — 5 sets of 3 arrows each. Winner of each set scores 2 set points, draw scores 1 each. First to 6 set points wins. If tied 5-5 after 5 sets, a single closest-to-center arrow (shoot-off) determines the winner.',
      'Team Matchplay: 4 sets of 6 arrows (2 per archer per set). Set scoring as individual. Tie at 5-5: each archer shoots 1 arrow, closest combined score to center wins.',
      'Mixed Team: 4 sets of 4 arrows (2 per archer per set). Same set scoring system.',
      'Shooting procedure: archers shoot alternately in matchplay (20 seconds per arrow). In ranking round, all archers shoot simultaneously in ends of 6 arrows (4 minutes per end).',
    ],
    scoring: '10-ring scoring: 10 (X-ring, inner gold), 10 (gold), 9, 8, 7, 6, 5, 4, 3, 2, 1. Arrow touching a ring line scores the higher value. Maximum score per end: 30 (3 arrows) or 60 (6 arrows). Maximum ranking round: 720.',
    violations: [
      'Shooting after time expires: arrow not scored (scored 0)',
      'Equipment failure during shooting: time allowance to repair (max 15 minutes)',
      'Shooting more arrows than allowed in an end: highest-scoring arrow(s) removed',
      'Unsportsmanlike conduct: warning, then removal from competition',
      'Using non-approved equipment: exclusion',
    ],
    safety: 'Red flag system: when red flag raised, no one may approach targets. Safety zone behind targets. Whistle system for shoot/stop commands. Medical team on-site. No nocking of arrows except on the shooting line when directed. Range closed during scoring and target face changes.',
  },
  {
    name: 'Shooting', org: 'ISSF', category: 'Individual Sports',
    file: 'ISSF_Shooting_Rules.html',
    tags: ['olympic','professional','shooting','issf','rifle','pistol','shotgun'],
    intro: `Shooting has been part of every modern Olympics since 1896 (except 1904 and 1928). The International Shooting Sport Federation (ISSF) governs the sport under the <strong>ISSF Official Statutes, Rules and Regulations</strong>. Olympic shooting includes three disciplines: Rifle (10 m Air Rifle, 50 m Rifle 3 Positions), Pistol (10 m Air Pistol, 25 m Rapid Fire Pistol), and Shotgun (Trap, Skeet). Mixed team events were added in 2020. India, China, South Korea, and European nations are traditionally strong.`,
    equipment: { items: [
      { name: 'Air Rifle', spec: '4.5 mm (.177 cal) calibre. Maximum weight 5.5 kg (12.1 lb). Overall length not restricted. No gas-powered or CO2-powered rifles in 10 m events — must be pre-charged pneumatic (PCP) or spring-piston. Aperture sights (non-magnifying) only. Electronic triggers permitted.' },
      { name: 'Sport Pistol / Air Pistol', spec: 'Air pistol: 4.5 mm calibre, single shot. Sport pistol (25 m Rapid Fire): .22 LR calibre, semi-automatic, 5-round magazine. Grip must not extend above the wrist. Trigger weight minimum varies by event.' },
      { name: 'Shotgun', spec: '12-gauge maximum. Trap and Skeet: semi-automatic or over-under. Maximum barrel length not restricted. Maximum ammunition load 24 g (0.85 oz) shot. Shot size maximum 2.5 mm (No. 7½).' },
      { name: 'Clothing', spec: 'Shooting jacket/trousers: maximum material thickness regulated. Jacket stiffness tested by ISSF gauge. No support beyond normal clothing. Shooting shoes: maximum sole height and stiffness regulated.' },
    ]},
    area: { desc: 'Indoor and outdoor ranges depending on discipline.', specs: [
      '10 m Air Rifle/Pistol: indoor range, electronic targets, 10 m (32.8 ft) distance',
      '50 m Rifle 3 Positions: outdoor or indoor range, 50 m (164 ft) distance',
      '25 m Rapid Fire Pistol: outdoor range, 25 m (82 ft) distance, 5 turning targets',
      'Trap: outdoor shotgun range, 15 machines arranged in a trench, shooting stations at 15 m (49 ft) from trench',
      'Skeet: outdoor range, 2 houses (high and low) releasing targets on intersecting flight paths, 8 shooting stations in a semicircle',
    ]},
    players: { desc: 'Individual and mixed team events. Officials: Range Officer (controls firing line), jury (equipment checks, rule interpretation), classifiers (score confirmation). Electronic scoring systems (EST) display scores instantly.' },
    rules: [
      '10 m Air Rifle: Qualification: 60 shots in 75 minutes. Final: 24 shots with elimination (lowest score eliminated after 2-shot series). Scoring: 10.9 maximum per shot (decimal scoring in finals).',
      '50 m Rifle 3 Positions: 3×40 shots (kneeling, prone, standing) in qualification. Final: elimination format with 3 positions.',
      '25 m Rapid Fire Pistol: 60 shots in qualification (30 precision + 30 rapid fire). Rapid fire series: 5 shots in 4 seconds. Final: elimination with rapid fire series.',
      'Trap: 125 targets in qualification (5 rounds of 25). Final: 50 targets. Targets launched at random angles from a trench. One shot per target.',
      'Skeet: 125 targets in qualification (5 rounds of 25). Final: 60 targets. Targets launched from high house and low house. Doubles: two targets simultaneously.',
    ],
    scoring: 'Qualification: integer scoring (10-ring, maximum 10 per shot). Finals: decimal scoring (10.0–10.9 per shot for rifle/pistol). Shotgun: hit (1) or miss (0). Elimination in finals: lowest-scoring athlete eliminated after each designated series.',
    violations: [
      'Equipment violation (jacket stiffness, trigger weight): equipment must be corrected or athlete cannot compete',
      'Safety violation (pointing firearm in unsafe direction, accidental discharge): range officer warning or disqualification',
      'Cross-firing (shooting at wrong target): shot scored as miss',
      'Exceeding time limit: shots after time scored as miss',
    ],
    safety: 'Range Officer has absolute authority over safety. Firearms pointed downrange at all times. Actions open (bolt open / cylinder open) when not on the firing line. Hearing protection mandatory. Eye protection mandatory for shotgun. No live ammunition outside designated areas. Range closed during scoring or maintenance.',
  },
  {
    name: 'Weightlifting', org: 'IWF', category: 'Individual Sports',
    file: 'IWF_Weightlifting_Rules.html',
    tags: ['olympic','professional','weightlifting','iwf','olympic lifting','clean and jerk','snatch'],
    intro: `Weightlifting has been an Olympic sport since 1896, with the modern format established at the 1920 Games. The International Weightlifting Federation (IWF) governs the sport under the <strong>IWF Technical and Competition Rules and Regulations (TCRR)</strong>. Olympic weightlifting consists of two lifts: the Snatch (one continuous movement from floor to overhead) and the Clean and Jerk (two movements — floor to shoulders, then shoulders to overhead). Athletes compete in weight categories, with the total of the best successful snatch and clean & jerk determining final ranking.`,
    equipment: { items: [
      { name: 'Barbell (Men)', spec: 'Bar weight 20 kg (44.1 lb). Bar length 220 cm (86.6 in). Diameter 28 mm (1.1 in). Rotating sleeves (collars) for plate loading.' },
      { name: 'Barbell (Women)', spec: 'Bar weight 15 kg (33.1 lb). Bar length 201 cm (79.1 in). Diameter 25 mm (0.98 in). Rotating sleeves.' },
      { name: 'Plates', spec: 'Bumper plates (rubber-coated): 25 kg (red), 20 kg (blue), 15 kg (yellow), 10 kg (green), 5 kg (white), 2.5 kg, 2 kg, 1.5 kg, 1 kg, 0.5 kg (change plates). Collars: 2.5 kg each.' },
      { name: 'Platform', spec: '4 m × 4 m (13.1 ft × 13.1 ft) competition platform. Non-slip wooden or composite surface. Surrounded by loading area.' },
      { name: 'Athlete Equipment', spec: 'Weightlifting shoes: maximum sole height 130 mm (5.1 in), minimum 3 mm (0.12 in). Weightlifting belt: maximum width 120 mm (4.7 in). Singlet: one-piece, must not cover elbows or knees. Wrist wraps: maximum 10 cm (3.9 in) wide. Knee sleeves: maximum 30 cm (11.8 in) long.' },
    ]},
    area: { desc: 'Competition takes place on a regulation platform.', specs: [
      'Platform: 4 m × 4 m (13.1 ft × 13.1 ft)',
      'Surface: wooden or synthetic non-slip material',
      'Warm-up area: separate room with multiple platforms and barbells',
      'Competition stage: elevated platform area for audience visibility',
    ]},
    players: { desc: 'Individual competition. Olympic weight categories: Men (61 kg, 73 kg, 89 kg, 102 kg, +102 kg), Women (49 kg, 59 kg, 71 kg, 81 kg, +81 kg). Officials: 3 referees (center referee + 2 side referees), jury of 3–5 for appeals. Each referee gives a white (good lift) or red (no lift) light. Majority decision (2 of 3).' },
    rules: [
      'Snatch: barbell lifted from the platform to overhead in one continuous movement. Athlete may split, squat, or power snatch. The barbell must be held overhead with arms fully extended, feet in line, until the referee signals "down."',
      'Clean and Jerk: two movements. Clean — barbell lifted to the shoulders (front rack position). Athlete stands fully. Jerk — barbell driven from shoulders to overhead (split jerk, squat jerk, or push jerk). Held until "down" signal.',
      'Each athlete gets 3 attempts in the snatch and 3 attempts in the clean & jerk. The best successful attempt from each lift is summed for the Total.',
      'Weight progression: minimum 1 kg increase between attempts. Athlete declares their opening weight before the session. Changes allowed per IWF rules (limited changes after initial declaration).',
      'Timing: athlete has 1 minute from name being called to initiate the lift (2 minutes if they are the same athlete attempting consecutively).',
      'Lifting order: lightest weight first. If same weight, athlete who declared first goes first.',
    ],
    scoring: 'Total = Best Snatch + Best Clean & Jerk. Highest total wins. Tiebreaker: lighter bodyweight at weigh-in. If still tied: athlete who reached the total first wins.',
    violations: [
      'Press-out: elbows visibly re-extend during the lift (no lift / red light)',
      'Dropping the barbell behind the plane of the body on a failed snatch: no lift',
      'Touch-and-go at the shoulders in clean & jerk (not fully standing before jerk): no lift',
      'Elbow touching the knees or thighs during the clean: no lift',
      'Lowering the barbell below the waist before the "down" signal: no lift',
      'Stepping off the platform: no lift',
    ],
    safety: 'Platform surface must be non-slip and clean. Chalk (magnesium carbonate) permitted. Bumper plates designed for dropping from overhead. Spotters/loaders position plates safely. Medical team on-site. Minimum age: 17 for senior international competition.',
  },
  {
    name: 'Triathlon', org: 'World Triathlon', category: 'Individual Sports',
    file: 'WorldTriathlon_Rules.html',
    tags: ['olympic','professional','triathlon','world triathlon','itu','ironman'],
    intro: `Triathlon became an Olympic sport at the 2000 Sydney Games. World Triathlon (formerly ITU) governs the sport under the <strong>World Triathlon Competition Rules</strong>. The Olympic triathlon consists of a 1.5 km swim, 40 km bike, and 10 km run (Olympic/Standard distance), completed consecutively without breaks. A Mixed Relay event was added in 2020 (each athlete completes a super-sprint: 300 m swim, 6.8 km bike, 2 km run). Drafting (riding in packs) is legal in Olympic triathlon, unlike in long-distance events.`,
    equipment: { items: [
      { name: 'Bicycle', spec: 'Road bicycle with standard frame geometry. Draft-legal format: no aero bars/clip-on extensions. Minimum weight not specified (UCI minimum does not apply). Helmet must be fastened before unracking the bike.' },
      { name: 'Wetsuit', spec: 'Mandatory if water temperature is below 20°C (68°F). Prohibited if water temperature exceeds 22°C (71.6°F). Optional between 20–22°C. Maximum thickness 5 mm at any point.' },
      { name: 'Race Number', spec: 'Front and back race numbers mandatory. Race belt permitted. Number visible at all times during run segment, on back during bike segment.' },
      { name: 'Helmet', spec: 'CPSC or equivalent certified helmet. Must be fastened before touching the bike, unfastened only after racking the bike. Penalty for unfastened helmet.' },
    ]},
    area: { desc: 'Three-discipline course with two transition areas.', specs: [
      'Swim: 1.5 km (0.93 mi) in open water (lake, river, or ocean). Water temperature measured at 60 cm depth.',
      'Bike: 40 km (24.9 mi) on public roads, typically a multi-lap circuit. Road closures required.',
      'Run: 10 km (6.2 mi) on paved surfaces, typically a multi-lap circuit.',
      'Transition 1 (T1): swim-to-bike. Transition 2 (T2): bike-to-run. Transition area: individually numbered racks.',
      'Mixed Relay: super-sprint format per leg (300 m swim, 6.8 km bike, 2 km run), relay tag zone.',
    ]},
    players: { desc: 'Individual and team/relay events. Up to 55 athletes in an Olympic individual event. Technical officials at transitions, course marshals on bike course, swim safety (kayaks, jet skis). Electronic chip timing.' },
    rules: [
      'Swim: mass start or wave start. Freestyle (any stroke). No pull buoys, paddles, snorkels, or flotation devices. Wetsuit rules based on water temperature.',
      'Bike: draft-legal at Olympic level — athletes may ride in packs. No aero bars in draft-legal races. Helmet must be buckled before unracking. Athletes must complete the entire bike course.',
      'Run: athletes must run or walk the entire course. No crawling. Bare feet permitted but not recommended.',
      'Transitions: athletes must rack their bike in their designated spot. No assistance from others in the transition area. Helmet must be fastened before unracking bike, unfastened only after racking bike.',
      'Penalties: stop-and-go penalties (typically 15 seconds for minor violations) served at a penalty box, usually on the bike or run course.',
    ],
    scoring: 'Finish time (swim + T1 + bike + T2 + run) determines ranking. First to cross the finish line wins. Mixed Relay: combined team time.',
    violations: [
      'Drafting violation (in non-drafting races): 15-second stop-and-go penalty',
      'Blocking: impeding another athlete — time penalty or disqualification',
      'Littering: 15-second penalty',
      'Helmet violation (unbuckled or not worn): time penalty or disqualification',
      'Outside assistance: disqualification',
      'Unsportsmanlike conduct: disqualification',
    ],
    safety: 'Swim safety: kayaks, jet skis, and lifeguards along the course. Athletes may rest by holding a kayak but may not make forward progress. Bike safety: motorbike marshals, lead and follow vehicles, medical motorcycles. Run: aid stations with water and sponges every 2.5 km. Medical staff at finish line.',
  },
  {
    name: 'Modern Pentathlon', org: 'UIPM', category: 'Individual Sports',
    file: 'UIPM_Modern_Pentathlon_Rules.html',
    tags: ['olympic','professional','modern pentathlon','uipm'],
    intro: `Modern pentathlon has been an Olympic sport since 1912, created by Pierre de Coubertin to test the skills of a 19th-century military courier. The Union Internationale de Pentathlon Moderne (UIPM) governs the sport under the <strong>UIPM Competition Rules</strong>. The sport underwent a major format change for the 2024 Paris Olympics, replacing the riding discipline with an obstacle course. The current Olympic format comprises five disciplines completed in a single day: Fencing, Swimming, Equestrian (through 2024)/Obstacle Course (from 2028), and the Laser Run (combined running and laser pistol shooting).`,
    equipment: { items: [
      { name: 'Fencing', spec: 'Épée (thrusting weapon). Standard FIE-approved épée. Electronic scoring. Full fencing protective equipment (mask, jacket, glove).' },
      { name: 'Swimming', spec: 'Standard competitive swimwear. Goggles permitted. No performance-enhancing swimwear beyond FINA/World Aquatics regulations.' },
      { name: 'Laser Pistol', spec: 'Laser pistol (no ammunition). Infrared beam hits electronic target. Pistol weight maximum 1.5 kg (3.3 lb). No restrictions on grip modification.' },
      { name: 'Running', spec: 'Standard running attire and shoes. Race number bib.' },
    ]},
    area: { desc: 'All five disciplines contested at one venue over one day.', specs: [
      'Fencing: standard fencing piste, round-robin format',
      'Swimming: 200 m freestyle in a 50 m or 25 m pool',
      'Obstacle Course (from 2028): ninja warrior-style course replacing equestrian',
      'Laser Run: 4 × 800 m running with 4 shooting series (5 targets per series) — combined finish',
      'Stadium: ideally all events in one venue for spectator experience',
    ]},
    players: { desc: 'Individual competition (36 athletes per Olympic event). Ranking determined across all 5 disciplines. Officials from each discipline\'s governing body. UIPM Technical Delegate oversees the overall competition.' },
    rules: [
      'Fencing (Ranking Round): one-touch épée bouts. Round-robin format — every athlete fences every other athlete. 1 minute per bout. Win = point scored. Draws: both athletes lose. Points converted to time bonus/deficit for Laser Run.',
      'Swimming: 200 m freestyle. Time converted to points (250 points = 2:30.00 baseline). Faster = more points, slower = fewer.',
      'Laser Run: athletes start in handicap order based on cumulative points from fencing + swimming. Leader starts first. 4 shooting series of 5 targets each, interspersed with 4 × 800 m running laps. 50-second time limit per shooting series. First across the finish line wins.',
      'Overall: the Laser Run is the final event, so the first athlete to cross the finish line wins the gold medal — a made-for-TV finish format.',
    ],
    scoring: 'Points system across all disciplines converted to time handicap for the Laser Run. Fencing: points based on win percentage. Swimming: time-based points. The Laser Run start order reflects cumulative performance — first across the line wins overall.',
    violations: [
      'Fencing: per FIE rules — corps-à-corps (body contact), covering target, etc.',
      'Swimming: per World Aquatics rules — false start, stroke violations',
      'Laser Run shooting: only laser pistol hits on the target count. Missing targets = time lost (must keep shooting until 5 hits or 50 seconds expire)',
      'Unsportsmanlike conduct: warning, point deduction, or disqualification',
    ],
    safety: 'Laser pistols are harmless (no projectile). Fencing equipment must pass safety checks. Swimming in regulated pool environment. Running course must be safe and well-marshalled. Medical team available throughout.',
  },
  {
    name: 'Sport Climbing', org: 'IFSC', category: 'Individual Sports',
    file: 'IFSC_Sport_Climbing_Rules.html',
    tags: ['olympic','professional','sport climbing','ifsc','bouldering','lead','speed'],
    intro: `Sport climbing debuted at the 2020 Tokyo Olympics and expanded to separate events at the 2024 Paris Games. The International Federation of Sport Climbing (IFSC) governs the sport under the <strong>IFSC Rules</strong>. Olympic climbing now features two events: Boulder & Lead Combined, and Speed. Bouldering involves solving short, difficult problems without ropes. Lead climbing involves ascending a tall wall with rope protection, judged by height reached. Speed is a head-to-head race up a standardized 15 m wall.`,
    equipment: { items: [
      { name: 'Climbing Shoes', spec: 'Specialized rubber-soled shoes with no maximum/minimum sole thickness. Must fit without modification to the hold surfaces. No mechanical aids in the shoes.' },
      { name: 'Harness', spec: 'Required for Lead and Speed. Standard climbing harness meeting EN 12277 or UIAA standards. Belay device and rope provided by organizers.' },
      { name: 'Chalk', spec: 'Magnesium carbonate (dry chalk) and liquid chalk permitted. Chalk bag worn on waist for lead climbing. No resin or tacky substances.' },
      { name: 'Rope (Lead/Speed)', spec: 'Dynamic climbing rope provided by organizers. 10–11 mm diameter. Belayed by trained staff. Auto-belay systems used in Speed climbing.' },
    ]},
    area: { desc: 'Purpose-built climbing walls.', specs: [
      'Speed wall: 15 m (49.2 ft) height, 5 degrees overhanging. Standardized route — identical holds and positions worldwide. Two lanes side by side for head-to-head racing.',
      'Lead wall: 12–15+ m (39–49+ ft) height. Varying angles of overhang. Route-set specifically for each competition. Time limit 6 minutes.',
      'Boulder wall: 4–4.5 m (13.1–14.8 ft) height. Safety mats below (no rope). Multiple problems (routes) set for each round. Each problem has a 4-minute time limit.',
    ]},
    players: { desc: 'Individual competition. Speed: head-to-head bracket. Boulder & Lead: qualification rounds + finals. Route setters design problems/routes specific to each competition. Judges at each boulder problem and on lead wall. Electronic timing for Speed (to 1/1000th second).' },
    rules: [
      'Speed: standardized wall. Head-to-head bracket (seeded by qualification times). Athletes must use an auto-belay. False start: one allowed per lane, second = loss. World record time approximately 4.9 seconds (men), 6.5 seconds (women).',
      'Bouldering: 4 problems in the final. 4-minute time limit per problem. Scored by tops (reaching the highest hold/finish) and zones (reaching an intermediate hold). Fewer attempts = better ranking.',
      'Lead: 6-minute time limit. One attempt only. Judged by highest hold reached. If the climber reaches the top, scored as TOP. Ranking: highest hold > furthest reach at that hold > fewer attempts.',
      'Combined: Boulder and Lead scores combined for a single ranking. Points-based system per discipline, summed for final ranking.',
      'Observation period: climbers given limited observation time to study routes/problems before the competition. No practice attempts on competition routes.',
    ],
    scoring: 'Speed: fastest time wins. Bouldering: most tops in fewest attempts > most zones in fewest attempts. Lead: highest hold reached. Combined: point-based ranking from both boulder and lead results summed.',
    violations: [
      'Using an artificial hold or feature not intended as a hold: attempt terminated',
      'Exceeding time limit: attempt terminated',
      'Speed false start: second false start = loss of that race',
      'Using a hold from an adjacent route: attempt terminated',
      'Receiving information from outside during isolation: warning or disqualification',
    ],
    safety: 'Ropes and auto-belays inspected before each session. Boulder mats: minimum thickness 40 cm (15.7 in). Certified belayers for lead climbing. Climbers in isolation before competition (no previewing routes via video/communication). Medical team on-site. Holds inspected for spinning or looseness before competition.',
  },
  {
    name: 'Skateboarding', org: 'World Skate', category: 'Individual Sports',
    file: 'WorldSkate_Skateboarding_Rules.html',
    tags: ['olympic','professional','skateboarding','world skate','street','park'],
    intro: `Skateboarding debuted at the 2020 Tokyo Olympics and is governed by World Skate under the <strong>World Skate Skateboarding Competition Rules</strong>. Two disciplines are contested at the Olympics: Street (replicating urban environments with stairs, rails, ledges, and gaps) and Park (bowl-shaped course with transitions, pools, and coping). Athletes perform tricks and are judged on difficulty, execution, originality, speed, and use of the course. The sport has deep roots in counter-culture and action sports, bringing a unique atmosphere to the Olympic Games.`,
    equipment: { items: [
      { name: 'Skateboard', spec: 'Street: typically 7.75–8.25 inch (19.7–21 cm) deck width. Park: typically 8.0–8.5 inch (20.3–21.6 cm) deck width. No restrictions on deck dimensions, truck width, wheel size, or bearing type. Board must be human-powered only.' },
      { name: 'Helmet', spec: 'Mandatory for Park discipline. Must meet CPSC, ASTM, or equivalent safety standards. Not required for Street (per World Skate rules, though national federations may require it).' },
      { name: 'Protective Pads', spec: 'Knee pads and elbow pads mandatory for Park discipline. Recommended for Street.' },
    ]},
    area: { desc: 'Purpose-built skateboarding courses.', specs: [
      'Street course: modular or permanent course replicating urban features. Includes stairs, handrails, ledges, banks, gaps, manual pads, and flat bars. Course area approximately 40 m × 25 m (131 ft × 82 ft).',
      'Park course: bowl/pool-based course with various transitions, hip transfers, extensions, coping, and deck areas. Course area approximately 30 m × 25 m (98 ft × 82 ft). Depth varies 1.5–3.5 m (5–11.5 ft).',
    ]},
    players: { desc: 'Individual competition. Qualification → Finals. Judging panel: 5 judges scoring 0–100. Highest and lowest scores dropped, remaining 3 averaged.' },
    rules: [
      'Street: Qualification and Finals each consist of 2 × 45-second runs + 5 single-trick attempts (best trick). Run scores: overall impression 0–100. Trick scores: single trick scored 0–100. Best 4 of 7 scores count (best run + best 3 tricks, or 4 best of anything).',
      'Park: 3 × 45-second runs. Best single run score counts. Scored on overall impression 0–100. Judging criteria: difficulty, execution, speed, flow, originality, use of course.',
      'Tricks: categorized by type — flip tricks, grinds/slides, grabs, aerials, transition tricks. Higher difficulty and clean execution = higher scores. Falls significantly reduce scores.',
      'Time management: athletes choose when to start their run within the competition window. Clock starts when the skater begins.',
    ],
    scoring: 'Overall impression scoring: 0–100. Panel of 5 judges, drop highest and lowest, average remaining 3. Street: best 4 of 7 scores (2 runs + 5 tricks). Park: best single run of 3 attempts.',
    violations: [
      'Exceeding time limit: run terminates when time expires',
      'Equipment failure during run: no restart — score is based on what was completed',
      'Starting before signal: restart required',
      'Unauthorized course modifications: warning or disqualification',
    ],
    safety: 'Helmet mandatory for Park. Pads (knee/elbow) mandatory for Park. Medical team on-site. Course inspected before each session. No foreign objects on course. Water/debris removed immediately.',
  },
  // ── Team Sports (2 additions) ──────────────────────────────
  {
    name: 'Handball', org: 'IHF', category: 'Team Sports',
    file: 'IHF_Handball_Rules.html',
    tags: ['olympic','professional','handball','ihf'],
    intro: `Handball has been an Olympic sport since 1972 (men) and 1976 (women). The International Handball Federation (IHF) governs the sport under the <strong>IHF Rules of the Game</strong> (latest edition August 2024). Handball is one of the most popular team sports globally, particularly in Europe. Played indoors between two teams of 7 (6 court players + 1 goalkeeper), the objective is to throw the ball into the opposing team\'s goal. The sport combines elements of basketball, soccer, and water polo with fast-paced, high-scoring action.`,
    equipment: { items: [
      { name: 'Ball', spec: 'Men: circumference 58–60 cm (22.8–23.6 in), weight 425–475 g (15–16.8 oz). Women: circumference 54–56 cm (21.3–22 in), weight 325–375 g (11.5–13.2 oz). Non-shiny, non-slippery surface. Resin (sticky substance) may be used on the ball for grip in some leagues but is increasingly regulated.' },
      { name: 'Goal', spec: 'Internal dimensions: 3 m wide × 2 m high (9.84 ft × 6.56 ft). Goal posts and crossbar: 8 cm (3.1 in) square cross-section. Net attached. Goals anchored to the floor or wall.' },
      { name: 'Court Shoes', spec: 'Non-marking indoor court shoes. No outdoor soles.' },
      { name: 'Goalkeeper Equipment', spec: 'No special protective equipment required beyond normal sportswear. Goalkeeper wears a different color jersey from court players and opposing team.' },
    ]},
    area: { desc: 'Played on a regulation indoor court.', specs: [
      'Court: 40 m × 20 m (131 ft × 66 ft)',
      'Goal area (D-zone): 6 m (19.7 ft) arc from the goal line — only the goalkeeper may enter',
      'Free-throw line (9 m line): dashed arc 9 m (29.5 ft) from the goal line',
      '7-metre line: penalty throw line, 7 m (23 ft) from the goal',
      'Substitution area: 4.5 m (14.8 ft) on each side of the center line, along the sideline',
    ]},
    players: { desc: '7 players per team on court (6 court players + 1 goalkeeper). Roster: up to 16 players (14 court players + 2 goalkeepers). Unlimited substitutions via the substitution area (flying substitutions). Officials: 2 court referees (equal authority), timekeeper, scorekeeper, delegates.' },
    rules: [
      'Match duration: 2 × 30 minutes with 10-minute halftime (15 minutes at major tournaments). Overtime if tied: 2 × 5 minutes. If still tied: second overtime (2 × 5 minutes), then penalty shootout.',
      'Ball handling: players may hold the ball for maximum 3 seconds. Maximum 3 steps while holding the ball. After dribbling (bouncing), may take another 3 steps. Double dribble is a violation.',
      'Goal area (6 m zone): only the goalkeeper may be in the goal area. Court players may jump into the goal area to shoot but must release the ball before landing inside.',
      'Scoring: ball must entirely cross the goal line. Goals scored from inside the goal area by a court player do not count.',
      'Goalkeeper: may use any part of the body to defend. May leave the goal area but becomes a court player (subject to court player rules). May not cross the 4 m goalkeeper restraining line on a 7 m throw until the ball is released.',
      '7-metre throw (penalty): awarded for fouls that prevent a clear scoring opportunity. Direct shot on goal from the 7 m line. Goalkeeper restricted behind 4 m line.',
    ],
    scoring: 'Each goal = 1 point. Team with the most goals wins. Typical match scores: 25–30 goals per team.',
    violations: [
      'Progressive punishments: warning (yellow card), 2-minute suspension, disqualification (red card)',
      'Warning: for illegal defensive actions, unsportsmanlike conduct',
      '2-minute suspension: for repeated fouls, serious fouls, unsportsmanlike conduct. Third suspension = disqualification.',
      'Disqualification (red card): for assault, serious unsportsmanlike conduct, third 2-minute suspension. Team plays with one fewer player for 2 minutes, then may substitute.',
      'Passive play: team must demonstrate a recognizable attempt to score. Warning by referee (raised arm), then turnover if no shot attempted within 6 passes.',
    ],
    safety: 'Court surface must be non-slip. Goals must be securely anchored. Jewelry and hard accessories prohibited. Mouthguards recommended. Medical team available.',
  },
  {
    name: 'Beach Volleyball', org: 'FIVB', category: 'Team Sports',
    file: 'FIVB_Beach_Volleyball_Rules.html',
    tags: ['olympic','professional','beach volleyball','fivb'],
    intro: `Beach volleyball has been an Olympic sport since the 1996 Atlanta Games. The FIVB governs the sport under the <strong>FIVB Official Beach Volleyball Rules 2025–2028</strong>. Played outdoors on sand between two teams of 2 players, beach volleyball differs significantly from indoor volleyball: smaller teams (2 vs 6), different court dimensions, no rotation or substitution, and sand-specific rules. The sport is known for its athletic demands — with only 2 players covering the entire court — and its festive atmosphere.`,
    equipment: { items: [
      { name: 'Ball', spec: 'Circumference 66–68 cm (26–26.8 in). Weight 260–280 g (9.2–9.9 oz). Pressure: 0.175–0.225 kg/cm² (171–221 mbar; 2.49–3.20 psi). Brightly colored (typically yellow/blue/white). Waterproof cover.' },
      { name: 'Net', spec: 'Width 8.5 m (27.9 ft). Height: 2.43 m (7 ft 11.6 in) men, 2.24 m (7 ft 4.2 in) women. Mesh 10 cm (3.9 in) square. Antennae attached at each end marking the crossing space, extending 80 cm (31.5 in) above the net.' },
      { name: 'Uniforms', spec: 'Tank tops/t-shirts and shorts. No minimum size requirement (previous bikini requirement was removed). Athletes may wear long sleeves and long pants if desired. Jerseys must display country/name/number.' },
    ]},
    area: { desc: 'Played on a sand court.', specs: [
      'Court: 16 m × 8 m (52.5 ft × 26.2 ft) — smaller than indoor (18 m × 9 m)',
      'Sand depth: minimum 40 cm (15.7 in) of loose, leveled sand. No stones, shells, or debris.',
      'Free zone: minimum 3 m (9.8 ft) on all sides (5 m for FIVB World Tour and Olympics)',
      'No center line under the net (unlike indoor)',
      'No attack line (unlike indoor 3 m line)',
    ]},
    players: { desc: '2 players per team. No substitutions allowed (exception: injury substitution if roster includes a reserve). No coach communication during play (coaches may communicate during timeouts and between sets only). Officials: 1st referee (elevated on stand), 2nd referee (ground level), scorer, line judges.' },
    rules: [
      'Match format: best of 3 sets. Sets 1 and 2 to 21 points (win by 2, no cap). Set 3 (if needed) to 15 points (win by 2, no cap). Rally scoring (point on every rally regardless of serve).',
      'Teams switch sides every 7 points (sets 1–2) or every 5 points (set 3) to equalize wind and sun conditions.',
      'Maximum 3 contacts per side. Block counts as the first contact (unlike indoor where block does not count). Hard-driven attack on the first contact may be received open-handed.',
      'Setting: open-hand setting (overhand pass) is legal but judged strictly for double contact. Tips/dinks must be made with hard contact (no open-hand directing — "deep dish" or "carry" is illegal).',
      'No open-hand tip over the net. Must use knuckle, closed fist, or heel of the hand for attacking/tipping.',
      'No rotation: players may serve in any order, but must alternate serves each service rotation.',
      'Each team gets 1 timeout per set (30 seconds). Technical timeouts at points 21 (combined score) in sets 1–2.',
    ],
    scoring: 'Rally scoring: every rally results in a point. No sideout scoring. Set won by first team to 21 (or 15 in set 3) with a 2-point minimum lead.',
    violations: [
      'Net touch: player touching the net during play — loss of rally (exception: hair or insignificant contact without advantage)',
      'Foot fault on serve: server steps on or over the end line before contact — loss of rally',
      'Four contacts: team uses more than 3 contacts — loss of rally',
      'Double contact on set: open-hand set judged to have a double contact — loss of rally',
      'Open-hand tip: using fingers to direct the ball over the net — loss of rally',
      'Interference: reaching over the net before the opponent completes their attack — loss of rally',
    ],
    safety: 'Sand must be free of debris and maintained between matches. No glass or hard objects in the playing area. Hydration breaks in extreme heat (FIVB heat stress protocol). UV protection recommended for athletes. Medical team on-site.',
  },
];

// ═══════════════════════════════════════════════════════════════
// HTML GENERATOR
// ═══════════════════════════════════════════════════════════════

function generateHTML(sport) {
  const depth = sport.category === 'Combat Sports' || sport.category === 'Team Sports'
    ? '../../../' : '../../../';

  const equipmentItems = sport.equipment.items.map(item =>
    `        <li><strong>${item.name}:</strong> ${item.spec}</li>`
  ).join('\n');

  const areaSpecs = sport.area.specs.map(s => `        <li>${s}</li>`).join('\n');

  const rulesItems = sport.rules.map((r, i) =>
    `      <p>${r}</p>`
  ).join('\n\n');

  const violationItems = sport.violations.map(v =>
    `        <li>${v}</li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${sport.org} - Official Rulebook</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="${depth}assets/images/favicon.ico">
  <link rel="stylesheet" href="${depth}assets/css/opensourcesports.css">
</head>
<body>
  <!--
  METADATA
  {
    "sport": "${sport.name}",
    "category": "${sport.category}",
    "type": "OFFICIAL",
    "governingBody": "${sport.org}",
    "version": "2026.1",
    "lastUpdated": "${TODAY}",
    "author": "OpenSourceSports",
    "tags": ${JSON.stringify(sport.tags)}
  }
  -->

  <header id="top">
    <img src="${depth}assets/images/logo.png" alt="OpenSourceSports" class="oss-header-logo">
    <div class="oss-header-text">
      <h1>${sport.org} - Official Rulebook</h1>
      <p class="governing-body">Governing Body: ${sport.org}</p>
      <p class="last-updated">Last Updated: ${TODAY_DISPLAY}</p>
    </div>
  </header>

  <nav class="oss-toc" id="toc">
    <details open>
      <summary>Table of Contents</summary>
      <ol>
        <li><a href="#introduction"><span class="toc-number">1.</span> Introduction</a></li>
        <li><a href="#equipment"><span class="toc-number">2.</span> Equipment</a></li>
        <li><a href="#playing-area"><span class="toc-number">3.</span> Playing Area</a></li>
        <li><a href="#players-officials"><span class="toc-number">4.</span> Players &amp; Officials</a></li>
        <li><a href="#rules-of-play"><span class="toc-number">5.</span> Rules of Play</a></li>
        <li><a href="#scoring"><span class="toc-number">6.</span> Scoring</a></li>
        <li><a href="#violations-penalties"><span class="toc-number">7.</span> Violations &amp; Penalties</a></li>
        <li><a href="#safety-considerations"><span class="toc-number">8.</span> Safety Considerations</a></li>
      </ol>
    </details>
  </nav>

  <main>

    <section id="introduction">
      <h2>Section 1: Introduction</h2>

      <h3>1.1 Overview and Governing Body</h3>
      <p>${sport.intro}</p>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="equipment">
      <h2>Section 2: Equipment</h2>

      <h3>2.1 Required Equipment</h3>
      <ul>
${equipmentItems}
      </ul>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="playing-area">
      <h2>Section 3: Playing Area</h2>

      <h3>3.1 Venue Specifications</h3>
      <p>${sport.area.desc}</p>
      <ul>
${areaSpecs}
      </ul>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="players-officials">
      <h2>Section 4: Players &amp; Officials</h2>

      <h3>4.1 Competitors and Officials</h3>
      <p>${sport.players.desc}</p>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="rules-of-play">
      <h2>Section 5: Rules of Play</h2>

      <h3>5.1 Core Rules</h3>
${rulesItems}

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="scoring">
      <h2>Section 6: Scoring</h2>

      <h3>6.1 Scoring System</h3>
      <p>${sport.scoring}</p>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="violations-penalties">
      <h2>Section 7: Violations &amp; Penalties</h2>

      <h3>7.1 Infractions and Consequences</h3>
      <ul>
${violationItems}
      </ul>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

    <section id="safety-considerations">
      <h2>Section 8: Safety Considerations</h2>

      <h3>8.1 Safety Protocols</h3>
      <p>${sport.safety}</p>

      <div class="oss-section-foot"><a href="#toc" class="oss-back-top">↑ Back to Contents</a></div>
    </section>

  </main>

  <footer>
    <p>&copy; 2026 OpenSourceSports. Maintained by <a href="https://digilogiclabs.com">Digi Logic Labs</a> &mdash; <em>A Workshop for Digital Craftsmanship</em></p>
  </footer>
</body>
</html>`;
}

function generateMetadata(sport) {
  return JSON.stringify({
    name: sport.name,
    category: sport.category,
    type: 'OFFICIAL',
    description: `Official rules for ${sport.name} as governed by ${sport.org}`,
    governing_bodies: [sport.org],
    tags: sport.tags,
    created_at: `${TODAY}T00:00:00Z`,
    created_by: 'OpenSourceSports',
  }, null, 2);
}

function generateCategoryMetadata(name) {
  return JSON.stringify({
    name,
    type: 'category',
    description: `${name} governed by international federations`,
    maintainers: ['OpenSourceSports'],
  }, null, 2);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

// Create category metadata files
const categoryDirs = {
  'Winter Sports': join(ROOT, 'Official', 'Winter Sports'),
  'Water Sports': join(ROOT, 'Official', 'Water Sports'),
};

for (const [name, dir] of Object.entries(categoryDirs)) {
  mkdirSync(dir, { recursive: true });
  const metaPath = join(dir, 'metadata.json');
  if (!existsSync(metaPath)) {
    writeFileSync(metaPath, generateCategoryMetadata(name) + '\n');
    console.log(`✓ ${name}/metadata.json`);
  }
}

// Generate all sport files
let created = 0;
for (const sport of SPORTS) {
  const catDir = join(ROOT, 'Official', sport.category);
  const sportDir = join(catDir, sport.name);
  mkdirSync(sportDir, { recursive: true });

  const htmlPath = join(sportDir, sport.file);
  const metaPath = join(sportDir, 'metadata.json');

  writeFileSync(htmlPath, generateHTML(sport));
  writeFileSync(metaPath, generateMetadata(sport) + '\n');
  created++;
  console.log(`✓ [${created}/${SPORTS.length}] ${sport.category}/${sport.name}/${sport.file}`);
}

console.log(`\n✅ Created ${created} sports (${created * 2} files + ${Object.keys(categoryDirs).length} category metadata files)`);
console.log(`Total HTML files in repo: ${created + 25} (${created} new + 25 existing)`);
