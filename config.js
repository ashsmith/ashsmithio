export const styleScheme = {
    baseFontSize: 16,
    baseFontUnit: 'px',
    bodyColor: '#5C5C5C',
    primaryColor: '#3567E8',
    headingColor: '#222222',
    borderColor: '#F1F1F1',
    secondaryColor: '#9F9F9F'
};

/**
 * Calculate pixel value into REMs.
 * 
 * @param int pixelSize 
 */
export function calcSize(pixelSize) {
    return `${pixelSize / styleScheme.baseFontSize}` + "rem";
}

export default {styleScheme, calcSize};