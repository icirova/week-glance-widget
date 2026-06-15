import { css } from "uebersicht";

const REFRESH_MS = 15 * 60 * 1000;
const WEEKDAYS_SHORT = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
const ICAL_WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const ERROR_PREFIX = "__WEEK_GLANCE_ERROR__:";
const CZECH_NAME_DAY_MONTHS = [
  ["", "Karina", "Radmila", "Diana", "Dalimil", "", "Vilma", "Čestmír", "Vladan", "Břetislav", "Bohdana", "Pravoslav", "Edita", "Radovan", "Alice", "Ctirad", "Drahoslav", "Vladislav", "Doubravka", "Ilona", "Běla", "Slavomír", "Zdeněk", "Milena", "Miloš", "Zora", "Ingrid", "Otýlie", "Zdislava", "Robin", "Marika"],
  ["Hynek, Jasmína", "Nela", "Blažej", "Jarmila", "Dobromila", "Vanda, Arjuna", "Veronika", "Milada", "Apolena", "Mojmír", "Božena", "Slavěna", "Věnceslav", "Valentýn", "Jiřina", "Ljuba", "Miloslava", "Gizela", "Patrik", "Oldřich", "Lenka", "Petr", "Svatopluk", "Matěj", "Liliana", "Dorota", "Alexandr", "Lumír", "Horymír"],
  ["Bedřich", "Anežka", "Kamil", "Stela", "Kazimír", "Miroslav", "Tomáš", "Gabriela", "Františka", "Viktorie", "Anděla", "Řehoř", "Růžena", "Rút, Matylda", "Ida", "Elena, Herbert", "Vlastimil", "Eduard", "Josef", "Světlana", "Radek", "Leona", "Ivona", "Gabriel", "Marián", "Emanuel", "Dita", "Soňa", "Taťána", "Arnošt", "Kvido"],
  ["Hugo", "Erika", "Richard", "Ivana", "Miroslava", "Vendula", "Heřman", "Ema", "Dušan", "Darja", "Izabela", "Julius", "Aleš", "Vincenc", "Anastázie", "Irena", "Rudolf", "Valérie", "Rostislav", "Marcela", "Alexandra", "Evženie", "Vojtěch", "Jiří", "Marek", "Oto", "Jaroslav", "Vlastislav", "Robert", "Blahoslav"],
  ["", "Zikmund", "Alexej", "Květoslav", "Klaudie", "Radoslav", "Stanislav", "", "Ctibor", "Blažena", "Svatava", "Pankrác", "Servác", "Bonifác", "Žofie", "Přemysl", "Aneta", "Nataša", "Ivo a Engelbert", "Zbyšek", "Monika", "Emil", "Vladimír", "Jana", "Viola", "Filip", "Valdemar", "Vilém", "Maxmilián", "Ferdinand", "Kamila"],
  ["Laura", "Jarmil", "Tamara", "Dalibor", "Dobroslav", "Norbert", "Iveta", "Medard", "Stanislava", "Gita", "Bruno", "Antonie", "Antonín", "Roland", "Vít", "Zbyněk", "Adolf", "Milan", "Leoš", "Květa, Květuše", "Alois", "Pavla", "Zdeňka", "Jan", "Ivan", "Adriana", "Ladislav", "Lubomír", "Petr a Pavel", "Šárka"],
  ["Jaroslava", "Patricie", "Radomír", "Prokop", "Cyril a Metoděj", "", "Bohuslava", "Nora", "Drahoslava", "Libuše, Amálie", "Olga", "Bořek", "Markéta", "Karolína", "Jindřich", "Luboš", "Martina", "Drahomíra", "Čeněk", "Ilja", "Vítězslav", "Magdaléna", "Libor", "Kristýna", "Jakub", "Anna", "Věroslav", "Viktor", "Marta", "Bořivoj", "Ignác"],
  ["Oskar", "Gustav", "Miluše", "Dominik", "Kristián", "Oldřiška", "Lada", "Soběslav", "Roman", "Vavřinec", "Zuzana", "Klára", "Alena", "Alan", "Hana", "Jáchym", "Petra", "Helena", "Ludvík", "Bernard", "Johana", "Bohuslav", "Sandra", "Bartoloměj", "Radim", "Luděk", "Otakar", "Augustýn", "Evelína", "Vladěna", "Pavlína"],
  ["Linda, Samuel", "Adéla", "Bronislav, Bronislava", "Jindřiška", "Boris", "Boleslav", "Regina, Regína", "Mariana", "Daniela", "Irma", "Denisa", "Marie", "Lubor", "Radka", "Jolana", "Ludmila", "Naděžda", "Kryštof", "Zita", "Oleg", "Matouš", "Darina", "Berta", "Jaromír", "Zlata", "Andrea", "Jonáš", "Václav", "Michal", "Jeroným"],
  ["Igor", "Olívie, Oliver", "Bohumil", "František", "Eliška", "Hanuš", "Justýna", "Věra", "Štefan, Sára", "Marina", "Andrej", "Marcel", "Renáta", "Agáta", "Tereza", "Havel", "Hedvika", "Lukáš", "Michala", "Vendelín", "Brigita", "Sabina", "Teodor", "Nina", "Beáta", "Erik", "Šarlota, Zoe", "", "Silvie", "Tadeáš", "Štěpánka"],
  ["Felix, Kani", "", "Hubert", "Karel", "Miriam", "Liběna", "Saskie", "Bohumír", "Bohdan", "Evžen", "Martin", "Benedikt", "Tibor", "Sáva", "Leopold", "Otmar", "Mahulena", "Romana", "Alžběta", "Nikola", "Albert", "Cecílie", "Klement", "Emílie", "Kateřina", "Artur", "Xenie", "René", "Zina", "Ondřej"],
  ["Iva", "Blanka", "Svatoslav", "Barbora", "Jitka", "Mikuláš", "Ambrož", "Květoslava", "Vratislav", "Julie", "Dana", "Simona", "Lucie", "Lýdie", "Radana", "Albína", "Daniel", "Miloslav", "Ester", "Dagmar", "Natálie", "Šimon", "Vlasta", "Adam a Eva", "", "Štěpán", "Žaneta", "Bohumila", "Judita", "David", "Silvestr"],
];

