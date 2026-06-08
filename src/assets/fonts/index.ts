export const AppFonts = {
  googleSansRegular: 'GoogleSans-Regular',
  googleSansItalic: 'GoogleSans-Italic',
  googleSansMedium: 'GoogleSans-Medium',
  googleSansMediumItalic: 'GoogleSans-MediumItalic',
  googleSansSemiBold: 'GoogleSans-SemiBold',
  googleSansSemiBoldItalic: 'GoogleSans-SemiBoldItalic',
  googleSansBold: 'GoogleSans-Bold',
  googleSansBoldItalic: 'GoogleSans-BoldItalic',
} as const;

export const AppFontSources = {
  [AppFonts.googleSansRegular]: require('./GoogleSans-Regular.ttf'),
  [AppFonts.googleSansItalic]: require('./GoogleSans-Italic.ttf'),
  [AppFonts.googleSansMedium]: require('./GoogleSans-Medium.ttf'),
  [AppFonts.googleSansMediumItalic]: require('./GoogleSans-MediumItalic.ttf'),
  [AppFonts.googleSansSemiBold]: require('./GoogleSans-SemiBold.ttf'),
  [AppFonts.googleSansSemiBoldItalic]: require('./GoogleSans-SemiBoldItalic.ttf'),
  [AppFonts.googleSansBold]: require('./GoogleSans-Bold.ttf'),
  [AppFonts.googleSansBoldItalic]: require('./GoogleSans-BoldItalic.ttf'),
} as const;
