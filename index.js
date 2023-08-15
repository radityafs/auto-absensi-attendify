import fetch from "node-fetch";
import fs from "fs";
import { CronJob } from "cron";

const sendAttendance = async (idUser) => {
  try {
    let i = 0;
    const date = new Date();
    const hour = date.getHours();
    const clockInOut = hour < 12 ? "1" : "0";

    const response = await fetch(
      `https://attendify.id/clockInOut/${idUser}/${clockInOut}`
    );

    const data = await response.json();
    if (data.Success === true) {
      console.log(`Success ${clockInOut === "1" ? "Clock In" : "Clock Out"}`);

      fs.appendFileSync(
        "./log.txt",
        `${date} | ${clockInOut} | Success\n`,
        "utf-8"
      );
    } else {
      fs.appendFileSync(
        "./log.txt",
        `${date} | ${clockInOut} | Failed\n`,
        "utf-8"
      );

      if (i < 5) {
        i++;
        sendAttendance(idUser);
      }
    }
  } catch (error) {
    fs.appendFileSync(
      "./log.txt",
      `${date} | ${clockInOut} | ${error.message}\n`,
      "utf-8"
    );
    console.log(`${date} | ${clockInOut} | ${error.message}`);
  }
};

(async () => {
  const idUser = "0";
  const job = new CronJob(
    "0 8,16 * * *",
    () => {
      sendAttendance(idUser);
    },
    null,
    true,
    "Asia/Jakarta"
  );
  job.start();
})();
