import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import { getSerializedMapFromJsondata } from '../io/Helpers';



export async function updateOrjNoData(uploadedPath: string) {

    const jsonData = await readSourceFile(uploadedPath);

    const serializedMap = await getSerializedMapFromJsondata(jsonData);


    const outputFilePath = path.join(process.cwd(), "data/ORJ_NO.json");
    await writeSourceFile(outputFilePath, serializedMap);

}

async function readSourceFile(uploadedPath: string) {

    try {

        console.log(`Reading Excel file: ${uploadedPath}`);

        const wb = xlsx.readFile(uploadedPath, { cellDates: true });
        const ws = wb.Sheets['Sheet1'] || wb.Sheets[wb.SheetNames[0]];

        if (!ws) {
            throw new Error(`Sayfa bulunamadı`);
        }

        const jsonData = xlsx.utils.sheet_to_json(ws, { raw: false });

        if (jsonData.length === 0) {
            console.warn('Excel dosyasında veri bulunamadı.');
            return [];
        }

        console.log(`Successfully read ${jsonData.length} rows from Excel`);

        return jsonData;

    } catch (err: any) {
        console.error('Excel dönüştürme hatası:', err);
        return [];
    }
}

async function writeSourceFile(outputPath: string, serializedMap: Map<string, string[]>) {


    await fs.writeFile(outputPath, JSON.stringify(Array.from(serializedMap.entries()).map(([OE, YV]) => ({ OE, YV })), null, 2), 'utf-8');
    console.log(`Successfully wrote ${serializedMap.size} records to ORJ_NO.json`);
}