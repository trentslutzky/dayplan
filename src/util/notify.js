import { shell } from "@tauri-apps/api";

export default async function Notify(text = "") {
  const test = new shell.Command("notify-send", ["DayPlan", text]);
  await test.spawn();
}
