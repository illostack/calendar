import {
  Columns3Icon,
  Columns4Icon,
  GalleryVerticalIcon,
  Grid3X3Icon,
  Plus,
  PlusIcon
} from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const calendar = useCalendar();
  const translations = calendar.getTranslations();
  const view = calendar.useWatch((state) => state.view);

  return (
    <Sidebar {...props}>
      {!isMobile ? (
        <SidebarHeader className="-mb-2">
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
      ) : (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={view === "day"}
                onClick={() => calendar.changeView("day")}
              >
                <GalleryVerticalIcon />
                {translations.literals.day}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={view === "range"}
                onClick={() => calendar.changeView("range", { days: 3 })}
              >
                <Columns3Icon />
                {"3"} {translations.literals.days}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={view === "week"}
                onClick={() => calendar.changeView("week")}
              >
                <Columns4Icon />
                {translations.literals.week}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={view === "month"}
                onClick={() => calendar.changeView("month")}
              >
                <Grid3X3Icon />
                {translations.literals.month}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}
      <SidebarContent>
        {!isMobile && <DatePicker />}
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
