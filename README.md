# Week Glance Widget

Minimalisticky desktop widget pro macOS pres Übersicht. Zobrazuje udalosti z jednoho soukromeho Google Kalendare od dneska na dalsich 7 dni.

Widget cte Google Calendar iCal feed ze souboru `config.local.json`, ktery zustava pouze lokalne a neni v Gitu. MVP nema backend, OAuth, notifikace ani editaci udalosti.

## Instalace

1. Nainstaluj Übersicht: https://tracesof.net/uebersicht/
2. Vloz celou slozku `week-glance-widget` do Übersicht widgets slozky.
3. Pro vyvoj je pohodlnejsi pouzit symlink:

```sh
ln -s /Users/iveta/Desktop/PROJEKTY/week-glance-widget "$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget"
```

4. V Übersicht zvol `Refresh All Widgets`.

Hlavni widget je soubor `week-glance.jsx`. `config.local.json` musi lezet vedle nej ve stejne slozce.

## Lokální konfigurace

Zkopiruj priklad:

```sh
cp config.example.json config.local.json
```

Do `config.local.json` vloz svuj tajny iCal odkaz:

```json
{
  "calendarIcsUrl": "https://calendar.google.com/calendar/ical/..."
}
```

`config.local.json` je v `.gitignore`. Tajny iCal odkaz nesdilej a necommituj. Kdokoli s timto odkazem muze cist udalosti daneho kalendare. Pri uniku ho v Google Calendar resetuj a vloz novou hodnotu do lokalniho configu.

## Jak získat Google Calendar iCal odkaz

V Google Calendar otevri:

`Settings -> Settings for my calendars -> vybrat kalendar -> Integrate calendar -> Secret address in iCal format`

Zkopiruj hodnotu ze `Secret address in iCal format` do `config.local.json`.

## Chování

- obnovuje se kazdych 15 minut;
- zobrazuje jen dny, ktere maji udalost;
- celodenni udalosti zobrazuje bez casu;
- dnesni den je jemne zvyrazneny;
- pri prazdnem tydnu zobrazi klidny prazdny stav;
- pri chybe configu nebo feedu zobrazi strucnou chybu bez citlivych detailu.

Parser podporuje timed i all-day udalosti, vicedenní all-day udalosti a bezne opakovani `DAILY`, `WEEKLY`, `MONTHLY` vcetne `INTERVAL`, `COUNT`, `UNTIL`, weekly `BYDAY`, `EXDATE`, `RECURRENCE-ID` a `STATUS:CANCELLED`.
