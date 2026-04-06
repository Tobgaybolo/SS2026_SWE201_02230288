export type Contact = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  office: string;
};

export type RootStackParamList = {
  CampusTabs: undefined;
  ContactDetails: { contact: Contact };
};

export type BottomTabParamList = {
  Home: undefined;
  Contacts: undefined;
  Schedule: undefined;
  NoticeBoard: undefined;
};
