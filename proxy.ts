import fs from "fs";

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

// console.log(process.env);

const repo = process.env.GITHUB_REPOSITORY!;
const version = process.env.VERSION;

async function getUpdater() {
  let url = `https://github.com/${repo}/releases/download/${version}/latest.json`;
  if (!version) {
    url = `https://github.com/${repo}/releases/latest/download/latest.json`;
  }
  const res = await fetch(url);
  const content = await res.json();
  const updater: Updater = content;
  return updater;
}

function generateProxy(updater: Updater, proxy: string) {
  const { platforms } = updater;
  for (const plat in platforms) {
    const raw_url = platforms[plat].url;
    platforms[plat].url = `https://${proxy}/` + raw_url;
  }
  fs.writeFileSync(`${proxy}.proxy.json`, JSON.stringify(updater, null, 2));
}

async function generateProxies() {
  const updater = await getUpdater();
  generateProxy(updater, "ghfast.top");
  generateProxy(updater, "ghproxy.cn");
}

generateProxies();
