import { Plus } from "lucide-react";
import * as React from "react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";

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
  return (
    <Sidebar {...props}>
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
