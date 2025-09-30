# Intori Home Feed Narratives (v1)

**Artifact:** `intori_home_feed_narratives_v1.json`  
**Version:** 1.0.0  
**Updated:** 2025-09-29 17:52:34Z

## Purpose
Provide short, friendly, and low-spam narrative lines for Home feed activities. Tone matches our profile summaries (Option C: warm, relatable, conversational) but **shorter**.

## Events Covered
1. `friend_connected` – new friendships (single/multiple, with merge window)
2. `insight_boosted` – boosted insights
3. `special_gift_sent` – sending a sponsored/brand Special Gift
4. `special_gift_received` – receiving/opening a Special Gift
5. `streak_milestone` – daily check‑in streak milestones (7/14/30/90)
6. `cluster_joined` – user joins one of the 20 pre‑defined clusters
7. `topic_revealed` – user reveals a new topic

## Tone & Length
- **Tone:** warm, friendly, conversational; small splash of fun.
- **Length:** aim 8–18 words; hard cap ~90 chars if your UI trims by characters.

## Rate Limiting & Dedupe
- **Friends:** merge events in a 30‑min window; show consolidated lines.
- **Boosts:** dedupe by `actor:insight` with a 60‑min cooldown.
- **Gifts:** dedupe by `actor:campaign:direction` with light cooldown.

## Rendering
- Substitute variables using braces, e.g., `{actor}`.
- Optional segments use `{field| prefix=' — '}` (prefix rendered only if field exists).
- Truncate long titles to ~28 chars before substitution to keep lines tidy.

## Example Payloads

### New Friend (single)
```json
{"event": "friend_connected", "actor": "Maya", "friend_1": "Dev"}
```

### New Friends (many)
```json
{"event": "friend_connected", "actor": "Maya", "count": 5}
```

### Insight Boosted
```json
{"event": "insight_boosted", "actor": "Dev", "insight_title": "Weekend hiking spots", "topic": "Outdoors"}
```

### Special Gift Sent
```json
{"event": "special_gift_sent", "actor": "Maya", "gift_name": "Spring Drop", "brand": "Acme Co."}
```

### Streak Milestone
```json
{"event": "streak_milestone", "actor": "Dev", "streak_days": 14}
```

### Cluster Joined
```json
{"event": "cluster_joined", "actor": "Maya", "cluster_name": "Sports Fans", "unlock_reason": "loves live games"}
```

### Topic Revealed
```json
{"event": "topic_revealed", "actor": "Dev", "topic_name": "Minimalist Travel", "hook": "new favorite"}
```

## Integration Notes
- Pick one random variant per event to reduce repetition; bias toward those that include more concrete data (e.g., names).
- Respect cooldown/merge parameters server‑side to prevent spammy feeds.
- Keep strings user‑safe and skip sensitive categories.
- Prepare for i18n: keep placeholders intact and avoid idioms that don’t translate cleanly.

---

Questions? Ping to add new events or tweak rate‑limits.
