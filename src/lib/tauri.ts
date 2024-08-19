import { Command } from "@tauri-apps/api/shell";
import { useOsStore } from "@/store/os";

const { os } = useOsStore()

export function killApps(apps: any) {
  if (os == "win32") {
    for (const app of apps) {
      new Command("kill-win", ["/IM", app, "/F"]).execute();
    }
  } else if (os === "darwin") {
    for (const app of apps) {
      new Command("kill-mac", app).execute();
    }
  } else if (os === "linux") {
    for (const app of apps) {
      new Command("kill-linux", app).execute();
    }
  } else {
    return console.error("Unsupported platform");
  }
}

export async function getLocalApps(): Promise<string> {
  let commandName: string = "";
  if (os === "darwin") {
    commandName = "apps-mac";
  } else if (os === "win32") {
    commandName = "apps-win";
  } else if (os === "linux") {
    commandName = "apps-linux";
  } else {
    return "Unsupported platform";
  }
  const command = new Command(commandName);
  const output = await command.execute();
  return output.stdout;
}
