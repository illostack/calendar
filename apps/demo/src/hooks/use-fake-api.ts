"use client";

import {
  CalendarEvent,
  CalendarProvidedEvent
} from "@illostack/react-calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_DELAY = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFakeApi = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery<
    CalendarProvidedEvent[],
    Error,
    CalendarProvidedEvent[]
  >({
    queryKey: ["events"],
    queryFn: async () => {
      return [];
    }
  });

  const { mutateAsync: createEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["createEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return [...data, event];
      });

      await wait(API_DELAY);

      return event;
    }
  });

  const { mutateAsync: updateEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["updateEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return data.map((e) => (e.id === event.id ? event : e));
      });

      await wait(API_DELAY);

      return event;
    }
  });

  const { mutateAsync: deleteEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["deleteEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return data.filter((e) => e.id !== event.id);
      });

      await wait(API_DELAY);

      return event;
    }
  });

  return {
    events: data,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
