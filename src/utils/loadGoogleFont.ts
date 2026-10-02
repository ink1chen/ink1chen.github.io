import fs from "fs";
import path from "path";

// Google Fonts only hands out TTF — the format Satori can read — to user
// agents that don't advertise woff2 support. Any modern UA string gets woff2,
// which Satori cannot parse.
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-de) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

const CJK_FAMILY = "Noto Sans SC";

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: string;
};

/**
 * Fetches a Noto Sans SC subset containing only the glyphs present in `text`.
 *
 * The local Inter faces have no CJK coverage, so without this every Chinese
 * character in an OG image renders as a blank box. Google Fonts subsets by
 * the `text` parameter, which keeps the download to a few KB.
 *
 * Returns null when the fetch fails (offline build, rate limit) so that OG
 * generation still succeeds with Latin-only coverage.
 */
async function loadCjkSubset(text: string): Promise<ArrayBuffer | null> {
  if (!text) return null;

  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      CJK_FAMILY
    )}&text=${encodeURIComponent(text)}`;

    const css = await fetch(url, {
      headers: { "User-Agent": LEGACY_UA },
    }).then(res => res.text());

    const src = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/
    )?.[1];
    if (!src) return null;

    return await fetch(src).then(res => res.arrayBuffer());
  } catch {
    return null;
  }
}

async function loadGoogleFonts(text = ""): Promise<FontEntry[]> {
  const read = (file: string) =>
    fs.readFileSync(path.resolve(`./src/assets/fonts/${file}`));

  const regular = read("inter-400.ttf");
  const bold = read("inter-700.ttf");

  // Satori needs an entry for every weight a template may render. We register
  // the real regular and bold faces and map the remaining weights onto bold,
  // so no fontWeight ever falls back to an unrelated default font.
  const fonts: FontEntry[] = [
    { name: "Inter", data: regular.buffer, weight: 400, style: "normal" },
    { name: "Inter", data: bold.buffer, weight: 600, style: "normal" },
    { name: "Inter", data: bold.buffer, weight: 700, style: "normal" },
    { name: "Inter", data: bold.buffer, weight: 900, style: "normal" },
  ];

  const cjkSubset = await loadCjkSubset(text);
  if (cjkSubset) {
    for (const weight of [400, 600, 700, 900]) {
      fonts.push({
        name: CJK_FAMILY,
        data: cjkSubset,
        weight,
        style: "normal",
      });
    }
  }

  return fonts;
}

export default loadGoogleFonts;
