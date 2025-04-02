import { faker } from "@faker-js/faker";
import {
  CALENDAR_COLORS,
  CalendarProvidedEvent,
  addDays
} from "@illostack/react-calendar";
import fs from "fs";
import path from "path";

const NUM_EVENTS = 10;
const minutes = [45, 60, 75, 90, 105, 120];
const refDate = addDays(new Date(), 10);

const events: CalendarProvidedEvent[] = Array.from(
  { length: NUM_EVENTS },
  () => {
    const startAt = faker.date.recent({ days: 20, refDate: refDate });
    const endAt = new Date(startAt);
    endAt.setMinutes(
      startAt.getMinutes() +
        minutes[Math.floor(Math.random() * minutes.length)]!
    );
    const color = faker.helpers.arrayElement(CALENDAR_COLORS);

    return {
      id: faker.string.uuid(),
      summary: faker.lorem.words(3),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      color
    };
  }
);

fs.writeFileSync(
  path.join(__dirname, "events.json"),
  JSON.stringify(events, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, "events.ts"),
  `import { CalendarProvidedEvent } from "@illostack/react-calendar";

export const events: CalendarProvidedEvent[] = ${JSON.stringify(events)};`
);

console.log(`Generated ${NUM_EVENTS} events`);
