import type { LogResponse } from "./LogResponse";

export type LogRequest = Omit<LogResponse, 'id' | 'createdAt' | 'updatedAt'>;
