import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AddressField, PREFECTURES, type AddressLookupResult } from "./AddressField";
import { PostalCodeField, formatPostalCode, normalizePostalCode } from "./PostalCodeField";

/** A lookup whose promises the test resolves by hand */
function manualLookup() {
  const calls: {
    code: string;
    resolve: (r: AddressLookupResult | null) => void;
    reject: () => void;
  }[] = [];
  const lookup = vi.fn(
    (code: string) =>
      new Promise<AddressLookupResult | null>((resolve, reject) => {
        calls.push({ code, resolve, reject: () => reject(new Error("network")) });
      }),
  );
  return { lookup, calls };
}

const SHIBUYA: AddressLookupResult = { prefecture: "東京都", city: "渋谷区", town: "神宮前" };

const postal = () => screen.getByLabelText(/郵便番号/) as HTMLInputElement;
const field = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement;

describe("PostalCodeField", () => {
  it.each([
    ["1500002", "1500002"],
    ["150-0002", "1500002"],
    ["〒１５０ー０００２", "1500002"],
    ["１５０－０００２", "1500002"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizePostalCode(input)).toBe(expected);
  });

  it("formats 7 digits and leaves anything else as typed", () => {
    expect(formatPostalCode("1500002")).toBe("150-0002");
    expect(formatPostalCode("〒１５０ー０００２")).toBe("150-0002");
    expect(formatPostalCode("15000")).toBe("15000");
  });

  it("formats on blur and submits digits", () => {
    const { container } = render(
      <form>
        <PostalCodeField aria-label="郵便番号" name="zip" />
      </form>,
    );
    fireEvent.change(postal(), { target: { value: "１５００００２" } });
    expect(postal().value).toBe("１５００００２");
    fireEvent.blur(postal());
    expect(postal().value).toBe("150-0002");
    expect(new FormData(container.querySelector("form") as HTMLFormElement).get("zip")).toBe(
      "1500002",
    );
    expect(postal()).toHaveAttribute("inputmode", "numeric");
    expect(postal()).toHaveAttribute("autocomplete", "postal-code");
  });
});

