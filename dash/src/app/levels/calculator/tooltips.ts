export const APPROXIMATE_MESSAGES_TOOLTIP =
	"The amount of messages you need to write into a valid leveling enabled channel, assuming all of your messages will be counted as exp. gain, and assuming your exp. gain is a perfect average between the min and max XP per message values";

export const ESTIMATED_TIME_TOOLTIP =
	"The time it would take of constant chatting to reach this level, based on the XP gain interval setting, and assuming all messages are counted as exp. gain";

export const EXPERIENCE_REQUIRED_TOOLTIP =
	"The total amount of exp. needed to get to this level. The exp. to Level conversion is a fixed constant";

export const XP_GAIN_INTERVAL_TOOLTIP =
	"The cooldown in seconds between messages that count for leveling. After sending a message, a user must wait this duration before another message will grant XP. This prevents spamming";

export const XP_RANGE_TOOLTIP =
	"The range of base XP earned per valid message. Whenever a user sends a message (after the cooldown), they gain a random amount of XP between the Min and Max values inclusive";

export const LEVELING_MULTIPLIER_TOOLTIP =
	"A global multiplier applied to the base XP generated per message. For example, if a message generates 20 XP and the multiplier is 2.0, the user will actually receive 40 XP";
