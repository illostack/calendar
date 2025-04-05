import { cva } from "class-variance-authority";

const calendarEventCardVariants = cva(
  "bg-muted/20 before:absolute before:shadow-xl border group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-ring ring-inset pl-4 before:w-1 before:inset-y-1 before:rounded-lg before:left-1",
  {
    variants: {
      color: {
        green:
          "before:bg-green-500 dark:before:bg-green-300 before:shadow-green-500 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200",
        blue: "before:bg-blue-500 dark:before:bg-blue-300 before:shadow-blue-500 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
        red: "before:bg-red-500 dark:before:bg-red-300 before:shadow-red-500 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200",
        yellow:
          "before:bg-yellow-500 dark:before:bg-yellow-300 before:shadow-yellow-500 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200",
        purple:
          "before:bg-purple-500 dark:before:bg-purple-300 before:shadow-purple-500 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200",
        pink: "before:bg-pink-500 dark:before:bg-pink-300 before:shadow-pink-500 bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200",
        indigo:
          "before:bg-indigo-500 dark:before:bg-indigo-300 before:shadow-indigo-500 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200",
        cyan: "before:bg-cyan-500 dark:before:bg-cyan-300 before:shadow-cyan-500 bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200"
      }
    },
    defaultVariants: {
      color: "blue"
    }
  }
);

export { calendarEventCardVariants };
