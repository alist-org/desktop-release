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

const generateProxy = async () => {
  const res = await fetch(
    `https://github.com/${repo}/releases/latest/download/latest.json`
  );
  const content = await res.json();
  const updater: Updater = content;
  const { platforms } = updater;
  for (const plat in platforms) {
    const raw_url = platforms[plat].url;
    platforms[plat].url = "https://ghproxy.com/" + raw_url;
  }
  fs.writeFileSync("proxy.json", JSON.stringify(updater, null, 2));
};

generateProxy();
