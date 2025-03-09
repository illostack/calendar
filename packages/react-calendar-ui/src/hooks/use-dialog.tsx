"use client";

import { createStore, useStore } from "@illostack/react-store";
import type { JSX } from "react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "../components/drawer";
import { cn } from "../lib/utils";
import { useMediaQuery } from "./use-media-query";

type Dialogs = {
  [key: string]: DialogContent;
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

type DialogContent = {
  title?: string;
  description?: string;
  render: (onClose: () => void) => JSX.Element;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const store = createStore<Dialogs>({});

export const showDialog = (content: DialogContent) => {
  store.update((prev) => ({
    ...prev,
    [generateId()]: content
  }));
};

export const hideDialog = (key: string) => {
  store.update((prev) => {
    const newState = { ...prev };
    delete newState[key];
    return newState;
  });
};

export const DialogContainer = React.memo(() => {
  const dialogs = useStore(store);

  return (
    <React.Fragment>
      {Object.entries(dialogs).map(([key, sheetContent]) => (
        <DialogComponent key={key} id={key} dialogContent={sheetContent} />
      ))}
    </React.Fragment>
  );
});

DialogContainer.displayName = "DialogContainer";

const DialogComponent = ({
  id,
  dialogContent: {
    title,
    description,
    render,
    onClose: _onClose,
    className,
    ...props
  }
}: {
  id: string;
  dialogContent: DialogContent;
}) => {
  const [open, setOpen] = React.useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (!open) {
      _onClose?.();
      const timeout = setTimeout(() => {
        hideDialog(id);
      }, 600);

      return () => {
        clearTimeout(timeout);
      };
    }

    return;
  }, [_onClose, id, open]);

  function toggle(state: boolean) {
    setOpen(state);
  }

  const onClose = () => {
    toggle(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={toggle}>
        <DialogContent className={cn("sm:rounded-2xl", className)} {...props}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {render(onClose)}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={toggle}>
      <DrawerContent className={cn("flex max-h-dvh flex-col gap-0", className)}>
        <DrawerHeader className="flex-none">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex flex-grow flex-col overflow-y-auto px-6 pb-6">
          {render(onClose)}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
