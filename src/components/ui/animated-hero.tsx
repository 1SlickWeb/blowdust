import { useEffect, useMemo, useState, type ReactNode } from "react";
import { m } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Adapted for this app: `motion` → `m` because the app renders inside a
// <LazyMotion strict> tree (App.jsx / CLAUDE.md §5) — `motion` would throw and
// eagerly bundle the engine. Render under a LazyMotion provider (the app root
// supplies one; the standalone demo supplies its own).
//
// Also parametrized: every prop defaults to the original template values, so
// `<Hero />` renders exactly as pasted, while callers (see the Home hero) can
// pass brand content — a rotating headline, copy, badge and CTAs.
interface HeroProps {
  badge?: ReactNode;
  titlePrefix?: string;
  titles?: string[];
  description?: ReactNode;
  actions?: ReactNode;
  /** Extra classes for the rotating words (e.g. a brand accent color). */
  titleClassName?: string;
  /** Vertical padding wrapper — override when nesting inside another section. */
  className?: string;
}

function Hero({
  badge,
  titlePrefix = "This is something",
  titles: titlesProp,
  description,
  actions,
  titleClassName,
  className = "py-20 lg:py-40",
}: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const defaultTitles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );
  const titles = titlesProp ?? defaultTitles;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div
          className={cn(
            "flex gap-8 items-center justify-center flex-col",
            className
          )}
        >
          <div>
            {badge ?? (
              <Button variant="secondary" size="sm" className="gap-4">
                Read our launch article <MoveRight className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-4 flex-col">
            {/* Mobile-first: text-5xl (48px) is too tall for a 360px screen —
                the rotating word needs a nowrap line that still fits. */}
            <h1 className="text-3xl sm:text-4xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-foreground">{titlePrefix}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <m.span
                    key={index}
                    className={cn(
                      "absolute font-semibold whitespace-nowrap",
                      titleClassName
                    )}
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </m.span>
                ))}
              </span>
            </h1>

            <p className="text-base md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              {description ??
                `Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            {actions ?? (
              <>
                <Button size="lg" className="gap-4" variant="outline">
                  Jump on a call <PhoneCall className="w-4 h-4" />
                </Button>
                <Button size="lg" className="gap-4">
                  Sign up here <MoveRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
