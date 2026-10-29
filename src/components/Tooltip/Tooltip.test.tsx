import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "@/components/Tooltip";

const wait = (ms: number) => act(async () => new Promise((r) => setTimeout(r, ms)));

function setup() {
  render(
    <Tooltip content="ヒント" delay={0}>
      <button type="button" aria-describedby="other">
        trigger
      </button>
    </Tooltip>,
  );
  return screen.getByRole("button");
}

describe("Tooltip", () => {
  it("is always in the DOM, linked by aria-describedby (merged with existing), and hidden when closed", async () => {
    const btn = setup();
    await wait(10);
    const tip = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tip.hidden).toBe(true);
    expect(tip.dataset.state).toBe("closed");
    expect(btn.getAttribute("aria-describedby")).toBe(`other ${tip.id}`);
  });

  it("opens on focus and closes on Escape", async () => {
    const btn = setup();
    await wait(10);
    await act(async () => btn.focus());
    await wait(10);
    const tip = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tip.dataset.state).toBe("open");
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(tip.dataset.state).toBe("closed");
  });

  it("stays open when the pointer moves onto the tooltip (hoverable)", async () => {
    const btn = setup();
    await wait(10);
    fireEvent.mouseEnter(btn);
    await wait(10);
    const tip = document.querySelector('[role="tooltip"]') as HTMLElement;
    fireEvent.mouseLeave(btn);
    fireEvent.mouseEnter(tip);
    await wait(150);
    expect(tip.dataset.state).toBe("open");
    fireEvent.mouseLeave(tip);
    await wait(150);
    expect(tip.dataset.state).toBe("closed");
  });
});
