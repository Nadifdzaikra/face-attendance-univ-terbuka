import { ReactNode, useEffect, useState } from "react";
import {
  CheckIcon,
  UserPlusIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.107.18:8009/api";

interface ActivityItemProps {
  icon?: ReactNode;
  color?: string;
  bgColor?: string;
  title?: string;
  time?: string;
}


export function ActivityItem({
  icon = " ",
  color = "zinc",
  bgColor = "bg-zinc-100",
  title = " ",
  time = " ",
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor} dark:${bgColor.replace(
          "100",
          "900/30"
        )}`}
      >
        <div className={`flex items-center w-5 h-5 justify-center text-${color}-600 dark:text-${color}-400`}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-white capitalize">
          {title}
        </p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{time}</p>
      </div>
    </div>
  );
}

function getActivityStyle(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("absen masuk")) {
    return { icon: <CheckIcon />, color: "green", bgColor: "bg-green-100" };
  }
  if (lower.includes("akun")) {
    return { icon: <UserPlusIcon />, color: "blue", bgColor: "bg-blue-100" };
  }
  if (lower.includes("terlambat")) {
    return { icon: <ClockIcon />, color: "amber", bgColor: "bg-amber-100" };
  }
  if (lower.includes("laporan masalah")) {
    return { icon: <FileTextIcon />, color: "red", bgColor: "bg-red-100" };
  }
  if (lower.includes("izin") || lower.includes("sakit")) {
    return { icon: <FileTextIcon />, color: "purple", bgColor: "bg-purple-100" };
  }

  return { icon: <FileTextIcon />, color: "zinc", bgColor: "bg-zinc-100" };
}

const initialActivities = [
  { id: 0, title: "Memuat aktivitas...", time: "sedang memuat" },
];

function formatApiTimestamp(ts?: string) {
  if (!ts) return "baru saja";
  try {
    const [datePart, timePart] = ts.split(" ");
    const [day, month, year] = datePart.split("-");
    const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function formatISOTimestamp(ts?: string) {
  if (!ts) return "baru saja";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}


export default function ActivityCard() {
  const [dataFulled, setDataFulled] = useState(false);
  const [activities, setActivities] = useState(!dataFulled ? initialActivities : []);

  useEffect(() => {
    let mounted = true;
    setDataFulled(false);

    const fetchFirsts = async () => {
      try {
        const [usersRes, absRes, problemsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/users/first`),
          axios.get(`${API_URL}/absences/first`),
          axios.get(`${API_URL}/problems`),
        ]);

        const newItems: Array<{ id: number; title: string; time: string }> = [];

        if (usersRes.status === "fulfilled") {
          const data = usersRes.value.data;
          if (data && data.id) {
            newItems.push({
              id: data.id + 1000,
              title: `akun terdaftar - ${data.name}`,
              time: formatApiTimestamp(data.timestamps),
            });
          }
        }

        if (absRes.status === "fulfilled") {
          const data = absRes.value.data;
          if (data && data.id) {
            const status = (data.status || "").toLowerCase();
            const statusMap: Record<string, string> = {
              checkin: "absen masuk",
              checkout: "absen keluar",
              late: "terlambat",
            };
            const verb = statusMap[status] || "absensi";

            newItems.push({
              id: data.id + 2000,
              title: `${verb} - ${data.name}`,
              time: formatApiTimestamp(data.timestamps),
            });
          }
        }

        if (problemsRes.status === "fulfilled") {
          const data = problemsRes.value.data;
          if (Array.isArray(data) && data.length > 0) {
            const latestProblem = data[0];
            newItems.push({
              id: latestProblem.id + 3000,
              title: `laporan masalah - ${latestProblem.name}`,
              time: formatISOTimestamp(latestProblem.created_at),
            });
          }
        }

        if (mounted && newItems.length > 0) {
          setDataFulled(true);
          // setActivities((prev) => [...newItems, ...prev]);
          setActivities([...newItems]);
        }
      } catch (e) {
      }
    };

    fetchFirsts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-xl border border-amber-50 hover:border bg-linear-to-br from-white to-amber-50/50 p-6 shadow-sm dark:border-amber-900/30 dark:from-zinc-800 dark:to-amber-900/20">
      <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-4">
        {activities.map((item) => {
          const { icon, color, bgColor } = getActivityStyle(item.title);
          return (
            <ActivityItem
              key={item.id}
              icon={icon}
              color={color}
              bgColor={bgColor}
              title={item.title}
              time={item.time}
            />
          );
        })}
      </div>
    </div>
  );
}