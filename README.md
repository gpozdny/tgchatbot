# TalkieTalkieJunkieDude

A Telegram chat bot with switchable personalities, powered by the Groq API (`qwen/qwen3.8-27b`). It replies in character, keeps short conversation memory per chat, reacts to trigger words, and has a small reputation system with mini-games.

The bot's language is Russian.

## Features

- **17 personalities.** Switch with a command, for example `/gopnik`, `/toxic`, `/nietzsche`. Full list with descriptions: `/characters`.
- **Conversation memory.** Remembers the last 8 exchanges per chat. Switching personality clears it.
- **Group behavior.** In groups the bot answers only when mentioned (`@botname`) or when someone replies to its message. In private chats it answers everything.
- **Trigger words.** Instant canned replies to specific phrases, with a per-chat cooldown.
- **Reputation system.** +1 REP for chat activity (once per 5 minutes, max 10 per day), profiles, titles, leaderboard and achievements.
- **Rock, paper, scissors.** Bet REP against the bot.
- **Psychological portrait.** `/portrait` generates a humorous profile of a user from their recent messages.
- **Admin tools.** Add, remove or set a user's REP.
- **Command menu.** Commands are registered with Telegram, so they show up when you type `/`.

## Requirements

- Node.js 18 or newer
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- A Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

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
```

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_TOKEN` | yes | Telegram bot token from @BotFather |
| `GROQ_API_KEY` | yes | Groq API key |
| `ADMIN_IDS` | no | Comma-separated Telegram user IDs allowed to use admin commands in private chat. In groups, chat admins are checked through Telegram. |

Never commit `.env`. It is already listed in `.gitignore`.

## Running

```bash
node bot.js
```

Stop it with `Ctrl+C`.

## Telegram setup

To make trigger words work in groups, the bot must see all messages:

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

### Admin commands

| Command | Description |
| --- | --- |
| `/rep_add ID 10 reason` | Add REP |
| `/rep_remove ID 5 reason` | Remove REP |
| `/rep_set ID 100 reason` | Set REP to an exact value |

You can also reply to a user's message and write `/rep_add 10 reason`.

## Project structure

```
.
├── bot.js            # Main bot code
├── check.js          # Helper script
├── data/             # Runtime data (reputation.json), not committed
├── .env              # Secrets, not committed
├── .env.example      # Template for .env
├── package.json
└── README.md
```

## Customization

- **Add a personality.** Add a new object to `characters` in `bot.js` (emoji, name, description, switch message, prompt) and put its key into `CHARACTER_GROUPS`. The command is created automatically.
- **Add a trigger.** Add an entry to the `triggers` array. Use `word('phrase')` for the pattern, and list variants with `|`, for example `word('hi|hello')`.
- **Change global behavior.** Edit `BASE_SYSTEM_PROMPT`. It applies to every personality.
- **Change limits.** `MEMORY_SIZE`, `MAX_ANSWER_LENGTH`, `TRIGGER_COOLDOWN` and `PORTRAIT_COOLDOWN` are constants near the top of the relevant sections.

## Notes

- Reputation data is stored locally in `data/reputation.json`. Back it up if it matters to you.
- The bot allows profanity and dark humor by design. Use it in chats where everyone is fine with that.
- Keep your API keys private. If a key ever leaks, revoke it and create a new one.

## License

Add a license of your choice, for example MIT.
