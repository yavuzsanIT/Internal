

export async function getSerializedMapFromJsondata(jsonData: any[]) {
    const OE_YV_map = new Map<string, Set<string>>();

    console.log(`Processing ${jsonData.length} records`);
    jsonData.forEach((item: any) => {
        const oe = item.OE;
        const yv = item.YV;

        if (oe && yv) {
            const oe_normalized = String(oe).trim();
            const yv_normalized = String(yv).trim();

            if (OE_YV_map.has(oe_normalized)) {
                OE_YV_map.get(oe_normalized)?.add(yv_normalized);
            } else {
                OE_YV_map.set(oe_normalized, new Set([yv_normalized]));
            }
        }
    });

    const serializedMap = new Map<string, string[]>();
    OE_YV_map.forEach((yvSet: Set<string>, oeKey: string) => {
        serializedMap.set(oeKey, Array.from(yvSet));
    });

    console.log(`Serialized map size: ${serializedMap.size}`);

    return serializedMap;
}