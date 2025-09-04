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

const proxies = {
  "prefix": ["ghfast.top", "ghproxy.cn"],
  "replace": ["gh.nn.ci"]
} as const;

type ProxyType = keyof typeof proxies;

function generateProxy(updater: Updater, proxy: string, type: ProxyType) {
  const { platforms } = updater;
  for (const plat in platforms) {
    const raw_url = platforms[plat].url;
    if (type === "prefix") {
      platforms[plat].url = `https://${proxy}/` + raw_url;
    } else {
      platforms[plat].url = raw_url.replace("github.com", proxy);
    }
  }
  fs.writeFileSync(`${proxy}.proxy.json`, JSON.stringify(updater, null, 2));
}

async function generateProxies() {
  const updater = await getUpdater();
  for (const key in proxies) {
    for (const proxy of proxies[key]) {
      generateProxy(structuredClone(updater), proxy, key as ProxyType);
    }
  }
}

generateProxies();
