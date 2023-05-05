jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react');

  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        id: '123',
      },
    }),
    useFocusEffect: useEffect,
  };
});
