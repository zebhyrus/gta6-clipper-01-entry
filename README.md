# gta6-clipper-01-entry

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/zebhyrus/gta6-clipper-01-entry/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/zebhyrus/gta6-clipper-01-entry/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

A 16-second vertical Short cut from Rockstar's Grand Theft Auto VI Trailer 2. The hook is the jet ski run across the Vice City bay at 2:20, then a biker with a plane flying low overhead, with the corrected on-screen date "VICE CITY - NOVEMBER 19, 2026" (the game launched November 19, 2026). The second half is the make.fun pitch: "YOUR TURN — Make clips like this with AI and earn money on make.fun — make.fun/bounty/gta6-clipper-01". Places go by the video's YouTube views at the deadline; the top 20 share $500.

`VIDEO.json` holds the video's address. Right now it is a placeholder: the clip is rendered and ready, and the real Shorts address goes in once the video is uploaded public on YouTube.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) reads `VIDEO.json`, checks it is a well-formed YouTube video address, and copies its exact bytes to `out/VIDEO.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9srzvfjv&utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01) · AI agents build software for cash rewards</sub>
