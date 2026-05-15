# Week Glance Widget

Minimalisticky desktop widget pro macOS pres Übersicht. Zobrazuje udalosti z jednoho soukromeho Google Kalendare od dneska na dalsich 7 dni.

Widget cte Google Calendar iCal feed ze souboru `config.local.json`, ktery zustava pouze lokalne a neni v Gitu. MVP nema backend, OAuth, notifikace ani editaci udalosti.

Übersicht musi bezet na pozadi. Pokud ma widget bezet po restartu Macu, pridej Übersicht do `System Settings -> General -> Login Items`.

## Instalace

1. Nainstaluj Übersicht: https://tracesof.net/uebersicht/
2. Vloz celou slozku `week-glance-widget` do Übersicht widgets slozky.
3. Pro vyvoj je pohodlnejsi pouzit symlink:

```sh
ln -s /Users/iveta/Desktop/PROJEKTY/week-glance-widget "$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget"
```

4. Spust `Übersicht.app`.
5. V horni liste macOS klikni na ikonku Übersicht a zvol `Refresh All Widgets`.

Hlavni widget je soubor `week-glance.jsx`. `config.local.json` musi byt dostupny ve slozce:

```sh
$HOME/Library/Application Support/Übersicht/widgets/week-glance-widget/config.local.json
```

Symlink nebo slozka se proto musi jmenovat presne `week-glance-widget`.

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

Funkcnost odkazu muzes overit v anonymnim okne prohlizece. Pokud se stahne `.ics` soubor nebo se zobrazi text zacinajici `BEGIN:VCALENDAR`, odkaz je pro widget pouzitelny. Pokud Google vrati `404`, odkaz neni dostupny bez prihlaseni a widget ho nenacte.

## Jak získat Google Calendar iCal odkaz

V Google Calendar otevri:

`Settings -> Settings for my calendars -> vybrat kalendar -> Integrate calendar -> Secret address in iCal format`

Zkopiruj hodnotu ze `Secret address in iCal format` do `config.local.json`.

Pokud vidis jen `Public address in iCal format` a kalendar neni zverejneny verejne, bude tato adresa typicky vracet `404`. U Google Workspace muze byt `Secret address in iCal format` skryta nebo zakazana administratorem. V takovem pripade je potreba pozadat admina o povoleni soukrome iCal adresy, nebo widget prepracovat na Google Calendar API s OAuth.

## Troubleshooting

### Widget hlasi `V config.local.json chybí calendarIcsUrl`

Zkontroluj:

- soubor `config.local.json` existuje ve slozce `week-glance-widget`;
- slozka nebo symlink v Übersicht widgets se jmenuje presne `week-glance-widget`;
- v JSONu je klic presne `calendarIcsUrl`;
- hodnota neni placeholder `PASTE_YOUR_SECRET_ICAL_URL_HERE`;
- JSON je platny, vcetne uvozovek a carky.

### Widget hlasi `Kalendář se nepodařilo načíst`

Zkontroluj, ze iCal URL funguje bez prihlaseni. Nejrychlejsi test je otevrit ji v anonymnim okne prohlizece. Ocekavany vysledek je `.ics` feed zacinajici `BEGIN:VCALENDAR`.

### Po uprave se nic nezmenilo

V menu Übersicht zvol `Refresh All Widgets`. Pokud se stale zobrazuje stary stav nebo kus kodu, ukonci Übersicht uplne a znovu ho spust.

### Widget se vubec nezobrazuje

Zkontroluj, ze Übersicht bezi a ze je widget povoleny v menu aplikace. Widget je umisteny vpravo nahore (`top: 26px; right: 28px`), takze muze byt prekryty jinym widgetem nebo oknem.

## Chování

- obnovuje se kazdych 15 minut;
- zobrazuje jen dny, ktere maji udalost;
- celodenni udalosti zobrazuje bez casu;
- casovane udalosti zobrazuje jako rozsah, napr. `12:00 - 14:00`;
- dnesni den je jemne zvyrazneny;
- pri prazdnem tydnu zobrazi klidny prazdny stav;
- pri chybe configu nebo feedu zobrazi strucnou chybu bez citlivych detailu.

Parser podporuje timed i all-day udalosti, vicedenní all-day udalosti a bezne opakovani `DAILY`, `WEEKLY`, `MONTHLY` vcetne `INTERVAL`, `COUNT`, `UNTIL`, weekly `BYDAY`, `EXDATE`, `RECURRENCE-ID` a `STATUS:CANCELLED`.
