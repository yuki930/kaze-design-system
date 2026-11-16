"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { useControllableState } from "../_internal/useControllableState";
import { FormField } from "../FormField";
import { Input } from "../Input";
import { Select } from "../Select";
import { PostalCodeField } from "./PostalCodeField";

export interface AddressValue {
  /** Digits only, e.g. "1500002" */
  postalCode: string;
  /** One of PREFECTURES, e.g. "東京都" */
  prefecture: string;
  /** 市区町村, e.g. "渋谷区" */
  city: string;
  /** 町域と番地, e.g. "神宮前 1-2-3" */
  line1: string;
  /** 建物名と部屋番号 */
  line2: string;
}

/** What onLookup resolves to. `town` goes into line1 */
export interface AddressLookupResult {
  prefecture: string;
  city: string;
  town?: string;
}

type AddressKey = keyof AddressValue;

export interface AddressFieldProps
  extends Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "defaultValue" | "onChange" | "title" | "name"
  > {
  /** Name of the group, rendered as the legend (default: "住所") */
  label?: ReactNode;
  /** Shown under the legend */
  description?: ReactNode;
  value?: AddressValue;
  defaultValue?: Partial<AddressValue>;
  onValueChange?: (value: AddressValue) => void;
  /**
   * Looks up an address from a 7-digit postal code. Called once per code; resolve
   * `null` when nothing matches. Kaze ships no address data: call your own API here.
   */
  onLookup?: (postalCode: string) => Promise<AddressLookupResult | null>;
  /** Marks every field except line2 as required */
  required?: boolean;
  /** Error message per field */
  errors?: Partial<Record<AddressKey, string>>;
  /** Form field names per field. Fields without a name are not submitted */
  names?: Partial<Record<AddressKey, string>>;
  /** Labels per field, to replace the defaults (郵便番号, 都道府県, 市区町村, 番地, 建物名・部屋番号) */
  labels?: Partial<Record<AddressKey, string>>;
  /** Prefix for autocomplete tokens when a form has two addresses, e.g. "shipping" */
  autoCompleteSection?: string;
}

export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

const EMPTY: AddressValue = { postalCode: "", prefecture: "", city: "", line1: "", line2: "" };

const DEFAULT_LABELS: Record<AddressKey, string> = {
  postalCode: "郵便番号",
  prefecture: "都道府県",
  city: "市区町村",
  line1: "番地",
  line2: "建物名・部屋番号",
};

const AUTOCOMPLETE: Record<AddressKey, string> = {
  postalCode: "postal-code",
  prefecture: "address-level1",
  city: "address-level2",
  line1: "address-line1",
  line2: "address-line2",
};

type LookupStatus = "idle" | "loading" | "found" | "not-found" | "failed";

const STATUS_TEXT: Record<LookupStatus, string> = {
  idle: "",
  loading: "郵便番号から住所を探しています",
  found: "郵便番号から住所を入れました。番地を続けて入力してください",
  "not-found": "この郵便番号の住所が見つかりません。住所を入力してください",
  failed: "住所を探せませんでした。住所を入力してください",
};

/**
 * Japanese address: postal code, prefecture, city, street and building. With
 * `onLookup`, a complete postal code fills in the prefecture, city and town.
 */
export const AddressField = forwardRef<HTMLFieldSetElement, AddressFieldProps>(
  (
    {
      label = "住所",
      description,
      value: valueProp,
      defaultValue,
      onValueChange,
      onLookup,
      required,
      errors = {},
      names = {},
      labels: labelsProp,
      autoCompleteSection,
      className,
      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = useControllableState<AddressValue>({
      value: valueProp,
      defaultValue: { ...EMPTY, ...defaultValue },
      onChange: onValueChange,
    });
    // Lookups resolve later; merge their result into the latest value, not the one they started from
    const latest = useRef(value);
    latest.current = value;

    const update = (patch: Partial<AddressValue>) => {
      const next = { ...latest.current, ...patch };
      latest.current = next;
      setValue(next);
    };

    const [status, setStatus] = useState<LookupStatus>("idle");
    const request = useRef(0);
    /** What the last lookup put in each field, so a later lookup only replaces its own values */
    const filled = useRef<Partial<AddressValue>>({});

    // Results that arrive after unmount are dropped
    useEffect(() => {
      const current = request;
      return () => {
        current.current++;
      };
    }, []);

    // Looks up only when the user changes the code, never for a value given from outside,
    // so opening a saved address does not overwrite it
    const changePostalCode = (postalCode: string) => {
      update({ postalCode });
      const id = ++request.current;
      if (postalCode.length !== 7 || !onLookup) {
        setStatus("idle");
        return;
      }
      setStatus("loading");
      onLookup(postalCode).then(
        (result) => {
          if (id !== request.current) return;
          if (!result) {
            setStatus("not-found");
            return;
          }
          const found: Partial<AddressValue> = {
            prefecture: result.prefecture,
            city: result.city,
            line1: result.town ?? "",
          };
          // Fill a field only if it is empty or still holds the previous lookup's value;
          // what the user or the browser's autofill typed is kept
          const patch: Partial<AddressValue> = {};
          for (const key of ["prefecture", "city", "line1"] as const) {
            const current = latest.current[key];
            if (current === "" || current === filled.current[key]) patch[key] = found[key];
          }
          filled.current = found;
          update(patch);
          setStatus("found");
        },
        () => {
          if (id === request.current) setStatus("failed");
        },
      );
    };

    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const autoComplete = (key: AddressKey) =>
      autoCompleteSection
        ? `section-${autoCompleteSection} ${AUTOCOMPLETE[key]}`
        : AUTOCOMPLETE[key];
    const isRequired = (key: AddressKey) => Boolean(required) && key !== "line2";
    const fieldProps = (key: AddressKey) => ({
      label: labels[key],
      error: errors[key],
      required: isRequired(key),
    });

    return (
      <fieldset ref={ref} className={cn("address-field", className)} {...rest}>
        <legend className="address-field__legend">{label}</legend>
        {description && <p className="address-field__description">{description}</p>}
        <div className="address-field__body">
          <div className="address-field__row address-field__row--postal">
            <FormField {...fieldProps("postalCode")} description="ハイフンはなくてもかまいません">
              <PostalCodeField
                value={value.postalCode}
                onValueChange={changePostalCode}
                name={names.postalCode}
                autoComplete={autoComplete("postalCode")}
                placeholder="150-0002"
              />
            </FormField>
            {onLookup && (
              <p className="address-field__status" role="status">
                {STATUS_TEXT[status]}
              </p>
            )}
          </div>
          <div className="address-field__row address-field__row--region">
            <FormField {...fieldProps("prefecture")}>
              <Select
                value={value.prefecture}
                onChange={(event) => update({ prefecture: event.target.value })}
                name={names.prefecture}
                autoComplete={autoComplete("prefecture")}
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField {...fieldProps("city")}>
              <Input
                value={value.city}
                onChange={(event) => update({ city: event.target.value })}
                name={names.city}
                autoComplete={autoComplete("city")}
              />
            </FormField>
          </div>
          <FormField {...fieldProps("line1")}>
            <Input
              value={value.line1}
              onChange={(event) => update({ line1: event.target.value })}
              name={names.line1}
              autoComplete={autoComplete("line1")}
            />
          </FormField>
          <FormField {...fieldProps("line2")}>
            <Input
              value={value.line2}
              onChange={(event) => update({ line2: event.target.value })}
              name={names.line2}
              autoComplete={autoComplete("line2")}
            />
          </FormField>
        </div>
      </fieldset>
    );
  },
);

AddressField.displayName = "AddressField";
