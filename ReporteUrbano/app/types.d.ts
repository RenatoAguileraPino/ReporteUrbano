import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  '(auth)': NavigatorScreenParams<AuthStackParamList>;
  '(app)': NavigatorScreenParams<AppStackParamList>;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};

export type AppStackParamList = {
  home: undefined;
}; 