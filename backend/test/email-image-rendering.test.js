import { describe, expect, it } from "vitest";
import { renderEmailDocument } from "../services/emailNotifications.js";

describe("automated email item images", () => {
  it("embeds data URL images as inline CID attachments", () => {
    const rendered = renderEmailDocument({
      title: "Purchase Order",
      intro: "Review this order.",
      details: [],
      itemsRecord: {
        currency: "MYR",
        items: [{ itemName: "Laptop", itemDescription: "Test", quantity: 1, unit: "pcs", unitPrice: 10, imageDataUrl: "data:image/png;base64,aGVsbG8=" }],
      },
      total: 10,
      action: "Please review.",
    });

    expect(rendered.attachments).toHaveLength(1);
    expect(rendered.attachments[0].cid).toMatch(/^optimind-item-0-/);
    expect(rendered.html).toContain(`src="cid:${rendered.attachments[0].cid}"`);
    expect(rendered.html).not.toContain("data:image/png;base64");
  });
});
