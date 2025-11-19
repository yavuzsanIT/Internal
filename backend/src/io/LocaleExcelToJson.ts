import path from 'path';
import fs from 'fs/promises';
import xlsx from 'xlsx';


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
      return new Map();
    }

    console.log(`Successfully read ${jsonData.length} rows from Excel`);

  } catch (error) {
    console.error('Excel dönüştürme hatası:', error);
    return new Map();
  }
  return jsonData;
}

async function ORJ_NO_MAP_LOCALE() {

  const jsonData = await ORJ_NO_RAW_DATA_LOCALE();
  const OE_YV_map = new Map<string, Set<string>>();

  jsonData.forEach((item: any) => {
    const oe = item['orjNo'];
    const yv = item['yvNo'];

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

  await fs.writeFile(path.resolve(__dirname, '../../data/ORJ_NO.json'), JSON.stringify(Array.from(serializedMap.entries()).map(([OE, YV]) => ({ OE, YV })), null, 2), 'utf-8');
  console.log(`Successfully wrote ${serializedMap.size} records to ORJ_NO.json`);

  return serializedMap;
}

ORJ_NO_MAP_LOCALE();
export default ORJ_NO_MAP_LOCALE;