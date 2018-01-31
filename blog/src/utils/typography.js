import Typography from 'typography'
import {styleScheme, calcSize} from '../config';
// import grandViewTheme from 'typography-theme-grand-view'

const typography = new Typography({
    baseFontSize: "16px",
    baseLineHeight: 1.75,
    googleFonts: [
        {
            name: "Work Sans",
            styles: ['300', '400', '600'],
        }
    ],
    bodyFontFamily: ["Work Sans", "sans-serif"],
    headerFontFamily: ["Work Sans", "sans-serif"],
    overrideStyles: ({ adjustFontSizeTo, rhythm }, options, styles) => ({
        body: {
            'margin-left': calcSize(64),
            'margin-top': calcSize(24)
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