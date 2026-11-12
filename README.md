# TalkieTalkieJunkieDude

A Telegram chat bot with switchable personalities, powered by the Groq API (`qwen/qwen3.8-27b`). It replies in character, remembers the conversation, reacts to trigger words, joins conversations on its own from time to time, generates images and memes, summarizes the chat, and has a reputation system with daily rewards, transfers and mini-games.

The bot's language is Russian.

## Features

- **17 personalities.** Switch with a command, for example `/gopnik`, `/toxic`, `/nietzsche`. Full list with descriptions: `/characters`.
- **Conversation memory.** Remembers the last 8 exchanges per chat and keeps them across restarts. In groups every message is stored with its author's name, so the bot knows who said what. Switching personality clears the memory.
- **Group behavior.** In groups the bot answers when mentioned (`@botname`) or when someone replies to its message. In private chats it answers everything.
- **Spontaneous replies.** In groups the bot sometimes jumps into the conversation by itself with a short in-character remark, based on the recent chat. After each reply it stays silent for a random 30 minutes to 3 hours, then has a 40% chance (configurable per chat) to react to the next message. Chat admins can turn it off or change the chance with `/spont`.
- **Trigger words.** Canned replies to specific phrases, with several reply variants, an optional trigger chance and a per-chat cooldown.
- **Reputation system.** REP for chat activity, a daily reward with a streak, transfers between members, profiles, titles, leaderboard and achievements. Chat admins automatically get 9999 REP.
- **Chat summary.** `/tldr` retells the latest messages of the chat.
- **Mini-games and toys.** Rock, paper, scissors with REP bets, dice, 8-ball and a "choose for me" command.
- **Psychological portrait.** `/portrait` generates a humorous profile of a user from their recent messages.
- **Image generation.** `/draw` creates a picture from a text description (FLUX.1 schnell on Cloudflare Workers AI). Costs REP. Russian prompts are translated to English automatically for better results.
- **Meme generator.** `/meme` captions imgflip templates, including templates with three or four text fields.
- **Utilities.** Weather, currency rates and web search.
- **Anti-spam.** Per-user cooldowns on AI replies, `/meme`, `/draw` and personality switches, plus a daily `/draw` limit.
- **Persistence.** Reputation, conversation history, chat feed, portrait messages and per-chat settings survive restarts.
- **Admin tools.** Add, remove or set a user's REP, configure spontaneous replies, debug commands.
- **Command menu.** Commands are registered with Telegram, so they show up when you type `/`.

## Requirements

- Node.js 18 or newer
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- A Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

Optional services, each enabling one feature (see the table below):

- Cloudflare account for `/draw`
- imgflip account for `/meme`
- OpenWeatherMap key for `/weather`
- Tavily key for better `/search`

## Installation

```bash
git clone https://github.com/gpozdny/tgchatbot.git
cd tgchatbot
npm install
```

## Configuration

Create a `.env` file in the project root (use `.env.example` as a template):

