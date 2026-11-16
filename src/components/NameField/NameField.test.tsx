import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NameField } from "./NameField";

const input = (label: string) => screen.getByLabelText(new RegExp(`^${label}`)) as HTMLInputElement;

/**
 * What an IME does while the user types "さがら" and converts it to "相楽":
 * compositionstart, updates with the kana, an update with the kanji, then the
 * committed text. `order` decides whether change fires before or after
 * compositionend, which differs between browsers.
 */
function typeWithIme(
  el: HTMLInputElement,
  steps: string[],
  committed: string,
  order: "change-first" | "end-first" = "change-first",
) {
  const base = el.value;
  fireEvent.compositionStart(el, { data: "" });
  for (const data of steps) {
    fireEvent.compositionUpdate(el, { data });
    fireEvent.change(el, { target: { value: base + data } });
  }
  if (order === "change-first") {
    fireEvent.change(el, { target: { value: base + committed } });
    fireEvent.compositionEnd(el, { data: committed });
  } else {
    fireEvent.compositionEnd(el, { data: committed });
    fireEvent.change(el, { target: { value: base + committed } });
  }
}

describe("NameField", () => {
  it("groups family and given names with their readings under a legend", () => {
    render(<NameField />);
    expect(screen.getByRole("group", { name: "氏名" })).toBeInTheDocument();
    expect(input("姓")).toHaveAttribute("autocomplete", "family-name");
    expect(input("名")).toHaveAttribute("autocomplete", "given-name");
    expect(input("セイ")).toBeInTheDocument();
    expect(input("メイ")).toBeInTheDocument();
  });

  it("fills the katakana reading from the kana typed before conversion", () => {
    const onValueChange = vi.fn();
    render(<NameField onValueChange={onValueChange} />);
    typeWithIme(input("姓"), ["さ", "さが", "さがら", "相楽"], "相楽");
    typeWithIme(input("名"), ["み", "みさ", "みさき", "実咲"], "実咲");
    expect(input("姓").value).toBe("相楽");
    expect(input("セイ").value).toBe("サガラ");
    expect(input("メイ").value).toBe("ミサキ");
    expect(onValueChange).toHaveBeenLastCalledWith({
      family: "相楽",
      given: "実咲",
      familyKana: "サガラ",
      givenKana: "ミサキ",
    });
  });

  it("works whichever of change and compositionend fires first", () => {
    render(<NameField />);
    typeWithIme(input("姓"), ["さがら", "相楽"], "相楽", "end-first");
    expect(input("姓").value).toBe("相楽");
    expect(input("セイ").value).toBe("サガラ");
  });

  it("appends the reading of each conversion in a part", () => {
    render(<NameField />);
    typeWithIme(input("姓"), ["のの", "野々"], "野々");
    typeWithIme(input("姓"), ["むら", "村"], "村");
    expect(input("姓").value).toBe("野々村");
    expect(input("セイ").value).toBe("ノノムラ");
  });

  it("ignores half-typed romaji and kanji-only updates", () => {
    render(<NameField />);
    typeWithIme(input("姓"), ["s", "さg", "相"], "相");
    expect(input("セイ").value).toBe("");
  });

  it("uses hiragana when kana is hiragana", () => {
    render(<NameField kana="hiragana" />);
    typeWithIme(input("姓"), ["サガラ", "相楽"], "相楽");
    expect(input("せい").value).toBe("さがら");
  });

  it("stops filling a reading the user edited, and resumes once it is cleared", () => {
    render(<NameField />);
    fireEvent.change(input("セイ"), { target: { value: "サガラ" } });
    typeWithIme(input("姓"), ["あいら", "相楽"], "相楽");
    expect(input("セイ").value).toBe("サガラ");
    // Clearing the name keeps a reading typed by hand
    fireEvent.change(input("姓"), { target: { value: "" } });
    expect(input("セイ").value).toBe("サガラ");
    fireEvent.change(input("セイ"), { target: { value: "" } });
    typeWithIme(input("姓"), ["さがら", "相楽"], "相楽");
    expect(input("セイ").value).toBe("サガラ");
  });

  it("clears an automatic reading when the name is cleared", () => {
    render(<NameField />);
    typeWithIme(input("姓"), ["さがら", "相楽"], "相楽");
    fireEvent.change(input("姓"), { target: { value: "" } });
    expect(input("セイ").value).toBe("");
  });

  it("does nothing when autoKana is off or there are no reading fields", () => {
    const { unmount } = render(<NameField autoKana={false} />);
    typeWithIme(input("姓"), ["さがら", "相楽"], "相楽");
    expect(input("セイ").value).toBe("");
    unmount();
    render(<NameField kana={false} />);
    expect(screen.queryByLabelText(/セイ/)).not.toBeInTheDocument();
    typeWithIme(input("姓"), ["さがら", "相楽"], "相楽");
    expect(input("姓").value).toBe("相楽");
  });

  it("normalizes a typed reading on blur", () => {
    render(<NameField />);
    fireEvent.change(input("セイ"), { target: { value: " ｻｶﾞﾗ " } });
    fireEvent.blur(input("セイ"));
    expect(input("セイ").value).toBe("サガラ");
    fireEvent.change(input("メイ"), { target: { value: "みさき" } });
    fireEvent.blur(input("メイ"));
    expect(input("メイ").value).toBe("ミサキ");
  });

  it("marks fields required, shows errors and submits under the given names", () => {
    const { container } = render(
      <form>
        <NameField
          required
          errors={{ givenKana: "メイをカタカナで入力してください" }}
          names={{ family: "family", given: "given", familyKana: "family_kana" }}
          defaultValue={{ family: "相楽", given: "実咲", familyKana: "サガラ" }}
          labels={{ family: "姓（漢字）" }}
        />
      </form>,
    );
    expect(input("姓（漢字）")).toBeRequired();
    expect(input("メイ")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("メイをカタカナで入力してください");
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("family")).toBe("相楽");
    expect(data.get("family_kana")).toBe("サガラ");
    expect(data.get("givenKana")).toBeNull();
  });
});
