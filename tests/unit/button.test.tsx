import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from "@/components/ui/Button";

describe("Button variants", () => {
  const variants = Object.keys(buttonVariants) as ButtonVariant[];

  it.each(variants)("renders the %s variant with its classes", (variant) => {
    render(<Button variant={variant}>Label</Button>);
    const button = screen.getByRole("button", { name: "Label" });
    for (const cls of buttonVariants[variant].split(/\s+/).filter(Boolean)) {
      expect(button.classList.contains(cls)).toBe(true);
    }
  });

  const sizes = Object.keys(buttonSizes) as ButtonSize[];

  it.each(sizes)("renders the %s size", (size) => {
    render(<Button size={size}>Label</Button>);
    const button = screen.getByRole("button", { name: "Label" });
    for (const cls of buttonSizes[size].split(/\s+/).filter(Boolean)) {
      expect(button.classList.contains(cls)).toBe(true);
    }
  });

  it("renders as a real link when href is provided", () => {
    render(<Button href="/book">Book a Conversation</Button>);
    const link = screen.getByRole("link", { name: "Book a Conversation" });
    expect(link).toHaveAttribute("href", "/book");
    expect(link.tagName).toBe("A");
  });

  it("supports the disabled state", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <Button disabled onClick={() => (clicked = true)}>
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    await user.click(button).catch(() => undefined);
    expect(clicked).toBe(false);
  });

  it("is keyboard-activatable", async () => {
    const user = userEvent.setup();
    let activations = 0;
    render(<Button onClick={() => activations++}>Act</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Act" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(activations).toBe(2);
  });
});
