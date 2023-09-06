/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface DeleteTimeTrackRequest {
  timeTrackId: number;
}

export interface EditTimeTrackRequest {
  addedActivities?: {
    description: string;
  }[];
  deletedActivities?: number[];
  endTime?: Date;
  projectId?: number;
  startTime?: Date;
  timeTrackId: number;
  updatedActivities?: {
    description: string;
    id: number;
  }[];
}

export interface StartTimeTrackRequest {
  projectId: number;
}

export interface StopTimeTrackRequest {
  activities: string[];
}
