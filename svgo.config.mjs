export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
        },
      },
    },
    'removeMetadata',
    'removeComments',
    'removeEditorsNSData',
    'removeXMLProcInst',
    'removeDoctype',
  ],
}
