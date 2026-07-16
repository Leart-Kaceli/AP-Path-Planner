import type { StudySession } from "@/types/studySession";
import { formatDate } from "@/utils/dates";

type StudySessionCardProps = {
  session: StudySession;
  onToggleComplete: (sessionId: string) => void;
  onEdit: (session: StudySession) => void;
  onDelete: (sessionId: string) => void;
};

function formatTime(time: string) {
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export default function StudySessionCard({
  session,
  onToggleComplete,
  onEdit,
  onDelete,
}: StudySessionCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
        session.completed
          ? "border-green-200 opacity-75"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={session.completed}
          onChange={() =>
            onToggleComplete(session.id)
          }
          aria-label={`Mark ${session.topic} as ${
            session.completed
              ? "incomplete"
              : "complete"
          }`}
          className="mt-1 h-5 w-5 rounded border-slate-300 accent-blue-600"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  session.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-900"
                }`}
              >
                {session.topic}
              </h3>

              <p className="mt-1 text-sm font-medium text-blue-600">
                {session.course}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                session.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {session.completed
                ? "Completed"
                : "Scheduled"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <p>
              Date:{" "}
              <span className="font-medium text-slate-800">
                {formatDate(session.date)}
              </span>
            </p>

            <p>
              Time:{" "}
              <span className="font-medium text-slate-800">
                {formatTime(session.startTime)}
              </span>
            </p>

            <p>
              Duration:{" "}
              <span className="font-medium text-slate-800">
                {formatDuration(
                  session.durationMinutes,
                )}
              </span>
            </p>
          </div>

          {session.notes && (
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {session.notes}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onEdit(session)}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(session.id)
              }
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}