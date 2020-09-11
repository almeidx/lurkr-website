export interface Emoji {
  animated: boolean;
  id: string;
  name: string;
  url: string;
  invite: string;
}

export interface Guild {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  invite: string;
  emojis: Emoji[];
}
