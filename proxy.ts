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

async function getUpdater() {
  const res = await fetch(
    `https://github.com/${repo}/releases/latest/download/latest.json`
  );
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
  generateProxy(updater, "mirror.ghproxy.com");
  generateProxy(updater, "ghproxy.com");
}

generateProxies();
