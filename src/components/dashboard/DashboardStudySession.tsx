import type { StudySession } from "@/types/studySession";
import { formatDate } from "@/utils/dates";

type DashboardStudySessionProps = {
  session: StudySession;
};

function formatTime(time: string) {
  const [hoursText, minutesText] =
    time.split(":");

  const date = new Date();

  date.setHours(
    Number(hoursText),
    Number(minutesText),
    0,
    0,
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}

export default function DashboardStudySession({
  session,
}: DashboardStudySessionProps) {
  return (
    <article className="border-b border-slate-200 py-5 last:border-b-0">
      <h3 className="font-semibold text-slate-900">
        {session.topic}
      </h3>

      <p className="mt-1 text-sm font-medium text-blue-600">
        {session.course}
      </p>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
        <span>{formatDate(session.date)}</span>

        <span>
          {formatTime(session.startTime)}
        </span>

        <span>
          {session.durationMinutes} minutes
        </span>
      </div>
    </article>
  );
}