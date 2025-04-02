import { cva } from "class-variance-authority";

const calendarEventCardVariants = cva("", {
  variants: {
    color: {
      green:
        "bg-green-100 group-hover:bg-green-200 dark:group-hover:bg-green-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-green-950 text-green-700 dark:text-green-200 dark:bg-green-900",
      blue: "bg-blue-100 group-hover:bg-blue-200 dark:group-hover:bg-blue-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-blue-950 text-blue-700 dark:text-blue-200 dark:bg-blue-900",
      red: "bg-red-100 group-hover:bg-red-200 dark:group-hover:bg-red-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-red-950 text-red-700 dark:text-red-200 dark:bg-red-900",
      yellow:
        "bg-yellow-100 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-yellow-950 text-yellow-700 dark:text-yellow-200 dark:bg-yellow-900",
      purple:
        "bg-purple-100 group-hover:bg-purple-200 dark:group-hover:bg-purple-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-purple-950 text-purple-700 dark:text-purple-200 dark:bg-purple-900",
      pink: "bg-pink-100 group-hover:bg-pink-200 dark:group-hover:bg-pink-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-pink-950 text-pink-700 dark:text-pink-200 dark:bg-pink-900",
      indigo:
        "bg-indigo-100 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-indigo-950 text-indigo-700 dark:text-indigo-200 dark:bg-indigo-900",
      cyan: "bg-cyan-100 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-950 group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset dark:group-data-[event-state=active]:bg-cyan-950 text-cyan-700 dark:text-cyan-200 dark:bg-cyan-900"
    }
  },
  defaultVariants: {
    color: "blue"
  }
});

export { calendarEventCardVariants };
