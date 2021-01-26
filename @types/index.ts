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
  avatar: string | null;
  id: string;
  level: number;
  tag: string | null;
  xp: number;
}

export interface LevelsType {
  guild: {
    name: string;
    icon: string;
  };
  levels: ILevel[];
}
