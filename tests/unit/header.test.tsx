import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

describe("Header keyboard accessibility", () => {
  it("puts the skip link first in the tab order", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveFocus();
  });

  it("mobile menu disclosure toggles with keyboard and wires aria", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const menuId = toggle.getAttribute("aria-controls");
    expect(menuId).toBeTruthy();

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Close menu" })).toBe(toggle);

    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes primary navigation as labelled landmarks", () => {
    render(<Header />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });
});
