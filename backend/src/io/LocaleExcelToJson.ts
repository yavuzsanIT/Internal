import fs from 'fs/promises';
import path from 'path';
import { getSerializedMapFromJsondata } from './Helpers';


export async function ORJ_NO_RAW_DATA_LOCALE() {

  let jsonData: any[] = [];
  try {

    // Resolve file path
    const resolvedPath = path.resolve(__dirname, '../../data/ORJ_NO.json');
    console.log(`Reading Excel file: ${resolvedPath}`);

    // Read JSON data
    jsonData = JSON.parse(await fs.readFile(resolvedPath, 'utf-8'));

    if (jsonData.length === 0) {
      console.warn('Excel dosyasında veri bulunamadı.');
      return [];
    }

    console.log(`Successfully read ${jsonData.length} rows from JSON DB file`);

  } catch (error) {
    console.error('JSON okuma hatası:', error);
    return [];
  }
  return jsonData;
}

async function ORJ_NO_MAP_LOCALE() {

  const jsonData = await ORJ_NO_RAW_DATA_LOCALE();

  const serializedMap = await getSerializedMapFromJsondata(jsonData);

  return serializedMap;
}

export default ORJ_NO_MAP_LOCALE;