import { FlickeringGrid } from "@/components/flickering-grid";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { butterflyKids } from "@/fonts";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  BlocksIcon,
  GithubIcon,
  HandIcon,
  LanguagesIcon,
  PencilRulerIcon,
  PlayIcon,
  ScissorsIcon
} from "lucide-react";
import Image from "next/image";

const logos = [
  {
    alt: "Fube",
    src: "https://www.fube.es/assets/icons/logo-fube-horizontal-naranja.svg"
  }
];
const features = [
  {
    title: "Advanced Localization and Formatting",
    description:
      "Full support for multiple languages and date/time formats, allowing the interface to adapt to cultural and regional preferences.",
    icon: LanguagesIcon,
    color: "#3498db"
  },
  {
    title: "Customizable Views",
    description:
      "Offers various views (day, week, month, and range) so users can choose how to display their calendar according to their planning needs.",
    icon: PencilRulerIcon,
    color: "#27ae60"
  },
  {
    title: "Drag & Drop Interaction",
    description:
      "Enables intuitive event rescheduling via drag and drop, making commitment management more dynamic and user-friendly.",
    icon: HandIcon,
    color: "#f39c12"
  },
  {
    title: "Advanced Event Management",
    description:
      "Includes features to duplicate, copy, cut, paste, and delete events, with options to undo actions, optimizing the editing and creation of multiple entries.",
    icon: ScissorsIcon,
    color: "#8e44ad"
  },
  {
    title: "Real-Time Feedback and Notifications",
    description:
      "Integrates instant notifications (such as toasts) to confirm actions and provide the option to undo changes, enhancing the user experience.",
    icon: BellIcon,
    color: "#e74c3c"
  },
  {
    title: "Integration and Extensibility",
    description:
      "Built on a robust architecture with stores and contexts, enabling easy integration with other applications and extending functionalities through a flexible and modular API.",
    icon: BlocksIcon,
    color: "#1abc9c"
  }
];

const contributors = [
  {
    name: "Alice Johnson"
  },
  {
    name: "Bob Brown"
  },
  {
    name: "Charlie Davis"
  },
  {
    name: "Diana Evans"
  },
  {
    name: "Ethan Ford"
  }
];

