import { Task } from './index';

// Route param contract for the stack navigator.
// TaskDetail can be opened either with a full Task object (in-app tap)
// or with just a taskId (when opened from a tapped push notification).
export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetail: { task?: Task; taskId?: string };
};
