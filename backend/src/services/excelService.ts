import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import { getDateTimeAsText, normalize_OE } from '../utils/helpers';
import { removeMoreThan_X } from './RemoverService';
import { get_OE_YV_MAP } from '../io/OE_YV_Map';


/**
 * Processes an uploaded Excel file by:
 * 1. Reading the query file and extracting OE/code numbers based on keyword
 * 2. Fetching the OE-YV mapping from Google Sheets
 * 3. Finding matches for the codes in the mapping
 * 4. Adding matched YV codes to the original data
 * 5. Writing results to a new Excel file
 * 6. Cleaning up old files
 * 
 * @param queryFilePath - Temporary path to the uploaded file
 * @param keywordList - Keywords to search for in column headers
 * @param originalFilename - Original filename for naming the output file
 * @returns The name of the generated result file
 * @throws Error if no matches found or processing fails
 */
export async function processExcel(queryFilePath: string, keywordList: string[], originalFilename: string): Promise<string> {

  try {

    // 1. Fetch the OE-YV mapping from Google Sheets
    const OE_YV_MAP = await get_OE_YV_MAP();

    // 2. Read the query file AND Extract OE numbers 
    //    and get relevant headers
    const queryJsonData = queryExcelToJson(queryFilePath, 'Sayfa1');
    const QUERY_OE_SET = getQuerySet(queryJsonData, keywordList);

    if (QUERY_OE_SET.size === 0) {
      throw new Error('Belirtilen sütunlarda veri bulunamadı.');
    }

    const relevantHeaders = getRelevantHeaders(queryJsonData, keywordList);


    // 3. Find YV codes matching the OE numbers
    const found = await find_multiple_YV_Codes(OE_YV_MAP, QUERY_OE_SET);

    // If no matches found, throw error
    if (found.size === 0) {
      throw new Error('Belirtilen kriterlere uygun sonuç bulunamadı.');
    }

    // 4. Add found YV codes to  original data
    queryJsonData.forEach((row: any) => {
      relevantHeaders.forEach((rh: string) => {
        const code = row[rh];

        if (code && QUERY_OE_SET.has(code)) {
          row['Found_YV_Codes'] = found.get(code)?.join(', ') || '';
        }
      });
    });

    // 5. Write results to Excel and cleanup old files
    const newFilename = await createResultExcel(queryJsonData, originalFilename, queryFilePath);

    return newFilename;

  } catch (error: any) {

    console.error('Excel işleme hatası:', error);
    throw error;
  }
}

/**
 * Reads an Excel file and converts it to JSON
 * @param inputFilePath - Path to the Excel file
 * @param sheetName - Name of the sheet to read
 * @returns Array of objects representing the sheet data
 */
function queryExcelToJson(inputFilePath: string, sheetName: string): any[] {
  try {
    const wb = xlsx.readFile(inputFilePath, { cellDates: true });
    const ws = wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[0]];

    if (!ws) {
      throw new Error(`Sayfa bulunamadı: ${sheetName}`);
    }

    const jsonData: any[] = xlsx.utils.sheet_to_json(ws, { raw: false });
    return jsonData;
  } catch (error: any) {
    console.error('Excel okuma hatası:', error);
    throw new Error(`Excel dosyası okunamadı: ${error.message}`);
  }
}

/**
 * Extracts column headers that contain any of the keywords
 * @param jsonData - The JSON data from Excel
 * @param keywordList - Keywords to search for in headers
 * @returns Array of matching header names
 */
function getRelevantHeaders(jsonData: any[], keywordList: string[]): string[] {
  const headers = new Set<string>();

  if (jsonData.length === 0) {
    throw new Error('Excel dosyasında veri bulunamadı.');
  }

  jsonData.forEach((item: any) => {
    Object.keys(item).forEach((key: string) => {
      headers.add(key);
    });
  });

  const relevantHeaders = keywordList.flatMap((kw: string) => {
    return Array.from(headers).filter((header: string) =>
      header.toLowerCase().includes(kw.toLowerCase())
    );
  });

  if (relevantHeaders.length === 0) {
    throw new Error(
      `Dosyanızda '${keywordList.join(', ')}' kelimesini içeren bir sütun başlığı bulunamadı.`
    );
  }

  return relevantHeaders;
}

