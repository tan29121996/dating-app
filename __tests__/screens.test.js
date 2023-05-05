import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MatchScreen from '../screens/MatchScreen';
import MessageScreen from '../screens/MessageScreen';

describe('Login Screen', () => {
  it('should render successfully', () => {
    const screen = render(<LoginScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Profile Screen', () => {
  it('should render successfully', () => {
    const screen = render(<ProfileScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Home Screen', () => {
  it('should render successfully', () => {
    const screen = render(<HomeScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Details Screen', () => {
  it('should render successfully', () => {
    const screen = render(<DetailsScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Match Screen', () => {
  it('should render successfully', () => {
    const screen = render(<MatchScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Chat Screen', () => {
  it('should render successfully', () => {
    const screen = render(<ChatScreen />);
    expect(screen).toBeTruthy();
  });
});

describe('Message Screen', () => {
  it('should render successfully', () => {
    const screen = render(<MessageScreen />);
    expect(screen).toBeTruthy();
  });
});
