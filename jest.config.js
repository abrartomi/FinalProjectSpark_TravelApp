module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // or 'ts-jest' if using TypeScript
  },
  
  testEnvironment: 'jsdom',
};