export default function CalendarLanding() {
  return (
    <main>
      <header className="bg-background/60 sticky top-0 z-50 h-[var(--header-height)] p-0 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between py-3">
          <div className="flex items-center">
            <Link
              className="relative mr-6 flex items-center space-x-2"
              href="/"
              title="IlloStack Calendar"
            >
              <span className="text-lg font-semibold">IlloStack Calendar</span>
              <span
                className={cn(
                  "text-foreground text-xl font-bold",
                  butterflyKids.className
                )}
              >
                by illodev
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
        <hr className="absolute bottom-0 w-full" />
      </header>
      <section id="hero">
        <div className="container relative mx-auto max-w-6xl">
          <div className="relative grid w-full grid-cols-1 gap-x-8 overflow-hidden border-x p-6 lg:p-12">
            <div className="flex flex-col items-start justify-start pb-12 lg:col-span-1">
              <div className="flex w-full max-w-3xl flex-col overflow-hidden">
                <h1 className="leading-tighter text-foreground text-left text-3xl font-semibold tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="inline-block text-balance">
                    <span className="relative inline-flex overflow-hidden leading-normal">
                      IlloStack Calendar
                    </span>
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl text-balance text-left leading-normal sm:text-lg sm:leading-normal">
                  Open-source calendar with customizable views, external
                  integrations, and a flexible API for event management.
                </p>
              </div>
              <div className="relative mt-6">
                <div className="flex w-full max-w-2xl flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    className={cn(
                      buttonVariants({
                        variant: "default",
                        size: "lg"
                      })
                    )}
                    href="/calendar"
                  >
                    <PlayIcon />
                    Go to Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="logos">
        <div className="container relative mx-auto max-w-6xl">
          <div className="border-x border-t">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {logos.map((logo, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-center border-r border-t p-4 last:border-r-0 sm:last:border-r [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0 md:[&:nth-child(-n+6)]:border-t-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r md:[&:nth-child(3)]:border-r sm:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:border-r md:[&:nth-child(6n)]:border-r-0"
                >
                  <div>
                    <Image
                      alt={logo.alt}
                      className="h-10 w-28 opacity-30 grayscale transition-all duration-200 ease-out hover:opacity-100 hover:brightness-100 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-0 dark:hover:invert"
                      data-nimg="1"
                      decoding="async"
                      height="40"
                      loading="lazy"
                      src={logo.src}
                      style={{
                        color: "transparent"
                      }}
                      width="112"
                    />
                  </div>
                </div>
              ))}
              {/* // More soon container */}
              <div className="group col-span-5 flex items-center justify-center border-r border-t p-4 last:border-r-0 sm:last:border-r [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0 md:[&:nth-child(-n+6)]:border-t-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r md:[&:nth-child(3)]:border-r sm:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:border-r md:[&:nth-child(6n)]:border-r-0">
                <div className="flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    More soon... 🚀
                    <Link
                      href="/"
                      className="text-muted-foreground ml-2 underline"
                    >
                      I want to show my product here too!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features">
        <div className="container relative mx-auto max-w-6xl">
          <div className="relative mx-auto overflow-hidden border-x border-t p-2 py-8 text-center md:p-8">
            <h2 className="text-foreground tracking-tigh text-balance text-base font-bold uppercase">
              Features
            </h2>
          </div>
          <div className="border-x border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="hover:bg-secondary/20 group relative cursor-pointer border-b px-4 py-8 transition-colors last:border-b-0 lg:border-r md:[&:nth-child(2n+1)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 md:[&:nth-child(n+5)]:border-b-0"
                >
                  <div
                    className="flex flex-col items-center gap-y-2"
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      "--color": feature.color
                    }}
                  >
                    <feature.icon className="size-6 transition-colors duration-200 ease-out group-hover:text-[var(--color)]" />
                    <h2 className="text-card-foreground text-balance text-center text-xl font-semibold transition-colors duration-200 ease-out group-hover:text-[var(--color)]">
                      {feature.title}
                    </h2>
                    <p className="text-muted-foreground group-hover:text-card-foreground mx-auto max-w-md text-balance text-center text-sm transition-colors duration-200 ease-out">
                      {feature.description}
                    </p>
                  </div>
                  <FlickeringGrid
                    className="absolute inset-0 -z-20 size-full opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                    squareSize={2.5}
                    gridGap={2}
                    color={feature.color}
                    maxOpacity={0.4}
                    flickerChance={1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="community">
        <div className="container relative mx-auto max-w-6xl">
          <div className="relative mx-auto overflow-hidden border-x border-t p-2 py-8 text-center md:p-8">
            <h2 className="text-foreground tracking-tigh text-balance text-base font-bold uppercase">
              Community
            </h2>
          </div>
          <div className="relative overflow-hidden border">
            <div className="pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-ripple bg-primary/20 absolute rounded-full border shadow-xl"
                  style={{
                    animationDelay: `${i * 0.06}s`,
                    borderColor: `hsl(var(--primary), ${0.01 + i * 0.01})`,
                    borderStyle: "solid",
                    borderWidth: "1px",
                    height: `${210 + i * 70}px`,
                    left: "50%",
                    opacity: `${0.24 - i * 0.03}`,
                    top: "50%",
                    transform: "translate(-50%, -50%) scale(1)",
                    width: `${210 + i * 70}px`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    "--i": i
                  }}
                />
              ))}
            </div>
            <div className="p-6 py-12 text-center">
              <p className="text-muted-foreground mx-auto mb-6 max-w-prose text-balance font-medium">
                IlloStack Calendar is an open-source project that welcomes
                contributions from the community. If you want to help us improve
                the project, you can become a contributor on GitHub.
              </p>
              <div className="mb-8 flex justify-center -space-x-3">
                {contributors.map((contributor, i) => (
                  <Avatar key={i} className="border-foreground border-2">
                    <AvatarFallback>
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex justify-center">
                <a
                  href="https://github.com/illostack/calendar"
                  target="_blank"
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "lg"
                    })
                  )}
                >
                  <GithubIcon />
                  Become a contributor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="container flex max-w-6xl flex-col gap-y-5 rounded-lg py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <h2 className="text-foreground text-lg font-bold">
              IlloStack Calendar
            </h2>
            <span
              className={cn(
                "text-foreground text-xl font-bold",
                butterflyKids.className
              )}
            >
              by illodev
            </span>
          </div>
          <div className="flex gap-x-2"></div>
        </div>
        <div className="flex items-center justify-center">
          <span className="pointer-events-none relative overflow-hidden text-center font-mono text-[clamp(1rem,10vw,6rem)] font-medium tracking-tighter [--text:'IlloStack_Calendar'] before:bg-gradient-to-b before:from-neutral-300 before:to-neutral-200/70 before:to-80% before:bg-clip-text before:text-transparent before:content-[var(--text)] after:absolute after:inset-0 after:bg-neutral-400/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-[var(--text)] after:[text-shadow:0_1px_0_white] dark:before:from-neutral-700/70 dark:before:to-neutral-800/30 dark:after:bg-neutral-600/70 dark:after:mix-blend-lighten dark:after:[text-shadow:0_1px_0_black]" />
        </div>
      </footer>
    </main>
  );
}
