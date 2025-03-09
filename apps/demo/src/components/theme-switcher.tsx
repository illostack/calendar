"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const themes = [
  {
    label: "Claro",
    value: "light",
    icon: SunIcon
  },
  {
    label: "Oscuro",
    value: "dark",
    icon: MoonIcon
  }
];

type ThemeSwitcherProps = React.ComponentProps<typeof Button>;

const ThemeSwitcher = React.forwardRef<HTMLButtonElement, ThemeSwitcherProps>(
  ({ className, ...props }, ref) => {
    const mounted = useMounted();
    const { theme, setTheme } = useTheme();

    const selectedTheme = React.useMemo(
      () => themes.find((t) => t.value !== theme) || themes[0],
      [theme]
    ) as (typeof themes)[number];

    if (!mounted) {
      return <Skeleton className={cn(className, "h-9 w-9")} />;
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label="Change theme"
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
        className={cn(className)}
        {...props}
      >
        <selectedTheme.icon />
      </Button>
    );
  }
);

ThemeSwitcher.displayName = "ThemeSwitcher";

export { ThemeSwitcher };
