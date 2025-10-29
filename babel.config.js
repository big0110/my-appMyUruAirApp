// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // เพิ่ม plugin นี้สำหรับ reanimated (จำเป็นสำหรับ Drawer)
      'react-native-reanimated/plugin',
    ],
  };
};