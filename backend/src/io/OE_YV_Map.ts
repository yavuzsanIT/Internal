import { ORJ_NO_MAP_GOOGLE_SHEET } from "./GoogleExcelToJson";
import ORJ_NO_MAP_LOCALE from "./LocaleExcelToJson";

export async function get_OE_YV_MAP(): Promise<Map<string, string[]>> {

    try {

        return await ORJ_NO_MAP_GOOGLE_SHEET();

    } catch (error) {

        console.log('Google sheet veri alınamadı !\n Yerel veri kullanılıyor');

        return await ORJ_NO_MAP_LOCALE()

    }

}