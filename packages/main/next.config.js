module.exports = {
  poweredByHeader: false,
  /*
   * TODO: Enable this whenever react-visibility-sensor updates to not use the findDOMNode function
   * maybe even use the react-in-viewpost package instead, whenever their update to remove this function is merged
   */
  reactStrictMode: false,
  redirects() {
    return [
      {
        destination: 'https://pepemanager.com',
        permanent: true,
        source: '/bot',
      },
    ];
  },
};
