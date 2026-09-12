export interface LogResponse {
  id: number;
  title: string;
  content: string;
  dateFor: string;
  isDone: boolean;
  reminderFor: string | null;
  createdAt: string;
  updatedAt: string | null;
}
