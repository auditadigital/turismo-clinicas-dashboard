import { describe, it, expect } from "vitest";
import { buttonClass } from "./Button.js";

describe("buttonClass", () => {
  it("defaults to primary md", () => {
    expect(buttonClass()).toBe("btn btn-primary");
  });
  it("composes variant + size + extra", () => {
    expect(buttonClass("kakao", "lg", "w-full")).toBe("btn btn-kakao btn-lg w-full");
  });
  it("maps block size", () => {
    expect(buttonClass("secondary", "block")).toBe("btn btn-secondary btn-block");
  });
});
