export const test = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'test';
};