```env
BOT_TOKEN=your_telegram_bot_token
GROQ_API_KEY=your_groq_api_key
ADMIN_IDS=123456789,987654321

# /draw
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_API_TOKEN=your_cloudflare_api_token

# /meme
IMGFLIP_USERNAME=your_imgflip_username
IMGFLIP_PASSWORD=your_imgflip_password

# /weather
WEATHER_API_KEY=your_openweathermap_key

# /search (optional)
TAVILY_API_KEY=tvly-your_key
```

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_TOKEN` | yes | Telegram bot token from @BotFather |
| `GROQ_API_KEY` | yes | Groq API key |
| `ADMIN_IDS` | no | Comma-separated Telegram user IDs allowed to use admin commands in private chat. In groups, chat admins are checked through Telegram. |
| `CF_ACCOUNT_ID` | for `/draw` | Cloudflare account ID |
| `CF_API_TOKEN` | for `/draw` | Cloudflare API token with Workers AI permissions |
| `POLLINATIONS_API_KEY` | no | Fallback image provider if Cloudflare fails (free key from enter.pollinations.ai) |
| `IMGFLIP_USERNAME` | for `/meme` | imgflip account username |
| `IMGFLIP_PASSWORD` | for `/meme` | imgflip account password (the account login, not an API key) |
| `WEATHER_API_KEY` | for `/weather` | OpenWeatherMap API key |
| `TAVILY_API_KEY` | no | Tavily API key. Without it `/search` uses Wikipedia only. |

Commands whose keys are missing reply that the feature is not configured. The rest of the bot keeps working.

Never commit `.env`. It is already listed in `.gitignore`.

### Getting the Cloudflare keys (for `/draw`)

1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com). The free plan works and no card is needed.
2. Open **AI → Workers AI** and click **Use REST API**.
3. Copy the **Account ID** into `CF_ACCOUNT_ID`.
4. Click **Create a Workers AI API Token** (Workers AI read and edit permissions), create it and copy the token into `CF_API_TOKEN`. It is shown only once.

The free allocation is 10,000 Neurons per day, roughly 170 images at default settings. It resets at 00:00 UTC. When the limit is reached the bot says so and refunds the REP.

## Running

```bash
npm start
```

or

```bash
node index.js
```

Stop it with `Ctrl+C`. On shutdown the bot writes pending data to disk, so nothing is lost.

## Telegram setup

To make trigger words and spontaneous replies work in groups, the bot must see all messages:

1. Open @BotFather and send `/setprivacy`.
2. Choose your bot and select **Disable**.
3. Remove the bot from the group and add it again (or make it a group admin).

To change the bot's avatar, use `/setuserpic` in @BotFather.

## Commands

### General

| Command | Description |
| --- | --- |
| `/start` | Greeting and main commands |
| `/help` | List of all commands |
| `/characters` | Personalities with short descriptions |

### Personalities

`/gopnik`, `/toxic`, `/scientist`, `/narkoman`, `/anime`, `/femboy`, `/dostoevsky`, `/lenin`, `/putin`, `/nietzsche`, `/sartre`, `/camus`, `/trump`, `/kafka`, `/chekhov`, `/satan`, `/god`

The default personality is `gopnik`. Some characters are satirical role-play and do not represent real statements.

Switching a personality wipes the chat's memory, so in groups non-admins can do it once per 2 minutes. Admins and private chats have no limit.

### Reputation and games

| Command | Description |
| --- | --- |
| `/profile` | Your profile (reply to a message or pass a user ID to see someone else's) |
| `/leaderboard` | Top 10 users of the chat |
| `/achievements` | Your achievements |
| `/rep_help` | Details about the reputation system |
| `/daily` | Daily reward. +5 REP on the first day, +1 for every following day in a row, up to +15. Missing a day resets the streak. The day changes at 00:00 UTC. Groups only. |
| `/give @username 10` | Transfer REP to another member. Also `/give Name 10`, `/give ID 10`, or reply to a message with `/give 10`. Up to 100 REP per day (admins are exempt), 5 second cooldown. Bots, yourself and admins cannot receive transfers. Groups only. |
| `/rps rock 10` | Rock, paper, scissors with a bet in REP (also accepts Russian words: камень, ножницы, бумага) |
| `/portrait` | Humorous psychological portrait (needs at least 3 messages, 10 minute cooldown) |

REP sources: +1 for chat activity (once per 5 minutes, max 10 per day), `/daily`, transfers and games. REP sinks: `/draw`, bets and transfers.

### Chat tools

| Command | Description |
| --- | --- |
| `/tldr` | Short retelling of the last 30 messages of the chat. `/tldr 50` takes more, from 5 up to 40 (the size of the stored feed). One summary per 2 minutes per chat. Groups only. |
| `/roll` | Random number from 1 to 100. `/roll 20` gives 1 to 20, `/roll 2d6` two six-sided dice, `/roll 3d6+2` three dice plus 2. Up to 20 dice. The Russian forms `2к6` and `2д6` also work. |
| `/8ball question` | Magic 8-ball with 20 classic answers |
| `/choose a \| b \| c` | Picks one of the options. Options can also be separated by the word "или": `/choose sleep или code`. |

`/roll`, `/8ball` and `/choose` silently ignore a user who calls them more often than once per 2 seconds.

### Images and memes

| Command | Description |
| --- | --- |
| `/draw description` | Generate an image. Costs 15 REP, refunded if generation fails. 30 second cooldown and 10 images per day per user. English prompts usually work best, but Russian ones are translated automatically. |
| `/meme template \| text 1 \| text 2` | Create a meme, for example `/meme drake \| Writing code by hand \| Copilot`. Templates with more fields take more texts: `/meme expanding \| a \| b \| c \| d`. 20 second cooldown. |
| `/memes` | List of built-in template names |

A template can be given as a short name from `/memes`, a numeric imgflip template ID, or a name from the imgflip top 100, for example `/meme Two Buttons | Sleep | Write code`. Memes made with a free imgflip account carry a watermark.

### Utilities

| Command | Description |
| --- | --- |
| `/weather city` | Current weather |
| `/rate` | Currency rates against the ruble (USD, EUR, CNY, KZT) |
| `/search query` | Web search. Short, simple queries go to Wikipedia. Questions, long phrases and queries about fresh data (prices, news, "today") go to Tavily first when `TAVILY_API_KEY` is set. If one source finds nothing, the other is tried. |

### Admin commands

| Command | Description |
| --- | --- |
| `/rep_add @username 10 reason` | Add REP |
| `/rep_remove @username 5 reason` | Remove REP |
| `/rep_set @username 100 reason` | Set REP to an exact value |
| `/spont` | Show the spontaneous reply settings of the chat |
| `/spont on` / `/spont off` | Turn spontaneous replies on or off |
| `/spont 25` | Set the chance of a spontaneous reply to 25% (and turn it on) |
| `/test_spont` | The next message of 5 or more characters gets a spontaneous reply for sure |
| `/show_context` | Show the last 10 messages the bot has in its chat feed |

The user can be given as `@username`, a first name, or a numeric ID (the user must have written in the chat at least once for username and name lookup). You can also reply to a user's message and write `/rep_add 10 reason`.

`/spont`, `/test_spont` and `/show_context` work only for chat admins. For everyone else `/test_spont` and `/show_context` get no reply at all. The `/spont` settings are saved per chat.

## Anti-spam and limits

| What | Limit |
| --- | --- |
| AI replies | 1 per 3 seconds per user (the first extra message gets a warning, the rest are ignored) |
| `/meme` | 1 per 20 seconds per user |
| `/draw` | 1 per 30 seconds and 10 per day per user |
| Personality switch | 1 per 2 minutes per chat for non-admins |
| `/give` | 5 seconds between transfers, 100 REP per day (admins exempt) |
| `/tldr` | 1 per 2 minutes per chat |
| `/roll`, `/8ball`, `/choose` | 1 per 2 seconds per user, extra calls are ignored |
| `/portrait` | 1 per 10 minutes |

Spontaneous replies are not affected by these cooldowns, they have their own random pause.

## Data and persistence

Runtime data lives in the `data/` folder and is not committed:

| File | Contents |
| --- | --- |
| `data/reputation.json` | Profiles, REP, daily streaks, transfer and draw counters, transaction history |
| `data/state.json` | Conversation history and current personality per chat, the chat feed used for `/tldr` and spontaneous replies, messages for `/portrait`, per-chat settings such as `/spont` |

Both files are written with a short delay (5 seconds after the last change) to avoid writing to disk on every message, and are flushed on `Ctrl+C`, `SIGTERM` and normal exit. If the process is killed with `kill -9` or the machine loses power, the last few seconds of changes can be lost.

The silence timers of spontaneous replies are not saved. After a restart the bot waits a fresh random pause (30 minutes to 3 hours) in every chat before it may jump in.

## Project structure

```
.
├── index.js          # Main bot code
├── data/             # Runtime data (reputation.json, state.json), not committed
├── .env              # Secrets, not committed
├── .env.example      # Template for .env
├── package.json
└── README.md
```

## Customization

- **Add a personality.** Add a new object to `characters` in `index.js` (emoji, name, description, switch message, prompt) and put its key into `CHARACTER_GROUPS`. The command is created automatically.
- **Add a trigger.** Add an entry to the `triggers` array. Use `word('phrase')` for the pattern and list variants with `|`, for example `word('hi|hello')`. Put several strings into `replies` to get a random one. The optional `chance` field (0 to 1) makes the trigger fire only part of the time, for example `chance: 0.5`.
- **Add a meme template.** Add an entry to `MEME_TEMPLATES` with the imgflip template ID, a title and optionally the number of text boxes.
- **Change global behavior.** Edit `BASE_SYSTEM_PROMPT`. It applies to every personality.
- **Change limits.** All limits are constants near the top of the relevant sections of `index.js`:
  - Memory and replies: `MEMORY_SIZE`, `MAX_ANSWER_LENGTH`, `CHAT_FEED_LIMIT`, `CHAT_CONTEXT_MESSAGES`
  - Spontaneous replies: `SPONTANEOUS_MIN_DELAY`, `SPONTANEOUS_MAX_DELAY`, `SPONTANEOUS_CHANCE` (the default, per-chat value is set with `/spont`)
  - Anti-spam: `AI_COOLDOWN`, `MEME_COOLDOWN`, `DRAW_COOLDOWN`, `DRAW_DAILY_LIMIT`, `PERSONA_COOLDOWN`, `TRIGGER_COOLDOWN`, `PORTRAIT_COOLDOWN`, `FUN_COOLDOWN`
  - Economy: `DRAW_COST`, `DAILY_BASE`, `DAILY_STREAK_BONUS`, `DAILY_STREAK_BONUS_CAP`, `GIVE_DAILY_LIMIT`, `GIVE_COOLDOWN`
  - Summary: `TLDR_COOLDOWN`, `TLDR_DEFAULT_MESSAGES`, `TLDR_MIN_MESSAGES`
  - Saving: `REPUTATION_SAVE_DELAY`, `STATE_SAVE_DELAY`
- **Tune search routing.** `COMPLEX_QUERY_PATTERN` and `isComplexQuery` decide which `/search` queries go to Tavily first.

## Troubleshooting

- **The bot ignores trigger words and never jumps in on its own.** Privacy mode is still on. Follow the steps in "Telegram setup" and re-add the bot to the group.
- **"Лимит Groq превышен".** The free Groq tier hit its rate limit. Wait a minute. The cooldowns above exist to make this rarer.
- **`/draw` says the daily limit is reached.** Cloudflare's free allocation resets at 00:00 UTC. The REP is refunded.
- **`/daily` or `/give` refuses to work.** They need a normal user account in a group. They do not work in private chats or when a message is sent on behalf of the chat (anonymous admin mode).

## Notes

- Reputation and state data are stored locally in `data/`. Back them up if they matter to you.
- Add `data/` and `*.db` to `.gitignore` so chat data never ends up in the repository.
- The bot allows profanity and dark humor by design. Use it in chats where everyone is fine with that.
- Keep your API keys private. If a key ever leaks, revoke it and create a new one.

## License

Add a license of your choice, for example MIT.