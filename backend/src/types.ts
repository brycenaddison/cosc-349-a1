export type RiotMatch = {
  id: string;
  data: unknown;
};

export type RiotTimeline = {
  id: string;
  data: unknown;
};

export type Match = {
  id: string;
};

export type Comment = {
  id: number;
  match_id: string;
  name: string;
  message: string;
  time: number;
};

export type ParsedComment = {
  timestamp: number;
  name: string;
  message: string;
};
