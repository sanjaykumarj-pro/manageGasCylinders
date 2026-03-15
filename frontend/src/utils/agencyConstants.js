/**
 * Official agency name mappings.
 * Backend stores: INDANE | HP | BHARAT
 * Display as full official corporation names.
 */
export const AGENCY_FULL_NAMES = {
    INDANE: 'IOCL – Indian Oil Corporation Limited',
    HP:     'HPCL – Hindustan Petroleum Corporation Limited',
    BHARAT: 'BPCL – Bharat Petroleum Corporation Limited',
};

export const AGENCY_SHORT_NAMES = {
    INDANE: 'IOCL',
    HP:     'HPCL',
    BHARAT: 'BPCL',
};

export const AGENCY_LABEL = (code) =>
    AGENCY_FULL_NAMES[code] || code;

export const AGENCY_SHORT = (code) =>
    AGENCY_SHORT_NAMES[code] || code;
