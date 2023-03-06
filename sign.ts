import fs from "fs";
import path from "path";
const files = [
  "https://ghproxy.com/https://github.com/alist-org/desktop-release/releases/latest/download/alist-desktop-proxy.json",
  "https://github.com/alist-org/desktop-release/releases/latest/download/alist-desktop.json",
];

interface Updater {
  name: string;
  notes: string;
  pub_date: string;
  platforms: {
    [platform: string]: {
      url: string;
      signature: string;
    };
  };
}

const replaceSign = async (file: string) => {
  const res = await fetch(file);
  const updater: Updater = await res.json();
  const { platforms } = updater;
  for (const plat in platforms) {
    const url = platforms[plat].signature;
    const res = await fetch(url);
    const text = await res.text();
    platforms[plat].signature = text;
  }
  fs.writeFileSync(path.basename(file), JSON.stringify(updater, null, 2));
};

files.forEach((file) => {
  replaceSign(file);
});
