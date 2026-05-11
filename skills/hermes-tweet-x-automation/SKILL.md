---
name: hermes-tweet-x-automation
description: Use Hermes Tweet from Hermes Agent to search tweets, read replies, monitor X activity, and run approval-gated X/Twitter actions through Xquik
author: Xquik
tags: [hermes-agent, hermes-plugin, x-twitter, tweet-search, social-media-automation, xquik]
---

# Hermes Tweet X/Twitter Automation

This skill gives Hermes Agent a safe workflow for X/Twitter automation with the
Hermes Tweet plugin.

Use it when the user wants to:

- Search tweets with X query operators.
- Search Twitter or X for people, topics, products, or competitors.
- Read tweet replies, quotes, threads, likers, and retweeters.
- Look up users, followers, following, mentions, likes, and media.
- Monitor tweets, keywords, trends, and account activity.
- Draft posts or replies before publishing.
- Post tweets, post replies, like, retweet, follow, send DMs, or update monitors
  only after explicit approval.

Hermes Tweet repository:

- <https://github.com/Xquik-dev/hermes-tweet>

Official guide:

- <https://docs.xquik.com/guides/hermes-tweet>

## When to Use This Skill

Use this skill for Hermes Agent sessions that need real social media workflows:

- "Search tweets about this launch."
- "Find X users talking about AI agents."
- "Read replies to this tweet."
- "Monitor tweets for these keywords."
- "Summarize current X trends."
- "Draft a reply but do not post it."
- "Post this approved tweet."
- "Send this approved DM."

The strongest fit is a workflow where Hermes Agent needs structured X/Twitter
data first, then a human-approved action later.

## Installation

Install Hermes Tweet as a Hermes Agent plugin:

```bash
hermes plugins install Xquik-dev/hermes-tweet --enable
```

Or install the PyPI package into the Hermes Python environment:

```bash
uv pip install --python ~/.hermes/hermes-agent/venv/bin/python hermes-tweet
hermes plugins enable hermes-tweet
```

Read operations require `XQUIK_API_KEY` in the Hermes runtime environment:

```bash
export XQUIK_API_KEY="xq_..."
```

Keep actions disabled by default:

```bash
export HERMES_TWEET_ENABLE_ACTIONS="false"
```

Enable actions only for approved workflows:

```bash
export HERMES_TWEET_ENABLE_ACTIONS="true"
```

## Available Tools

Hermes Tweet exposes:

- `tweet_explore`: Search the endpoint catalog. No API call.
- `tweet_read`: Call catalog-listed read-only endpoints.
- `tweet_action`: Call private or write-like endpoints. Disabled by default.

Always use `tweet_explore` before `tweet_read` or `tweet_action`.

## Decision Rules

1. If the user asks what Hermes Tweet can do, call `tweet_explore`.
2. If the task is public read-only X/Twitter data, use `tweet_read`.
3. If the task changes account state, posts content, sends DMs, creates jobs, or
   manages monitors, use `tweet_action` only after approval.
4. If `tweet_action` is disabled, stop and explain that actions require
   `HERMES_TWEET_ENABLE_ACTIONS=true`.
5. If `XQUIK_API_KEY` is missing, ask the user to configure the key in the
   Hermes runtime. Do not ask them to paste the key in chat.
6. Do not guess endpoint paths. Select only catalog-listed `/api/v1/...`
   endpoints.

## Read Workflows

### Search Tweets

Use for tweet search, Twitter search, X search, product monitoring, launch
tracking, or community research.

Explore:

```json
{"query":"tweet search","method":"GET"}
```

Read:

```json
{"path":"/api/v1/x/tweets/search","query":{"q":"Hermes Agent","limit":25}}
```

Return:

- Search query used.
- Matching tweets.
- Author handles when present.
- Timestamps and engagement when present.
- Cursor or pagination hint when present.

### Read Replies

Use for support triage, objection analysis, feedback summaries, and community
response checks.

Explore:

```json
{"query":"tweet replies","method":"GET"}
```

Read:

```json
{"path":"/api/v1/x/tweets/{id}/replies","path_params":{"id":"1234567890"}}
```

Return:

- Main themes.
- Questions and complaints.
- Positive reactions.
- Risks or moderation concerns.
- Suggested follow-up.

### Search Users

Use for creator discovery, prospecting, competitor research, and community
mapping.

Explore:

```json
{"query":"user search","method":"GET"}
```

Read:

```json
{"path":"/api/v1/x/users/search","query":{"q":"AI agent founders","limit":20}}
```

Return:

- Handles.
- Display names.
- Bio summary.
- Why each result matches the request.

### Read Followers

Use when the user wants to export followers, understand an audience, or inspect
who follows an account.

Explore:

```json
{"query":"followers","method":"GET"}
```

Read:

```json
{"path":"/api/v1/x/users/{id}/followers","path_params":{"id":"12345"},"query":{"limit":50}}
```

Return:

- Accounts found.
- Audience patterns.
- Cursor or next-page data.

### Read Trends

Use when the user wants current X trends or topic ideas.

Explore:

```json
{"query":"trends","method":"GET"}
```

Read:

```json
{"path":"/api/v1/x/trends","query":{"limit":30}}
```

Return:

- Trending topics.
- Region or source when present.
- Follow-up tweet search queries.

## Action-Gated Workflows

Actions must be visible and approved before execution.

Action examples:

- Post tweets.
- Post replies.
- Like tweets.
- Retweet.
- Follow users.
- Send DMs.
- Create account or keyword monitors.
- Create webhook, extraction, media, or giveaway jobs.

### Post an Approved Tweet

Explore:

```json
{"query":"post tweet","include_actions":true}
```

Confirm:

```text
I will post this tweet:
"Hermes Tweet lets Hermes Agent search tweets, read replies, monitor X activity, and run approval-gated X/Twitter actions."
```

Action:

```json
{
  "path":"/api/v1/x/tweets",
  "method":"POST",
  "body":{
    "text":"Hermes Tweet lets Hermes Agent search tweets, read replies, monitor X activity, and run approval-gated X/Twitter actions."
  },
  "reason":"Post the user-approved tweet."
}
```

### Post an Approved Reply

Explore:

```json
{"query":"post reply","include_actions":true}
```

Before calling `tweet_action`, show:

- Target tweet ID or URL.
- Exact reply text.
- Account context when available.

Action:

```json
{
  "path":"/api/v1/x/tweets",
  "method":"POST",
  "body":{
    "reply_to_tweet_id":"1234567890",
    "text":"Thanks for sharing this. Hermes Tweet supports tweet search, reply reads, monitoring, and approval-gated posting from Hermes Agent."
  },
  "reason":"Post the user-approved reply."
}
```

## Safety Rules

- Never ask for passwords, cookies, session tokens, API keys, or TOTP secrets.
- Never place credentials in tool arguments.
- Never invent endpoint paths.
- Never call `tweet_action` when `tweet_read` can satisfy the request.
- Never post, reply, like, retweet, follow, DM, or create monitor changes
  without explicit user approval.
- Never bypass a disabled action gate.
- Never retry writes through a different route after a policy, auth, or account
  state failure.
- Use small result limits first for broad searches.
- Include cursors or next steps when pagination matters.

## Failure Handling

- Missing `XQUIK_API_KEY`:
  - Stop and ask the user to configure it in the Hermes runtime environment.
- Missing `tweet_read`:
  - Confirm the plugin is enabled and the API key is available to the active
    Hermes process.
- Missing `tweet_action`:
  - Explain that action tools are intentionally gated.
- Endpoint not found:
  - Run `tweet_explore` again with a narrower query.
- API error:
  - Report the status and safe response summary.
  - Do not expose credentials.

## Final Response Checklist

Before finishing, confirm:

- The endpoint was discovered through `tweet_explore`.
- Reads used `tweet_read`.
- Actions used `tweet_action` only after approval.
- The answer names the query, endpoint, and key result.
- No secret value appears in the prompt, tool input, or final answer.
- Pagination or follow-up steps are clear.
