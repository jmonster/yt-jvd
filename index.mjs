import { spawn } from "child_process";

// Get the first argument from the command line
const albumId = process.argv[2];
if (!albumId) throw new Error("Missing Album (playlist) ID");

const command = "yt-dlp";
const args = [
  "--output",
  "~/Desktop/yt-jvd/%(album)s/%(upload_date)s -- %(artist)s -- %(title)s.%(ext)s",
  "--add-metadata",
  "--embed-thumbnail",
  "--audio-format",
  "opus",
  "--format",
  "bestaudio",
  "--remux-video",
  "opus",
  `https://www.youtube.com/playlist?list=${albumId}`,
];

performTask();
function performTask() {
  const ytDlp = spawn(command, args);

  ytDlp.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ytDlp.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ytDlp.on("error", (error) => {
    // `yt-dlp` not installed
    if (error.code === "ENOENT") {
      const brew = spawn("brew", ["install", "yt-dlp"]);
      brew.on("close", performTask);

      // `brew` not installed
      brew.on("error", (brewErr) => {
        if (brewErr.code === "ENOENT") {
          console.error("Please, install Homebrew.");
        }
      });
    } else {
      console.error(`Error: ${error.message}`);
    }
  });
}