export const refreshFrequency = REFRESH_MS;

export const command = `/bin/zsh -lc 'config_file="$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget/config.local.json"; url=$(/usr/bin/plutil -extract calendarIcsUrl raw -o - "$config_file" 2>/dev/null); if [[ -z "$url" || "$url" == "PASTE_YOUR_SECRET_ICAL_URL_HERE" ]]; then echo "${ERROR_PREFIX}V config.local.json chybí calendarIcsUrl."; exit 0; fi; /usr/bin/curl -fsSL "$url" || echo "${ERROR_PREFIX}Kalendář se nepodařilo načíst."'`;

export const className = `
  top: 26px;
  right: 28px;
  width: 280px;
  z-index: 10;
  pointer-events: none;
`;

const widget = css`
  box-sizing: border-box;
  width: 280px;
  padding: 16px 16px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(22, 24, 27, 0.58);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 13px;
  line-height: 1.35;
  letter-spacing: 0;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

const title = css`
  margin: 0 0 13px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
`;

const dayBlock = css`
  margin-top: 13px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const dayHeading = css`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 6px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
`;

const todayPill = css`
  padding: 1px 6px 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.86);
  font-size: 10px;
  font-weight: 650;
`;

const eventRow = css`
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  column-gap: 4px;
  min-height: 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const bullet = css`
  color: rgba(255, 255, 255, 0.42);
  font-size: 14px;
  line-height: 1.45;
