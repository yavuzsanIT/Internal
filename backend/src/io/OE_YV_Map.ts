import { ORJ_NO_MAP_GOOGLE_SHEET } from "./GoogleExcelToJson";
import ORJ_NO_MAP_LOCALE from "./LocaleExcelToJson";

export async function get_OE_YV_MAP(): Promise<Map<string, string[]>> {

    try {

        return await ORJ_NO_MAP_LOCALE();

    } catch (error) {

        console.log('Yerel veri dosyası kullanılamıyor, Google sheets\'ten veriler çekildi.');

        return await ORJ_NO_MAP_GOOGLE_SHEET();

    }

}