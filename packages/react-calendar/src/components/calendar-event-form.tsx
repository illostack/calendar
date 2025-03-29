"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  toast
} from "@illostack/ui";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CALENDAR_COLORS } from "../lib/calendar";
import { useCalendar } from "./calendar";

const formSchema = z
  .object({
    summary: z.string().optional(),
    startDate: z.string(),
    startAt: z.string(),
    endDate: z.string(),
    endAt: z.string(),
    color: z.enum(CALENDAR_COLORS).default(CALENDAR_COLORS[0])
  })
  .superRefine((data, ctx) => {
    if (data.startAt && data.endAt) {
      const startAt = new Date(`1970-01-01T${data.startAt}`);
      const endAt = new Date(`1970-01-01T${data.endAt}`);

      if (startAt.getTime() > endAt.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La hora de inicio debe ser anterior a la hora de finalización"
        });
      }
    }
  });

interface CalendarEventProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: z.infer<typeof formSchema>;
}

const CalendarEventForm = ({ onSubmit, defaultValues }: CalendarEventProps) => {
  const calendar = useCalendar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const translations = calendar.getTranslations();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast.error(
            Object.values(errors)
              .map((error) => error.message)
              .join("\n")
          );
        })}
        className="mt-4 flex flex-col gap-y-4"
      >
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-3"
                >
                  {CALENDAR_COLORS.map((color) => (
                    <FormItem
                      key={color}
                      className="flex items-center space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={color} className="hidden" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "h-6 w-6 rounded-full border",
                          field.value === color &&
                            "ring-ring ring-2 ring-offset-2",
                          color === "green" && "bg-green-500",
                          color === "blue" && "bg-blue-500",
                          color === "red" && "bg-red-500",
                          color === "yellow" && "bg-yellow-500",
                          color === "purple" && "bg-purple-500",
                          color === "pink" && "bg-pink-500",
                          color === "indigo" && "bg-indigo-500",
                          color === "cyan" && "bg-cyan-500"
                        )}
                      />
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="summary"
          control={form.control}
          render={({ field }) => (
            <Input autoFocus placeholder="Añade un título" {...field} />
          )}
        />
        <div className="flex items-center gap-2">
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="startAt"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Input type="time" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <FormField
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="endAt"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Input type="time" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">{translations.form.save}</Button>
        </div>
      </form>
    </Form>
  );
};

export { CalendarEventForm };
