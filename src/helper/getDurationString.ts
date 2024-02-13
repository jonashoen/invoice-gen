import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/de";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.locale("de");

const getDurationString = (
  startTime: Date | number,
  endTime?: Date | null,
  showSeconds = false
) => {
  const diff =
    typeof startTime === "number"
      ? startTime
      : dayjs.utc(endTime).diff(startTime);
  const duration = dayjs.duration(diff);

  const hours = duration.get("hours");
  const minutes = duration.get("minutes");
  const seconds = duration.get("seconds");

  const durationString = [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}min` : "",
    showSeconds ? `${seconds}s` : "",
  ].join(" ");

  const days = Math.floor(duration.asDays());

  return days > 0
    ? `${durationString} +${days} ${days > 1 ? "Tage" : "Tag"}`.trim()
    : durationString.trim();
};

export default getDurationString;
