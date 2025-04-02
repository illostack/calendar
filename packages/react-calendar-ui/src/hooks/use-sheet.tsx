"use client";

import { createStore, useStore } from "@illostack/react-store";
import * as React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "../components/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "../components/sheet";
import { cn } from "../lib/utils";
import { useMediaQuery } from "./use-media-query";

type Sheets = {
  [key: string]: SheetContent;
};

type SheetContent = {
  title?: string;
  description?: string;
  render: (onClose: () => void) => React.ReactNode;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const store = createStore<Sheets>({});

export const showSheet = (content: SheetContent) => {
  store.update((prev) => ({
    ...prev,
    [generateId()]: content
  }));
};

export const hideSheet = (key: string) => {
  store.update((prev) => {
    const newState = { ...prev };
    delete newState[key];
    return newState;
  });
};

export const SheetContainer = React.memo(() => {
  const sheets = useStore(store);

  return (
    <React.Fragment>
      {Object.entries(sheets).map(([key, sheetContent]) => (
        <SheetComponent key={key} id={key} sheetContent={sheetContent} />
      ))}
    </React.Fragment>
  );
});

SheetContainer.displayName = "SheetContainer";

const SheetComponent = ({
  id,
  sheetContent: {
    title,
    description,
    render,
    onClose: _onClose,
    className,
    ...props
  }
}: {
  id: string;
  sheetContent: SheetContent;
}) => {
  const [open, setOpen] = React.useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (!open) {
      _onClose?.();
      const timeout = setTimeout(() => {
        hideSheet(id);
      }, 600);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [_onClose, id, open]);

  function toggle(state: boolean) {
    setOpen(state);
  }

  const onClose = () => {
    toggle(false);
  };

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={toggle}>
        <SheetContent className={cn(className)} {...props}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {render(onClose)}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={toggle}>
      <DrawerContent className={cn("flex max-h-dvh flex-col gap-0", className)}>
        <DrawerHeader className="flex-none">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex flex-grow flex-col overflow-y-auto">
          {render(onClose)}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
