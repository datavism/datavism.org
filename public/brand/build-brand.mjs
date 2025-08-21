import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const SRC = "brand/svg";
const OUT = "brand/dist";
const ensure = p => fs.mkdirSync(p, { recursive: true });

ensure(OUT);
ensure(`${OUT}/png`);
ensure(`${OUT}/jpg`);
ensure(`${OUT}/favicons`);
ensure(`${OUT}/social`);

const files = {
  icon_light: "g3-neon-ghost-icon-light.svg",
  icon_dark: "g3-neon-ghost-icon-dark.svg",
  w_lc_light: "g3-neon-ghost-lc-wordmark-light.svg",
  w_lc_dark: "g3-neon-ghost-lc-wordmark-dark.svg",
  w_uc_light: "g3-neon-ghost-uc-wordmark-light.svg",
  w_uc_dark: "g3-neon-ghost-uc-wordmark-dark.svg"
};

const faviconSizes = [16,32,48,64,180,192,256,512];
const iconSizes = [256,512,1024,2048];
const wordWidths = [800,1600,2400];

const blackJpg = async (pngPath, jpgPath) => {
  const png = sharp(pngPath).png();
  const { width, height } = await png.metadata();
  const bg = await sharp({ create: { width, height, channels: 3, background: "#000000" } }).png().toBuffer();
  const comp = await sharp(bg).composite([{ input: await png.toBuffer() }]).jpeg({ quality: 92, progressive: true }).toBuffer();
  await sharp(comp).toFile(jpgPath);
};

// 1) ICONS
for (const v of ["icon_light","icon_dark"]) {
  for (const s of iconSizes) {
    const inFile = path.join(SRC, files[v]);
    const outFile = path.join(OUT, "png", `${v}-${s}.png`);
    await sharp(inFile, { density: 600 }).resize(s, s).png().toFile(outFile);
    await blackJpg(outFile, path.join(OUT, "jpg", `${v}-${s}.jpg`));
  }
}

// 2) WORDMARKS
for (const v of ["w_lc_light","w_lc_dark","w_uc_light","w_uc_dark"]) {
  for (const w of wordWidths) {
    const inFile = path.join(SRC, files[v]);
    const outFile = path.join(OUT, "png", `${v}-w${w}.png`);
    await sharp(inFile, { density: 600 }).resize({ width: w }).png().toFile(outFile);
    await blackJpg(outFile, path.join(OUT, "jpg", `${v}-w${w}.jpg`));
  }
}

// 3) FAVICONS (aus icon_light)
const baseIcon = path.join(SRC, files.icon_light);
const favPngs = [];
for (const s of faviconSizes) {
  const p = path.join(OUT, "favicons", `favicon-${s}.png`);
  await sharp(baseIcon, { density: 600 }).resize(s, s).png().toFile(p);
  if ([16,32,48].includes(s)) favPngs.push(p);
}
// favicon.ico
const icoBuf = await pngToIco(favPngs);
fs.writeFileSync(path.join(OUT, "favicons", "favicon.ico"), icoBuf);

// 4) SOCIAL COMPOSITES (dunkler Hintergrund, light-Varianten)
const social = {
  "og_1200x630.jpg": [1200, 630],
  "twitter_1600x900.jpg": [1600, 900],
  "linkedin_1200x627.jpg": [1200, 627],
  "instagram_1080x1080.jpg": [1080, 1080],
  "twitter_header_1500x500.jpg": [1500, 500]
};
const icon1024 = path.join(OUT, "png", "icon_light-1024.png");
const word1600 = path.join(OUT, "png", "w_lc_light-w1600.png");

for (const [name, [W,H]] of Object.entries(social)) {
  const bg = await sharp({ create: { width: W, height: H, channels: 3, background: "#000000" } }).png().toBuffer();
  // Icon links, Wortmarke rechts
  const targetH = Math.floor(H * 0.7);
  const iconBuf = await sharp(icon1024).resize(targetH, targetH, { fit: "inside" }).png().toBuffer();
  // verbleibende Breite
  const iconMeta = await sharp(iconBuf).metadata();
  const remW = W - iconMeta.width - Math.floor(W*0.08)*3;
  const wordBuf = await sharp(word1600).resize({ width: remW, height: targetH, fit: "inside" }).png().toBuffer();

  // Komposition
  let x = Math.floor(W*0.08), y = Math.floor((H - iconMeta.height)/2);
  const comp = await sharp(bg)
    .composite([{ input: iconBuf, left: x, top: y }])
    .toBuffer();

  const wordMeta = await sharp(wordBuf).metadata();
  const comp2 = await sharp(comp)
    .composite([{ input: wordBuf, left: x + iconMeta.width + Math.floor(W*0.08), top: Math.floor((H - wordMeta.height)/2) }])
    .jpeg({ quality: 92, progressive: true })
    .toFile(path.join(OUT, "social", name));
}

console.log("✅ Brand kit built to:", OUT);
