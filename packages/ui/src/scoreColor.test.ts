import { describe, it, expect } from "vitest";
import { scoreColor } from "./scoreColor.js";

describe("scoreColor", () => {
  it("urgent below 50", () => {
    expect(scoreColor(0)).toBe("urgent");
    expect(scoreColor(49)).toBe("urgent");
  });
  it("warn between 50 and 74", () => {
    expect(scoreColor(50)).toBe("warn");
    expect(scoreColor(74)).toBe("warn");
  });
  it("good 75 and above", () => {
    expect(scoreColor(75)).toBe("good");
    expect(scoreColor(100)).toBe("good");
  });
});
