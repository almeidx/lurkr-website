export interface IGuild {
  emojiCount: number;
  icon: string;
  id: string;
  invite: string;
  memberCount: number;
  name: string;
}

export interface IEmoji {
  id: string;
  invite: string;
  name: string;
}

export interface ILevel {
  id: string;
  level: number;
  xp: number;
}
