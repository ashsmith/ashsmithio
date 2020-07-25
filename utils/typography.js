import Typography from 'typography'
import {styleScheme, calcSize} from '../config';

const typography = new Typography({
    baseFontSize: "16px",
    baseLineHeight: 1.75,
    bodyFontFamily: ["Work Sans", "sans-serif"],
    headerFontFamily: ["Work Sans", "sans-serif"],
    googleFonts: [
        {
          name: 'Work Sans',
          styles: [
            '300', '600&display=swap'
          ],
        },
      ],
    overrideStyles: ({ adjustFontSizeTo, rhythm }, options, styles) => ({
        body: {
            'margin': 0
        },
        a: {
            'color': '#3567E8',
            'text-decoration': 'none'
        },
        'a:hover,a:active': {
            'text-decoration': 'underline'
        },
      })
  },
);

export default typography