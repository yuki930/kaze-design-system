"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { composeEventHandlers } from "@/lib/composeEventHandlers";
import { includesJa, isComposingEvent } from "@/lib/jaText";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { lockScroll } from "@/utils/scrollLock";

/* ── Types ─────────────────────────────────────────────────── */

export interface Command {
  id: string;
  label: string;
  icon?: ReactNode;
  group?: string;
  /** Extra search terms (aliases, English names, readings) matched in addition to the label */
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  placeholder?: string;
  /** Accessible label for the search input (default: "コマンド検索") */
  searchLabel?: string;
  /** Accessible label for the dialog (default: "コマンドパレット") */
  label?: string;
  /** Message shown when no commands match (default: "該当するコマンドが見つかりません") */
  emptyMessage?: string;
  /** Replace the default matcher (width / kana / case insensitive match on label and keywords) */
  filter?: (command: Command, query: string) => boolean;
}

function defaultFilter(command: Command, query: string): boolean {
  return (
    includesJa(command.label, query) ||
    (command.keywords?.some((keyword) => includesJa(keyword, query)) ?? false)
  );
}

/* ── CommandPalette ────────────────────────────────────────── */

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      commands,
      placeholder = "コマンドを検索...",
      searchLabel = "コマンド検索",
      label,
      emptyMessage = "該当するコマンドが見つかりません",
      filter = defaultFilter,
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const baseId = useId();
    const listId = `${baseId}-list`;

    // Focus trap: trap focus inside command palette when open
    useFocusTrap(dialogRef, open);

    // ── Scroll lock: ref-counting pattern (C10) ──
    useEffect(() => {
      if (!open) return;
      const unlock = lockScroll();
      return unlock;
    }, [open]);

    // Filter commands by query
    const filtered = useMemo(() => {
      if (!query.trim()) return commands;
      return commands.filter((cmd) => filter(cmd, query));
    }, [commands, query, filter]);

    // Group the filtered commands
    const grouped = useMemo(() => {
      const groups = new Map<string, Command[]>();
      for (const cmd of filtered) {
        const group = cmd.group ?? "";
        const list = groups.get(group);
        if (list) {
          list.push(cmd);
        } else {
          groups.set(group, [cmd]);
        }
      }
      return groups;
    }, [filtered]);

    // Flat list for keyboard navigation
    const flatList = useMemo(() => {
      const items: Command[] = [];
      for (const cmds of grouped.values()) {
        items.push(...cmds);
      }
      return items;
    }, [grouped]);

    // Reset state when opening/closing
    useEffect(() => {
      if (open) {
        setQuery("");
        setHighlightedIndex(0);
        // Focus input after portal renders
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }, [open]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (!listRef.current) return;
      const items = listRef.current.querySelectorAll("[data-command-item]");
      const highlighted = items[highlightedIndex] as HTMLElement | undefined;
      highlighted?.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setHighlightedIndex(0);
    }, []);

    const handleSelect = useCallback(
      (cmd: Command) => {
        cmd.onSelect();
        onOpenChange(false);
      },
      [onOpenChange],
    );

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent) => {
        // Keys pressed during IME composition belong to the IME (candidate selection, commit, cancel).
        if (isComposingEvent(e)) return;
        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < flatList.length - 1 ? prev + 1 : 0));
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatList.length - 1));
            break;
          }
          case "Enter": {
            e.preventDefault();
            if (flatList[highlightedIndex]) {
              handleSelect(flatList[highlightedIndex]);
            }
            break;
          }
          case "Escape": {
            // Stop propagation so nested overlays (e.g. Dialog behind) are not closed
            e.stopPropagation();
            onOpenChange(false);
            break;
          }
        }
      },
      [flatList, highlightedIndex, handleSelect, onOpenChange],
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      },
      [onOpenChange],
    );

    if (!open) return null;
    if (typeof document === "undefined") return null;

    let flatIndex = 0;

    return createPortal(
      // biome-ignore lint/a11y/noStaticElementInteractions: the backdrop only handles click-outside-to-close; keyboard users close the palette with Escape, and the backdrop itself must not be focusable.
      // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled by the dialog's onKeyDown; the backdrop has no keyboard role of its own.
      <div className="overlay" onClick={handleOverlayClick}>
        <div
          ref={(node) => {
            dialogRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-label={label ?? "コマンドパレット"}
          className={cn("command-palette", className)}
          {...rest}
          onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        >
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              flatList[highlightedIndex] ? `${baseId}-option-${highlightedIndex}` : undefined
            }
            aria-autocomplete="list"
            className="command-palette__input"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            aria-label={searchLabel}
            autoComplete="off"
          />
          <div
            ref={listRef}
            id={listId}
            className="command-palette__list"
            role="listbox"
            aria-label={searchLabel}
          >
            {flatList.length === 0 && (
              <div className="command-palette__empty" role="status">
                {emptyMessage}
              </div>
            )}
            {Array.from(grouped.entries()).map(([group, cmds], groupIndex) => (
              // biome-ignore lint/a11y/useSemanticElements: a <fieldset> brings form-control semantics and default borders; this is a labelled option group inside a listbox.
              <div
                key={group || "__default"}
                role="group"
                aria-labelledby={group ? `${baseId}-group-${groupIndex}` : undefined}
              >
                {group && (
                  <div id={`${baseId}-group-${groupIndex}`} className="command-palette__group">
                    {group}
                  </div>
                )}
                {cmds.map((cmd) => {
                  const index = flatIndex++;
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: Arrow/Enter selection is handled by the dialog's onKeyDown while focus stays on the search input (listbox pattern).
                    // biome-ignore lint/a11y/useFocusableInteractive: options must not take focus; focus stays on the search input and the highlighted option is tracked via aria-selected.
                    <div
                      key={cmd.id}
                      id={`${baseId}-option-${index}`}
                      role="option"
                      data-command-item=""
                      aria-selected={index === highlightedIndex}
                      className={cn(
                        "command-palette__item",
                        index === highlightedIndex && "command-palette__item--active",
                      )}
                      onClick={() => handleSelect(cmd)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {cmd.icon && (
                        <span
                          style={{
                            display: "inline-flex",
                            flexShrink: 0,
                          }}
                        >
                          {cmd.icon}
                        </span>
                      )}
                      {cmd.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

CommandPalette.displayName = "CommandPalette";
