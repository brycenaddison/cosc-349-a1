# Setup

1. Make a `.env.local` file in the root directory with the following variables:

```ini
# Riot API key for fetching timeline data
RIOT_TOKEN={api key}

# Live patch pointer for DDragon (pngs/json)
LIVE_PATCH="14.3"
```

2. Enable `pnpm` if you have not already done so: `corepack enable pnpm`
3. Install dependencies with `pnpm install`
4. Run development environment with `pnpm run dev`
