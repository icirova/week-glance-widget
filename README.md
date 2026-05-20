# Week Glance Widget

Minimal desktop widget for macOS, built for Übersicht. It shows events from one private Google Calendar for today and the next 7 days.

The widget reads a Google Calendar iCal feed from `config.local.json`, which stays local and is not committed to Git. The MVP has no backend, OAuth, notifications, or event editing.

Übersicht must be running in the background. To start the widget automatically after restarting your Mac, add Übersicht to `System Settings -> General -> Login Items`.

## Installation

1. Install Übersicht: https://tracesof.net/uebersicht/
2. Put the whole `week-glance-widget` folder into the Übersicht widgets folder.
3. For development, using a symlink is more convenient:

```sh
ln -s /Users/iveta/Desktop/PROJEKTY/week-glance-widget "$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget"
```

4. Start `Übersicht.app`.
5. In the macOS menu bar, click the Übersicht icon and choose `Refresh All Widgets`.

The main widget file is `week-glance.jsx`. `config.local.json` must be available in:

```sh
$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget/config.local.json
```

The symlink or folder must therefore be named exactly `week-glance-widget`.

## Local Configuration

Copy the example config:

```sh
cp config.example.json config.local.json
```

Add your secret iCal URL to `config.local.json`:

```json
{
  "calendarIcsUrl": "https://calendar.google.com/calendar/ical/..."
}
```

`config.local.json` is listed in `.gitignore`. Do not share or commit the secret iCal URL. Anyone with this URL can read events from that calendar. If the URL leaks, reset it in Google Calendar and update your local config.

You can test the URL in a private browser window. If an `.ics` file downloads or the page shows text starting with `BEGIN:VCALENDAR`, the URL can be used by the widget. If Google returns `404`, the URL is not accessible without signing in and the widget will not load it.

## Getting the Google Calendar iCal URL

In Google Calendar, open:

`Settings -> Settings for my calendars -> select calendar -> Integrate calendar -> Secret address in iCal format`

Copy the value from `Secret address in iCal format` into `config.local.json`.

If you only see `Public address in iCal format` and the calendar is not public, that URL will usually return `404`. In Google Workspace accounts, `Secret address in iCal format` can be hidden or disabled by an administrator. In that case, ask the admin to enable private iCal addresses, or rebuild the widget to use the Google Calendar API with OAuth.

## Troubleshooting

### The widget says `V config.local.json chybí calendarIcsUrl`

Check that:

- `config.local.json` exists in the `week-glance-widget` folder;
- the folder or symlink inside Übersicht widgets is named exactly `week-glance-widget`;
- the JSON key is exactly `calendarIcsUrl`;
- the value is not the placeholder `PASTE_YOUR_SECRET_ICAL_URL_HERE`;
- the JSON is valid, including quotes and commas.

### The widget says `Kalendář se nepodařilo načíst`

Check that the iCal URL works without signing in. The quickest test is to open it in a private browser window. The expected result is an `.ics` feed starting with `BEGIN:VCALENDAR`.

### Nothing changed after editing

In the Übersicht menu, choose `Refresh All Widgets`. If the old state or a piece of code is still shown, quit Übersicht completely and start it again.

### The widget is not visible

Check that Übersicht is running and that the widget is enabled in the app menu. The widget is positioned in the top-right corner (`top: 26px; right: 28px`), so it may be covered by another widget or window.

## Behavior

- refreshes every 15 minutes;
- shows only days that have events;
- shows all-day events without a time;
- shows timed events as a range, for example `12:00 - 14:00`;
- subtly highlights today;
- shows a quiet empty state when the week has no events;
- shows a short error message without sensitive details when the config or feed cannot be loaded.

The parser supports timed and all-day events, multi-day all-day events, and common `DAILY`, `WEEKLY`, and `MONTHLY` recurrence rules, including `INTERVAL`, `COUNT`, `UNTIL`, weekly `BYDAY`, `EXDATE`, `RECURRENCE-ID`, and `STATUS:CANCELLED`.