`;

const eventText = css`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const eventTime = css`
  margin-right: 6px;
  color: rgba(255, 255, 255, 0.58);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const quiet = css`
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
`;

export const render = ({ output, error }) => {
  const { status, days, message } = buildRenderState(output, error);

  return (
    <section className={widget}>
      <h1 className={title}>Tento týden</h1>

      {status === "error" ? (
        <p className={quiet}>{message}</p>
      ) : status === "loading" ? (
        <p className={quiet}>Načítání kalendáře...</p>
      ) : days.length === 0 ? (
        <p className={quiet}>Žádné události ani jmeniny na příštích 7 dní.</p>
      ) : (
        <div>
          {days.map((day) => (
            <section className={dayBlock} key={day.key}>
              <h2 className={dayHeading}>
                <span>
                  {day.label}
                  {day.nameDay ? ` (${day.nameDay})` : ""}
                </span>
                {day.isToday ? <span className={todayPill}>dnes</span> : null}
              </h2>
              {day.events.map((event) => (
                <div className={eventRow} key={event.key}>
                  <span className={bullet}>•</span>
                  <span className={eventText}>
                    {event.time ? <span className={eventTime}>{event.time}</span> : null}
                    {event.title}
                  </span>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

function buildRenderState(output, error) {
  if (error) {
    return errorState("Kalendář se nepodařilo načíst.");
  }

  const icsText = typeof output === "string" ? output.trim() : "";

  if (!icsText) {
    return { status: "loading", days: [], message: "Načítání kalendáře..." };
  }

  if (icsText.startsWith(ERROR_PREFIX)) {
    return errorState(icsText.slice(ERROR_PREFIX.length).trim());
  }

  try {
    const now = new Date();
    const windowStart = startOfDay(now);
    const windowEnd = addDays(windowStart, 7);
    const events = parseIcsEvents(icsText, windowStart, windowEnd);

    return {
      status: "ready",
      days: groupEventsByDay(events, windowStart, windowEnd),
      message: null,
    };
  } catch (parseError) {
    return errorState("Kalendář se nepodařilo zpracovat.");
  }
}

function errorState(message) {
  return {
    status: "error",
    days: [],
    message,
  };
}

function parseIcsEvents(icsText, windowStart, windowEnd) {
  const rawEvents = parseVEvents(icsText);
  const overrides = new Map();
  const masters = [];
  const instances = [];

  rawEvents.forEach((event) => {
    if (event.recurrenceId && event.uid) {
      overrides.set(`${event.uid}|${event.recurrenceId.key}`, event);
    } else {
      masters.push(event);
    }
  });

  masters.forEach((event) => {
    if (event.status === "CANCELLED") {
      return;
    }

    if (event.rrule) {
      expandRecurringEvent(event, overrides, windowStart, windowEnd).forEach((instance) => {
        instances.push(instance);
      });
      return;
    }

    if (eventOverlapsWindow(event.start.date, event.end.date, windowStart, windowEnd)) {
      instances.push(toInstance(event, event.start.date, event.end.date));
    }
  });

  rawEvents.forEach((event) => {
    if (!event.recurrenceId || event.status === "CANCELLED") {
      return;
    }

    const hasMaster = masters.some((master) => master.uid && master.uid === event.uid);
    if (!hasMaster && eventOverlapsWindow(event.start.date, event.end.date, windowStart, windowEnd)) {
      instances.push(toInstance(event, event.start.date, event.end.date));
    }
  });

  return instances
    .filter((event) => eventOverlapsWindow(event.start, event.end, windowStart, windowEnd))
    .sort((left, right) => {
      if (left.start.getTime() !== right.start.getTime()) {
        return left.start - right.start;
      }
      if (left.allDay !== right.allDay) {
        return left.allDay ? -1 : 1;
      }
      return left.title.localeCompare(right.title);
    });
}

function parseVEvents(icsText) {
  const lines = unfoldLines(icsText).split(/\r?\n/);
  const events = [];
  let current = null;

  lines.forEach((line) => {
    if (line === "BEGIN:VEVENT") {
      current = [];
      return;
    }

    if (line === "END:VEVENT") {
      if (current) {
        const event = parseEventLines(current);
        if (event) {
          events.push(event);
        }
      }
      current = null;
      return;
    }

    if (current) {
      current.push(line);
    }
  });

  return events;
}

function unfoldLines(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function parseEventLines(lines) {
  const fields = {};
  const exDates = [];

  lines.forEach((line) => {
    const content = parseContentLine(line);
    if (!content) {
      return;
    }

    if (content.name === "EXDATE") {
      parseDateList(content.value, content.params).forEach((dateValue) => {
        exDates.push(dateValue.key);
      });
      return;
    }

    fields[content.name] = content;
  });

  if (!fields.DTSTART) {
    return null;
  }

  const start = parseDateValue(fields.DTSTART.value, fields.DTSTART.params);
  const end = fields.DTEND
    ? parseDateValue(fields.DTEND.value, fields.DTEND.params)
    : defaultEnd(start);
  const recurrenceId = fields["RECURRENCE-ID"]
    ? parseDateValue(fields["RECURRENCE-ID"].value, fields["RECURRENCE-ID"].params)
    : null;

  return {
    uid: fields.UID ? fields.UID.value : "",
    title: fields.SUMMARY ? unescapeIcsText(fields.SUMMARY.value) : "Bez nazvu",
    start,
    end,
    duration: end.date.getTime() - start.date.getTime(),
    allDay: start.allDay,
    status: fields.STATUS ? fields.STATUS.value.toUpperCase() : "CONFIRMED",
    rrule: fields.RRULE ? parseRRule(fields.RRULE.value) : null,
    exDates: new Set(exDates),
    recurrenceId,
  };
}

function parseContentLine(line) {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }

  const rawName = line.slice(0, colonIndex);
  const value = line.slice(colonIndex + 1);
  const [namePart, ...paramParts] = rawName.split(";");
  const params = {};

  paramParts.forEach((part) => {
    const equalsIndex = part.indexOf("=");
    if (equalsIndex === -1) {
      return;
    }

    params[part.slice(0, equalsIndex).toUpperCase()] = part.slice(equalsIndex + 1);
  });

  return {
    name: namePart.toUpperCase(),
    params,
    value,
  };
}

function parseDateList(value, params) {
  return value.split(",").map((item) => parseDateValue(item, params));
}

function parseDateValue(value, params = {}) {
  const allDay = params.VALUE === "DATE" || /^\d{8}$/.test(value);

  if (allDay) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    const date = new Date(year, month, day);

    return {
      date,
      allDay: true,
      key: formatDateKey(date),
    };
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(9, 11) || "0");
  const minute = Number(value.slice(11, 13) || "0");
  const second = Number(value.slice(13, 15) || "0");
  const date = value.endsWith("Z")
    ? new Date(Date.UTC(year, month, day, hour, minute, second))
    : new Date(year, month, day, hour, minute, second);

  return {
    date,
    allDay: false,
    key: formatDateTimeKey(date),
  };
}

function defaultEnd(start) {
  return {
    date: start.allDay ? addDays(start.date, 1) : new Date(start.date.getTime()),
    allDay: start.allDay,
    key: start.key,
  };
}

function parseRRule(value) {
  return value.split(";").reduce((rule, part) => {
    const [key, rawValue] = part.split("=");
    if (!key || rawValue === undefined) {
      return rule;
    }

    rule[key.toUpperCase()] = rawValue;
    return rule;
  }, {});
}

function expandRecurringEvent(event, overrides, windowStart, windowEnd) {
  const frequency = event.rrule.FREQ;
  const interval = Math.max(Number(event.rrule.INTERVAL || "1"), 1);
  const until = event.rrule.UNTIL ? parseDateValue(event.rrule.UNTIL).date : null;
  const count = event.rrule.COUNT ? Number(event.rrule.COUNT) : null;
  const candidates = [];

  if (frequency === "DAILY") {
    expandDaily(event, interval, until, count, windowEnd, candidates);
  } else if (frequency === "WEEKLY") {
    expandWeekly(event, interval, until, count, windowEnd, candidates);
  } else if (frequency === "MONTHLY") {
    expandMonthly(event, interval, until, count, windowEnd, candidates);
  }

  return candidates.flatMap((start) => {
    const key = event.allDay ? formatDateKey(start) : formatDateTimeKey(start);

    if (event.exDates.has(key)) {
      return [];
    }

    const override = event.uid ? overrides.get(`${event.uid}|${key}`) : null;
    if (override && override.status === "CANCELLED") {
      return [];
    }

    const instanceEvent = override || event;
    const instanceStart = override ? override.start.date : start;
    const instanceEnd = override
      ? override.end.date
      : new Date(instanceStart.getTime() + event.duration);

    if (!eventOverlapsWindow(instanceStart, instanceEnd, windowStart, windowEnd)) {
      return [];
    }

    return [toInstance(instanceEvent, instanceStart, instanceEnd)];
  });
}

function expandDaily(event, interval, until, count, windowEnd, candidates) {
  let current = new Date(event.start.date);
  let generated = 0;

  while (shouldContinue(current, until, count, generated, windowEnd)) {
    candidates.push(new Date(current));
    generated += 1;
    current = addDays(current, interval);
  }
}

function expandWeekly(event, interval, until, count, windowEnd, candidates) {
  const byDays = event.rrule.BYDAY
    ? event.rrule.BYDAY.split(",").map((day) => ICAL_WEEKDAYS.indexOf(day)).filter((day) => day >= 0)
    : [event.start.date.getDay()];
  const firstWeekStart = startOfIcsWeek(event.start.date);
  let weekStart = new Date(firstWeekStart);
  let generated = 0;

  while (shouldContinue(weekStart, until, count, generated, windowEnd)) {
    const weekDates = byDays
      .map((day) => addDays(weekStart, day === 0 ? 6 : day - 1))
      .sort((left, right) => left - right);

    for (let index = 0; index < weekDates.length; index += 1) {
      const candidate = copyTime(weekDates[index], event.start.date);
      if (candidate < event.start.date) {
        continue;
      }
      if (!shouldContinue(candidate, until, count, generated, windowEnd)) {
        return;
      }

      candidates.push(candidate);
      generated += 1;
    }

    weekStart = addDays(weekStart, interval * 7);
  }
}

function expandMonthly(event, interval, until, count, windowEnd, candidates) {
  const originalDay = event.start.date.getDate();
  let current = new Date(event.start.date);
  let generated = 0;

  while (shouldContinue(current, until, count, generated, windowEnd)) {
    candidates.push(new Date(current));
    generated += 1;
    current = addMonthsClamped(current, interval, originalDay);
  }
}

function shouldContinue(candidate, until, count, generated, windowEnd) {
  if (count !== null && generated >= count) {
    return false;
  }

  if (until && candidate > until) {
    return false;
  }

  return candidate < windowEnd;
}

function toInstance(event, start, end) {
  return {
    key: `${event.uid || event.title}-${start.getTime()}`,
    title: event.title,
    start,
    end,
    allDay: event.allDay,
    time: event.allDay ? "" : formatTimeRange(start, end),
  };
}

function groupEventsByDay(events, windowStart, windowEnd) {
  const grouped = new Map();
  const todayKey = formatDateKey(windowStart);
  let day = new Date(windowStart);

  while (day < windowEnd) {
    const dayKey = formatDateKey(day);
    grouped.set(dayKey, buildDay(day, todayKey));
    day = addDays(day, 1);
  }

  events.forEach((event) => {
    const firstDay = event.allDay ? startOfDay(event.start) : startOfDay(event.start);
    const lastDay = event.allDay ? addDays(startOfDay(event.end), -1) : startOfDay(event.start);
    let eventDay = maxDate(firstDay, windowStart);

    while (eventDay <= lastDay && eventDay < windowEnd) {
      const dayKey = formatDateKey(eventDay);
      if (!grouped.has(dayKey)) {
        grouped.set(dayKey, buildDay(eventDay, todayKey));
      }

      grouped.get(dayKey).events.push({
        key: `${event.key}-${dayKey}`,
        title: event.title,
        time: event.allDay ? "" : event.time,
        sortValue: event.allDay ? -1 : event.start.getTime(),
      });

      eventDay = addDays(eventDay, 1);
    }
  });

  return Array.from(grouped.values()).map((day) => ({
    ...day,
    events: day.events.sort((left, right) => {
      if (left.time !== right.time) {
        if (!left.time) return -1;
        if (!right.time) return 1;
        return left.sortValue - right.sortValue;
      }
      return left.title.localeCompare(right.title);
    }),
  }));
}

function buildDay(date, todayKey) {
  const key = formatDateKey(date);

  return {
    key,
    label: formatDayLabel(date),
    isToday: key === todayKey,
    nameDay: getNameDay(date),
    events: [],
  };
}

function eventOverlapsWindow(start, end, windowStart, windowEnd) {
  return end > windowStart && start < windowEnd;
}

function unescapeIcsText(value) {
  return value
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfIcsWeek(date) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(startOfDay(date), mondayOffset);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds());
}

function addMonthsClamped(date, months, originalDay) {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(originalDay, lastDay));
  return next;
}

function copyTime(date, timeSource) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds()
  );
}

function maxDate(left, right) {
  return left > right ? left : right;
}

function formatDayLabel(date) {
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()}. ${date.getMonth() + 1}.`;
}

function getNameDay(date) {
  const month = CZECH_NAME_DAY_MONTHS[date.getMonth()];
  return month ? month[date.getDate() - 1] || "" : "";
}

function formatTime(date) {
  return `${date.getHours()}:${pad(date.getMinutes())}`;
}

function formatTimeRange(start, end) {
  if (!end || end <= start || !isSameDay(start, end)) {
    return formatTime(start);
  }

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDateKey(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function formatDateTimeKey(date) {
  return `${formatDateKey(date)}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
