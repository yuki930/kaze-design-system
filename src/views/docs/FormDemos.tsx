"use client";

import { AddressField, type AddressLookupResult } from "@/components";

/** A few codes for the demo. A real app calls its own address API in onLookup. */
const DEMO_ADDRESSES: Record<string, AddressLookupResult> = {
  "1500002": { prefecture: "東京都", city: "渋谷区", town: "渋谷" },
  "5300001": { prefecture: "大阪府", city: "大阪市北区", town: "梅田" },
  "8100001": { prefecture: "福岡県", city: "福岡市中央区", town: "天神" },
};

async function demoLookup(postalCode: string): Promise<AddressLookupResult | null> {
  return DEMO_ADDRESSES[postalCode] ?? null;
}

/** AddressField with a lookup; onLookup is a function, so the preview lives in a client file. */
export function AddressFieldDemo() {
  return (
    <div style={{ maxWidth: 560 }}>
      <AddressField
        required
        onLookup={demoLookup}
        description="試しに 150-0002、530-0001、810-0001 を入力してください。"
      />
    </div>
  );
}
