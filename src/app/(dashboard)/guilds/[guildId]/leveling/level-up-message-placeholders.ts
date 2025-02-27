import type { PlaceholderValue } from "@/components/dashboard/Textarea.tsx";

export const levelUpMessagePlaceholders = [
	{ id: "{user}", name: "{user} • @user" },
	{ id: "{user.avatar}", name: "{user.avatar} • image url" },
	{ id: "{user.discriminator}", name: "{user.discriminator} • 0001" },
	{ id: "{user.id}", name: "{user.id} • 1234567890123456789" },
	{ id: "{user.tag}", name: "{user.tag} • user#0001 or user" },
	{ id: "{user.username}", name: "{user.username} • user" },
	{ id: "{level}", name: "{level} • The new level" },
	{ id: "{xp}", name: "{xp} • The user's xp" },
	{ id: "{roleRewards}", name: "{roleRewards} • Role rewards gained" },
	{ id: "{guild.icon}", name: "{guild.icon} • image url" },
	{ id: "{guild.id}", name: "{guild.id} • 1234567890123456789" },
	{ id: "{guild.name}", name: "{guild.name} • Server name" },
] satisfies PlaceholderValue[];
