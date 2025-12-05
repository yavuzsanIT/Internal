/**
 * InstantSearchService
 *
 * This service provides instant OE -> YV lookup functionality used by the
 * `/api/search-oe` endpoint. The actual lookup logic is intentionally left
 * as a placeholder for you to implement. Replace the body of
 * `findYVCodes` with your preferred data source or algorithm.
 */

import { get_OE_YV_MAP } from '../io/OE_YV_Map';
import { normalize_OE } from '../utils/helpers';

export async function find_single_YV_Codes(oeNumber: string): Promise<string[]> {

    try {

        if (!oeNumber || oeNumber.trim().length < 2) {
            throw new Error('OE numarası en az 2 karakter olmalı.');
        }

        // Search in the map
        const results = (await get_OE_YV_MAP()).get(normalize_OE(oeNumber.trim()));

        if (!results || results.length === 0) {
            console.log(`No results found for OE: ${oeNumber}`);
            return [];
        }

        return results;

    } catch (error) {
        console.error('OE arama hatası:', error);
        throw error;
    }


}

export default { findYVCodes: find_single_YV_Codes };
