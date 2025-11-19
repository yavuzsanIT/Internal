import dotenv from "dotenv";
import path from "path";



// NODE_ENV'e göre dosya seç
const mode = "development" // development / production
const envPath = path.resolve(__dirname, `../../.env.${mode}`);
dotenv.config({ path: envPath });

console.log("Loaded env from:", envPath);

// -----------------------
// ENV değişkenleri
// -----------------------
const SHEET_API_URL = process.env.GOOGLE_SHEETS_API_URL!;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME!;




export async function getGoogleSheetResponseJson() {
    const url = `${SHEET_API_URL}/${SHEET_ID}/${SHEET_NAME}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
    }
    return response.json();
}



export async function ORJ_NO_MAP_GOOGLE_SHEET(): Promise<Map<string, string[]>> {
    try {
        
        const responseJson = await getGoogleSheetResponseJson();

        if (!Array.isArray(responseJson) || responseJson.length === 0) {
            throw new Error('Google Sheets boş veya geçersiz veri döndürüldü.');
        }

        // Build intermediate map with Sets to deduplicate YV codes
        const OE_YV_set = new Map<string, Set<string>>();

        responseJson.forEach((item: any) => {
            const oe = item['orjNo'];
            const yv = item['yvNo'];

            // Only process if both OE and YV exist
            if (oe && yv) {
                // Normalize OE for storage
                const trimmedOE = String(oe).trim();

                if (OE_YV_set.has(trimmedOE)) {
                    // Add to existing Set (prevents duplicates)
                    OE_YV_set.get(trimmedOE)?.add(String(yv).trim());
                } else {
                    // Create new Set for this OE
                    OE_YV_set.set(trimmedOE, new Set([String(yv).trim()]));
                }
            }
        });

        // Convert Sets to Arrays for final result
        const result = new Map<string, string[]>();
        OE_YV_set.forEach((yvSet: Set<string>, oeKey: string) => {
            result.set(oeKey, Array.from(yvSet));
        });

        console.log(`OE-YV mapping created with ${result.size} unique OE numbers`);
        return result;
        
    } catch (error: any) {
        console.error('Googgle sheet veri alınamadı !\n Yerel veri kullanılıyor', error);
        throw error;

    }
}

export default { fetchSheetData: getGoogleSheetResponseJson, ORJ_NO_MAP_GOOGLE_SHEET };