describe("AddressField", () => {
  it("groups the fields under a legend with autocomplete tokens", () => {
    render(<AddressField />);
    expect(screen.getByRole("group", { name: "住所" })).toBeInTheDocument();
    expect(postal()).toHaveAttribute("autocomplete", "postal-code");
    expect(field(/都道府県/)).toHaveAttribute("autocomplete", "address-level1");
    expect(field(/市区町村/)).toHaveAttribute("autocomplete", "address-level2");
    expect(field(/^番地/)).toHaveAttribute("autocomplete", "address-line1");
    expect(field(/建物名/)).toHaveAttribute("autocomplete", "address-line2");
    // 47 prefectures plus the empty choice
    expect(screen.getAllByRole("option")).toHaveLength(PREFECTURES.length + 1);
  });

  it("prefixes autocomplete with a section", () => {
    render(<AddressField autoCompleteSection="shipping" />);
    expect(postal()).toHaveAttribute("autocomplete", "section-shipping postal-code");
  });

  it("fills prefecture, city and town from a complete code", async () => {
    const { lookup, calls } = manualLookup();
    const onValueChange = vi.fn();
    render(<AddressField onLookup={lookup} onValueChange={onValueChange} />);
    fireEvent.change(postal(), { target: { value: "150" } });
    expect(lookup).not.toHaveBeenCalled();
    fireEvent.change(postal(), { target: { value: "150-0002" } });
    expect(lookup).toHaveBeenCalledWith("1500002");
    expect(screen.getByRole("status")).toHaveTextContent("探しています");
    await act(async () => calls[0]?.resolve(SHIBUYA));
    expect(field(/都道府県/).value).toBe("東京都");
    expect(field(/市区町村/).value).toBe("渋谷区");
    expect(field(/^番地/).value).toBe("神宮前");
    expect(screen.getByRole("status")).toHaveTextContent("住所を入れました");
    expect(onValueChange).toHaveBeenLastCalledWith({
      postalCode: "1500002",
      prefecture: "東京都",
      city: "渋谷区",
      line1: "神宮前",
      line2: "",
    });
    // Focus stays where the user is
    expect(document.activeElement).not.toBe(field(/^番地/));
  });

  it("applies only the latest lookup", async () => {
    const { lookup, calls } = manualLookup();
    render(<AddressField onLookup={lookup} />);
    fireEvent.change(postal(), { target: { value: "1500002" } });
    fireEvent.change(postal(), { target: { value: "5300001" } });
    await act(async () =>
      calls[1]?.resolve({ prefecture: "大阪府", city: "大阪市北区", town: "梅田" }),
    );
    await act(async () => calls[0]?.resolve(SHIBUYA));
    expect(field(/都道府県/).value).toBe("大阪府");
  });

  it("drops a lookup still in flight when the code is edited", async () => {
    const { lookup, calls } = manualLookup();
    render(<AddressField onLookup={lookup} />);
    fireEvent.change(postal(), { target: { value: "1500002" } });
    fireEvent.change(postal(), { target: { value: "150000" } });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await act(async () => calls[0]?.resolve(SHIBUYA));
    expect(field(/都道府県/).value).toBe("");
  });

  it("keeps what the user typed and replaces only its own earlier result", async () => {
    const { lookup, calls } = manualLookup();
    render(<AddressField onLookup={lookup} defaultValue={{ line1: "神宮前 1-2-3" }} />);
    fireEvent.change(postal(), { target: { value: "1500002" } });
    await act(async () => calls[0]?.resolve(SHIBUYA));
    expect(field(/市区町村/).value).toBe("渋谷区");
    expect(field(/^番地/).value).toBe("神宮前 1-2-3");
    fireEvent.change(postal(), { target: { value: "5300001" } });
    await act(async () =>
      calls[1]?.resolve({ prefecture: "大阪府", city: "大阪市北区", town: "梅田" }),
    );
    expect(field(/市区町村/).value).toBe("大阪市北区");
    expect(field(/^番地/).value).toBe("神宮前 1-2-3");
  });

  it("does not look up a code given from outside", () => {
    const { lookup } = manualLookup();
    render(
      <AddressField
        onLookup={lookup}
        defaultValue={{ postalCode: "1500002", prefecture: "東京都", city: "渋谷区" }}
      />,
    );
    expect(postal().value).toBe("150-0002");
    expect(lookup).not.toHaveBeenCalled();
  });

  it("says when nothing matches or the lookup fails", async () => {
    const { lookup, calls } = manualLookup();
    render(<AddressField onLookup={lookup} />);
    fireEvent.change(postal(), { target: { value: "0000000" } });
    await act(async () => calls[0]?.resolve(null));
    expect(screen.getByRole("status")).toHaveTextContent("見つかりません");
    fireEvent.change(postal(), { target: { value: "1500002" } });
    await act(async () => calls[1]?.reject());
    expect(screen.getByRole("status")).toHaveTextContent("探せませんでした");
  });

  it("ignores a result that arrives after unmount", async () => {
    const { lookup, calls } = manualLookup();
    const onValueChange = vi.fn();
    const { unmount } = render(<AddressField onLookup={lookup} onValueChange={onValueChange} />);
    fireEvent.change(postal(), { target: { value: "1500002" } });
    onValueChange.mockClear();
    unmount();
    await act(async () => calls[0]?.resolve(SHIBUYA));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("updates each field, marks required ones and shows errors", () => {
    const onValueChange = vi.fn();
    render(
      <AddressField
        required
        onValueChange={onValueChange}
        errors={{ city: "市区町村を入力してください" }}
      />,
    );
    fireEvent.change(field(/都道府県/), { target: { value: "北海道" } });
    fireEvent.change(field(/市区町村/), { target: { value: "札幌市" } });
    fireEvent.change(field(/^番地/), { target: { value: "北1条西2丁目" } });
    fireEvent.change(field(/建物名/), { target: { value: "203" } });
    expect(onValueChange).toHaveBeenLastCalledWith({
      postalCode: "",
      prefecture: "北海道",
      city: "札幌市",
      line1: "北1条西2丁目",
      line2: "203",
    });
    expect(field(/市区町村/)).toBeRequired();
    expect(field(/市区町村/)).toHaveAttribute("aria-invalid", "true");
    expect(field(/建物名/)).not.toBeRequired();
    expect(screen.getByRole("alert")).toHaveTextContent("市区町村を入力してください");
  });

  it("submits under the given names and disables every field through the fieldset", () => {
    const { container } = render(
      <form>
        <AddressField
          names={{ postalCode: "zip", prefecture: "pref", city: "city" }}
          defaultValue={{ postalCode: "1500002", prefecture: "東京都", city: "渋谷区" }}
          labels={{ line1: "町名・番地" }}
        />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("zip")).toBe("1500002");
    expect(data.get("pref")).toBe("東京都");
    expect(data.get("city")).toBe("渋谷区");
    expect(screen.getByLabelText("町名・番地")).toBeInTheDocument();
  });
});
