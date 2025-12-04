import path from 'path';
import fs from 'fs/promises';
import xlsx from 'xlsx';
import { getSerializedMapFromJsondata } from './Helpers';


async function ORJ_NO_RAW_DATA_LOCALE() {

  let jsonData: any[] = [];
  try {

    // Resolve file path
    const resolvedPath = path.resolve(__dirname, '../../data/ORJ_NO.xlsx');
    console.log(`Reading Excel file: ${resolvedPath}`);

    // Read Excel workbook
    const wb = xlsx.readFile(resolvedPath, { cellDates: true });
    const ws = wb.Sheets['Sheet1'] || wb.Sheets[wb.SheetNames[0]];

    if (!ws) {
      throw new Error(`Sayfa bulunamadı`);
    }

    // Convert sheet to JSON
    jsonData = xlsx.utils.sheet_to_json(ws, { raw: false });

    if (jsonData.length === 0) {
      console.warn('Excel dosyasında veri bulunamadı.');
      return [];
    }

    console.log(`Successfully read ${jsonData.length} rows from Excel`);

  } catch (error) {
    console.error('Excel dönüştürme hatası:', error);
    return [];
  }
  return jsonData;
}

async function ORJ_NO_MAP_LOCALE() {

  const jsonData = await ORJ_NO_RAW_DATA_LOCALE();


  const serializedMap = await getSerializedMapFromJsondata(jsonData);
  

  await fs.writeFile(path.resolve(__dirname, '../../data/ORJ_NO.json'), JSON.stringify(Array.from(serializedMap.entries()).map(([OE, YV]) => ({ OE, YV })), null, 2), 'utf-8');
  console.log(`Successfully wrote ${serializedMap.size} records to ORJ_NO.json`);

  return serializedMap;
}

ORJ_NO_MAP_LOCALE();
export default ORJ_NO_MAP_LOCALE;