# TalkieTalkieJunkieDude

A Telegram chat bot with switchable personalities, powered by the Groq API (`qwen/qwen3.8-27b`). It replies in character, keeps short conversation memory per chat, reacts to trigger words, joins conversations on its own from time to time, generates images and memes, and has a small reputation system with mini-games.

The bot's language is Russian.

## Features

- **17 personalities.** Switch with a command, for example `/gopnik`, `/toxic`, `/nietzsche`. Full list with descriptions: `/characters`.
- **Conversation memory.** Remembers the last 8 exchanges per chat. Switching personality clears it.
- **Group behavior.** In groups the bot answers when mentioned (`@botname`) or when someone replies to its message. In private chats it answers everything.
- **Spontaneous replies.** In groups the bot sometimes jumps into the conversation by itself with a short in-character remark. After each reply it stays silent for a random 30 minutes to 3 hours, then has a 40% chance to react to the next message.
- **Trigger words.** Instant canned replies to specific phrases, with a per-chat cooldown.
- **Reputation system.** +1 REP for chat activity (once per 5 minutes, max 10 per day), profiles, titles, leaderboard and achievements. Chat admins automatically get 9999 REP.
- **Rock, paper, scissors.** Bet REP against the bot.
- **Psychological portrait.** `/portrait` generates a humorous profile of a user from their recent messages.
- **Image generation.** `/draw` creates a picture from a text description (FLUX.1 schnell on Cloudflare Workers AI). Costs REP. Russian prompts are translated to English automatically for better results.
- **Meme generator.** `/meme` captions imgflip templates, including templates with three or four text fields.
- **Utilities.** Weather, currency rates and web search.
- **Admin tools.** Add, remove or set a user's REP.
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

Stop it with `Ctrl+C`.

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

### Reputation and games

| Command | Description |
| --- | --- |
| `/profile` | Your profile (reply to a message or pass a user ID to see someone else's) |
| `/leaderboard` | Top 10 users of the chat |
| `/achievements` | Your achievements |
| `/rep_help` | Details about the reputation system |
| `/rps rock 10` | Rock, paper, scissors with a bet in REP (also accepts Russian words: камень, ножницы, бумага) |
| `/portrait` | Humorous psychological portrait (needs at least 3 messages, 10 minute cooldown) |

### Images and memes

| Command | Description |
| --- | --- |
| `/draw description` | Generate an image. Costs 15 REP, refunded if generation fails. English prompts usually work best, but Russian ones are translated automatically. |
| `/meme template \| text 1 \| text 2` | Create a meme, for example `/meme drake \| Writing code by hand \| Copilot`. Templates with more fields take more texts: `/meme expanding \| a \| b \| c \| d`. |
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

The user can be given as `@username`, a first name, or a numeric ID (the user must have written in the chat at least once for username and name lookup). You can also reply to a user's message and write `/rep_add 10 reason`.

## Project structure

```
.
├── index.js          # Main bot code
├── data/             # Runtime data (reputation.json), not committed
├── .env              # Secrets, not committed
├── .env.example      # Template for .env
├── package.json
└── README.md
```

## Customization

- **Add a personality.** Add a new object to `characters` in `index.js` (emoji, name, description, switch message, prompt) and put its key into `CHARACTER_GROUPS`. The command is created automatically.
- **Add a trigger.** Add an entry to the `triggers` array. Use `word('phrase')` for the pattern, and list variants with `|`, for example `word('hi|hello')`.
- **Add a meme template.** Add an entry to `MEME_TEMPLATES` with the imgflip template ID, a title and optionally the number of text boxes.
- **Change global behavior.** Edit `BASE_SYSTEM_PROMPT`. It applies to every personality.
- **Change limits.** `MEMORY_SIZE`, `MAX_ANSWER_LENGTH`, `TRIGGER_COOLDOWN`, `PORTRAIT_COOLDOWN`, `DRAW_COST` and the `SPONTANEOUS_*` constants are near the top of the relevant sections.
- **Tune search routing.** `COMPLEX_QUERY_PATTERN` and `isComplexQuery` decide which `/search` queries go to Tavily first.

## Notes

- Reputation data is stored locally in `data/reputation.json`. Back it up if it matters to you.
- The bot allows profanity and dark humor by design. Use it in chats where everyone is fine with that.
- Keep your API keys private. If a key ever leaks, revoke it and create a new one.

## License

Add a license of your choice, for example MIT.