/**
 * Extracts all values from relevant columns
 * Stores original values (not normalized) for later matching with results
 * @param jsonData - The JSON data from Excel
 * @param keywordList - Keywords to search for in headers
 * @returns Set of unique values from relevant columns
 */
function getQuerySet(jsonData: any[], keywordList: string[]): Set<string> {
  const oe_set: Set<string> = new Set();

  if (jsonData.length === 0) {
    console.warn('Query Excel dosyasında veri bulunamadı.');
    return oe_set;
  }

  const relevantHeaders = getRelevantHeaders(jsonData, keywordList);

  jsonData.forEach((item: any) => {
    relevantHeaders.forEach((relevantHeader: string) => {
      const value = item[relevantHeader];
      if (value) {
        // Store original value for later matching with found results
        oe_set.add(value.toString().trim());
      }
    });
  });

  return oe_set;
}

/**
 * Searches the pool map for OE numbers from the query set
 * Handles comma-separated OE numbers
 * @param POOL_MAP - Map of normalized OE codes to YV codes
 * @param QUERY_SET - Set of OE codes to search for
 * @returns Map of original query codes to found YV code arrays
 */
async function find_multiple_YV_Codes(POOL_MAP: Map<string, string[]>, QUERY_SET: Set<string>): Promise<Map<string, string[]>> {

  const foundMap: Map<string, string[]> = new Map();

  QUERY_SET.forEach((query_oe: string) => {
    // Handle comma-separated OE numbers
    if (query_oe.includes(',')) {
      const oe_numbers = query_oe.split(',').map((part: string) => part.trim());
      const found_YV_array: string[] = [];

      oe_numbers.forEach((oe: string) => {
        const normalized_oe = normalize_OE(oe.trim());
        const found_YV_array_oe = POOL_MAP.get(normalized_oe);

        if (found_YV_array_oe) {
          found_YV_array.push(...found_YV_array_oe);
        }
      });

      if (found_YV_array.length > 0) {
        // Remove duplicates using Set
        foundMap.set(query_oe, Array.from(new Set(found_YV_array)));
      }
    } else {
      // Single OE number
      const normalized_oe = normalize_OE(query_oe.trim());
      const found_YV_array = POOL_MAP.get(normalized_oe);

      if (found_YV_array) {
        foundMap.set(query_oe, found_YV_array);
      }
    }
  });

  return foundMap;
}

/**
 * Writes the processed data to an Excel file in the output directory
 * Cleans up old files to keep only the most recent ones
 * @param sourceData - Array of data rows to write
 * @param originalFilename - Original filename for naming
 * @param queryFilePath - Path to the temporary query file (will be deleted)
 * @returns The name of the created result file
 */
async function createResultExcel(sourceData: any[], originalFilename: string, queryFilePath: string): Promise<string> {
  try {
    // Generate output filename
    const fileExtension = path.extname(originalFilename);
    const baseName = path.basename(originalFilename, fileExtension);
    const newFilename = `${baseName}_Found_YV_Codes_${getDateTimeAsText()}${fileExtension}`;

    // Setup directories
    const destDir = path.resolve(process.env.OUTPUT_DIR || path.join(process.cwd(), 'outputs'));
    const sourceDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

    // Ensure directories exist
    await fs.mkdir(destDir, { recursive: true });
    await fs.mkdir(sourceDir, { recursive: true });

    const destPath = path.join(destDir, newFilename);

    // Write to Excel
    const ws = xlsx.utils.json_to_sheet(sourceData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Updated Data');
    xlsx.writeFile(wb, destPath);

    // Delete temporary query file
    try {
      await fs.unlink(queryFilePath);
    } catch (err) {
      console.warn('Geçici dosya silinemedi:', queryFilePath);
    }

    // Keep only the most recent files
    await removeMoreThan_X(destDir, 5);
    await removeMoreThan_X(sourceDir, 3);

    console.log(`Excel dosyası başarıyla oluşturuldu: ${newFilename}`);
    return newFilename;
  } catch (error: any) {
    console.error('Excel yazma hatası:', error);
    throw new Error(`Excel dosyası yazılamadı: ${error.message}`);
  }
}



export default { processExcel };
