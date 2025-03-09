import { useCalendar } from "@illostack/react-calendar";
import { useIsMutating } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudUploadIcon,
  Search
} from "lucide-react";
import { parseAsNumberLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type AppHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const AppHeader: React.FC<AppHeaderProps> = ({ className, ...props }) => {
  const isMobile = useIsMobile();

  const [days, setDays] = useQueryState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(
    "days",
    parseAsNumberLiteral([1, 2, 3, 4, 5, 6, 7, 8, 9]).withDefault(1)
  );

  const isCreatingEvent = useIsMutating({
    mutationKey: ["createEvent"]
  });

  const isUpdatingEvent = useIsMutating({
    mutationKey: ["updateEvent"]
  });

  const isDeletingEvent = useIsMutating({
    mutationKey: ["deleteEvent"]
  });

  const isLoading = isCreatingEvent || isUpdatingEvent || isDeletingEvent;

  const calendar = useCalendar();

  const view = calendar.useWatch((state) => state.view);
  const date = calendar.useWatch((state) => state.date);
  const dates = calendar.useWatch((state) => state.dates);

  const title = useMemo(() => {
    const formatters = calendar.getFormatters();
    if (isMobile) {
      return formatters.date(date);
    }

    return {
      day: formatters.date(date),
      week: formatters.week(date),
      month: formatters.month(date),
      year: formatters.year(date),
      range: formatters.range(
        dates.at(0)?.date as Date,
        dates.at(-1)?.date as Date
      )
    }[view];
  }, [calendar, date, isMobile, view, dates]);

  useEffect(() => {
    const shortCuts = [
      {
        key: "ArrowLeft",
        handler: calendar.decreaseDate
      },
      {
        key: "ArrowRight",
        handler: calendar.increaseDate
      },
      {
        key: "t",
        handler: calendar.goToday
      },
      {
        key: "d",
        handler: () => calendar.changeView("day")
      },
      {
        key: "w",
        handler: () => calendar.changeView("week")
      },
      {
        key: "m",
        handler: () => calendar.changeView("month")
      },
      ...Array.from({ length: 9 }).map((_, index) => ({
        key: `${index + 2}`,
        handler: () => {
          calendar.changeView("range");
          setDays((index + 2) as 1);
        }
      }))
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) {
        return;
      }

      const shortcut = shortCuts.find((s) => s.key === e.key);

      if (shortcut) {
        shortcut.handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [calendar, setDays]);

  const translations = calendar.getTranslations();

  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-10 flex h-16 flex-none items-center gap-2 border-b px-4",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1 h-9 w-9 rounded-full" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            aria-label={translations.literals.today}
            onClick={calendar.goToday}
          >
            {translations.literals.today}
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={translations.literals.previous}
              onClick={calendar.decreaseDate}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={translations.literals.next}
              onClick={calendar.increaseDate}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}
      <h1 className="first-letter:ccalendartalize text-lg font-semibold">
        {title}
      </h1>
      {!!isLoading && (
        <CloudUploadIcon className="text-muted-foreground size-4 animate-pulse" />
      )}
      {!isMobile && (
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-28 justify-between">
                {view === "range"
                  ? `${days} ${translations.literals.days}`
                  : translations.literals[view as "day" | "week" | "month"]}
                <ChevronDownIcon className="-ml-2 -mr-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={view === "day"}
                  onSelect={() => calendar.changeView("day")}
                >
                  {translations.literals.day}
                  <DropdownMenuShortcut>{"D"}</DropdownMenuShortcut>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={view === "week"}
                  onSelect={() => calendar.changeView("week")}
                >
                  {translations.literals.week}
                  <DropdownMenuShortcut>{"W"}</DropdownMenuShortcut>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={view === "month"}
                  onSelect={() => calendar.changeView("month")}
                >
                  {translations.literals.month}
                  <DropdownMenuShortcut>{"M"}</DropdownMenuShortcut>
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger inset>
                    {translations.literals.range}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {Array.from({ length: 8 }).map((_, index) => (
                        <DropdownMenuCheckboxItem
                          key={index}
                          onSelect={() => {
                            calendar.changeView("range", {
                              days: index + 2
                            });
                            setDays((index + 2) as 1);
                          }}
                          checked={view === "range" && days === index + 2}
                        >
                          {index + 2} {translations.literals.days}
                          <DropdownMenuShortcut>
                            {index + 2}
                          </DropdownMenuShortcut>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button variant="ghost" size="icon" className="rounded-full">
            <Settings />
          </Button> */}
        </div>
      )}
      <div className="ml-auto flex items-center gap-2 sm:ml-0">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
  );
};

AppHeader.displayName = "AppHeader";

export { AppHeader };
