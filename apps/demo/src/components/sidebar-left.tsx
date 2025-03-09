import { Plus, PlusIcon } from "lucide-react";
import * as React from "react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { addMinutes, useCalendar } from "@illostack/react-calendar";

const data = {
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"]
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"]
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"]
    }
  ]
};

const SidebarLeft = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const calendar = useCalendar();
  const translations = calendar.getTranslations();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="default"
              aria-label={translations.action["create-event"]}
              onClick={() =>
                calendar.openCreationForm({
                  startAt: new Date(),
                  endAt: addMinutes(new Date(), 45)
                })
              }
              className="w-full"
            >
              <PlusIcon />
              <span>{translations.action["create-event"]}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { SidebarLeft };
