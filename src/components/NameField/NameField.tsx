"use client";

import {
  forwardRef,
  useRef,
  type CompositionEvent,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";
import { isKanaOnly, toHiragana, toKatakana } from "../../lib/jaText";
import { cn } from "../../lib/utils";
import { useControllableState } from "../_internal/useControllableState";
import { FormField } from "../FormField";
import { Input } from "../Input";

export interface NameValue {
  /** 姓 */
  family: string;
  /** 名 */
  given: string;
  /** 姓のフリガナ */
  familyKana: string;
  /** 名のフリガナ */
  givenKana: string;
}

type NameKey = keyof NameValue;
type Part = "family" | "given";
const KANA_KEY = { family: "familyKana", given: "givenKana" } as const;

export interface NameFieldProps
  extends Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "defaultValue" | "onChange" | "title" | "name"
  > {
  /** Name of the group, rendered as the legend (default: "氏名") */
  label?: ReactNode;
  /** Shown under the legend */
  description?: ReactNode;
  value?: NameValue;
  defaultValue?: Partial<NameValue>;
  onValueChange?: (value: NameValue) => void;
  /** Script of the reading fields, or `false` for no reading fields (default: "katakana") */
  kana?: "katakana" | "hiragana" | false;
  /**
   * Fill the reading from what the IME showed before conversion (default: true).
   * Stops for a part once the user edits its reading by hand, and resumes when that reading is cleared
   */
  autoKana?: boolean;
  /** Marks every field as required */
  required?: boolean;
  /** Error message per field */
  errors?: Partial<Record<NameKey, string>>;
  /** Form field names per field. Fields without a name are not submitted */
  names?: Partial<Record<NameKey, string>>;
  /** Labels per field, to replace the defaults (姓, 名, セイ, メイ) */
  labels?: Partial<Record<NameKey, string>>;
}

const EMPTY: NameValue = { family: "", given: "", familyKana: "", givenKana: "" };

/**
 * Japanese name in two parts, family and given, each with its reading. With
 * autoKana, the reading fills in from the kana the IME showed before conversion.
 */
export const NameField = forwardRef<HTMLFieldSetElement, NameFieldProps>(
  (
    {
      label = "氏名",
      description,
      value: valueProp,
      defaultValue,
      onValueChange,
      kana = "katakana",
      autoKana = true,
      required,
      errors = {},
      names = {},
      labels: labelsProp,
      className,
      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = useControllableState<NameValue>({
      value: valueProp,
      defaultValue: { ...EMPTY, ...defaultValue },
      onChange: onValueChange,
    });
    // compositionend and change fire in a different order per browser: always build on the latest value
    const latest = useRef(value);
    latest.current = value;
    const update = (patch: Partial<NameValue>) => {
      const next = { ...latest.current, ...patch };
      latest.current = next;
      setValue(next);
    };

    const toScript = kana === "hiragana" ? toHiragana : toKatakana;
    const normalizeKana = (text: string) =>
      toScript(text.normalize("NFKC"))
        .replace(/[ 　]+/g, " ")
        .trim();

    /** The last kana-only text the IME showed in the current composition, per part */
    const pending = useRef<Record<Part, string>>({ family: "", given: "" });
    /** True once the user typed the reading of a part by hand */
    const manual = useRef<Record<Part, boolean>>({ family: false, given: false });
    const autoFill = (part: Part) => Boolean(kana) && autoKana && !manual.current[part];

    const kanjiHandlers = (part: Part) => ({
      onCompositionStart: () => {
        pending.current[part] = "";
      },
      onCompositionUpdate: (event: CompositionEvent<HTMLInputElement>) => {
        // Before conversion the IME shows kana; after it shows kanji, which is ignored
        if (isKanaOnly(event.data)) pending.current[part] = event.data;
      },
      onCompositionEnd: () => {
        const reading = pending.current[part];
        pending.current[part] = "";
        if (!reading || !autoFill(part)) return;
        const key = KANA_KEY[part];
        update({ [key]: normalizeKana(latest.current[key] + reading) });
      },
      onChange: (event: { target: { value: string } }) => {
        const text = event.target.value;
        const patch: Partial<NameValue> = { [part]: text };
        // Clearing the name clears a reading that was filled in automatically
        if (text === "" && autoFill(part)) patch[KANA_KEY[part]] = "";
        update(patch);
      },
    });

    const kanaHandlers = (part: Part) => ({
      onChange: (event: { target: { value: string } }) => {
        const text = event.target.value;
        manual.current[part] = text !== "";
        update({ [KANA_KEY[part]]: text });
      },
      onBlur: () => {
        const key = KANA_KEY[part];
        const normalized = normalizeKana(latest.current[key]);
        if (normalized !== latest.current[key]) update({ [key]: normalized });
      },
    });

    const defaultLabels: Record<NameKey, string> = {
      family: "姓",
      given: "名",
      familyKana: kana === "hiragana" ? "せい" : "セイ",
      givenKana: kana === "hiragana" ? "めい" : "メイ",
    };
    const labels = { ...defaultLabels, ...labelsProp };
    const fieldProps = (key: NameKey) => ({
      label: labels[key],
      error: errors[key],
      required: Boolean(required),
    });

    return (
      <fieldset ref={ref} className={cn("name-field", className)} {...rest}>
        <legend className="name-field__legend">{label}</legend>
        {description && <p className="name-field__description">{description}</p>}
        <div className="name-field__body">
          <div className="name-field__row">
            <FormField {...fieldProps("family")}>
              <Input
                value={value.family}
                name={names.family}
                autoComplete="family-name"
                {...kanjiHandlers("family")}
              />
            </FormField>
            <FormField {...fieldProps("given")}>
              <Input
                value={value.given}
                name={names.given}
                autoComplete="given-name"
                {...kanjiHandlers("given")}
              />
            </FormField>
          </div>
          {kana && (
            <div className="name-field__row">
              <FormField {...fieldProps("familyKana")}>
                <Input
                  value={value.familyKana}
                  name={names.familyKana}
                  autoComplete="off"
                  {...kanaHandlers("family")}
                />
              </FormField>
              <FormField {...fieldProps("givenKana")}>
                <Input
                  value={value.givenKana}
                  name={names.givenKana}
                  autoComplete="off"
                  {...kanaHandlers("given")}
                />
              </FormField>
            </div>
          )}
        </div>
      </fieldset>
    );
  },
);

NameField.displayName = "NameField";
