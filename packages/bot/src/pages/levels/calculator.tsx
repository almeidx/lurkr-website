import ms from '@almeidx/ms';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';

import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip';
import { XP } from '../../utils/constants';
import { parseMultiplier } from '../../utils/utils';

const averageXpPerMessage = (40 + 15) / 2;
const timePerMessage = ms('1m20s');

export default function Calculator() {
  const [level, setLevel] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [multiplier, setMultiplier] = useState('');

  const multiplierValue = useMemo(() => parseMultiplier(multiplier), [multiplier]);
  const requiredXp = useMemo(
    () => XP(parseInt(level, 10)) - XP(parseInt(currentLevel, 10) || 0),
    [level, currentLevel],
  );

  const calculateAmountOfMessages = useCallback(
    () => Math.ceil(requiredXp / (averageXpPerMessage * (multiplierValue ?? 1))),
    [requiredXp, multiplierValue],
  );

  const calculateTime = useCallback(
    () => Math.ceil(calculateAmountOfMessages() * timePerMessage),
    [calculateAmountOfMessages],
  );

  return (
    <div className="min-h-screen bg-discord-dark flex flex-col items-center">
      <Head>
        <title>Level Calculator | Pepe Manager</title>
      </Head>

      <header className="flex flex-col gap-4 items-center my-4 mx-3 sm:mx-0 text-center sm:mb-6">
        <h1>Level Calculator</h1>
        <p className="text-gray-400 font-light">Calculate how much you need to message to reach a certain level!</p>
      </header>

      <main className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            id="level"
            maxLength={3}
            onChange={(e) => setLevel(e.target.value)}
            onClear={() => setLevel('')}
            placeholder="Enter the desired level"
            value={level}
          />

          <Input
            id="initialLevel"
            maxLength={3}
            onChange={(e) => setCurrentLevel(e.target.value)}
            onClear={() => setCurrentLevel('')}
            placeholder="Enter the current level"
            value={currentLevel}
          />

          <Input
            id="multiplier"
            maxLength={5}
            onChange={(e) => setMultiplier(e.target.value)}
            onClear={() => setMultiplier('')}
            placeholder="Enter an XP multiplier"
            value={multiplier}
          />
        </div>

        {(requiredXp <= 0 && (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          <div className="flex flex-row gap-1.5 items-center px-2 py-1.5 rounded-lg bg-red-500">
            <RiErrorWarningFill className="h-6 w-6 fill-current text-white" />

            <span className="text-white">
              The current level you inputted is larger than the level you want to achieve.
            </span>
          </div>
        )) ||
          (multiplier !== '' && !multiplierValue && (
            <div className="flex flex-row gap-1.5 items-center px-2 py-1.5 rounded-lg bg-red-500">
              <RiErrorWarningFill className="h-6 w-6 fill-current text-white" />

              <span className="text-white">The multiplier value you inputted is invalid.</span>
            </div>
          ))}

        {level && requiredXp > 0 && (!multiplier || multiplierValue) && (
          <div className="grid grid-rows-3 sm:grid-rows-none sm:grid-cols-3 gap-3">
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-row justify-between gap-2 items-center">
                <span className="text-gray-200">Approximate Messages</span>
                <Tooltip text="The amount of messages you need to write into a valid leveling enabled channel assuming all of your messages will be counted as XP gain, and assuming your XP gain is a perfect average between the lowest gain possible and the highest gain possible" />
              </div>
              <p className="text-gray-200 text-4xl font-bold text-center font-display">
                {calculateAmountOfMessages().toLocaleString('en')}
              </p>
            </div>
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-row justify-between gap-2 items-center">
                <span className="text-gray-200">Estimated Time</span>
                <Tooltip text="The time it would take of constant chatting to reach this level, assuming you send a message every 1 minute and 20 seconds, and assuming all messages are counted as XP gain." />
              </div>
              <p className="text-gray-200 text-4xl font-bold text-center font-display">{ms(calculateTime())}</p>
            </div>
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-row justify-between gap-2 items-center">
                <span className="text-gray-200">XP Required</span>
                <Tooltip text="The total amount of XP needed to get to this level. The XP to Level conversion is a fixed constant." />
              </div>
              <p className="text-gray-200 text-4xl font-bold text-center font-display">
                {Math.ceil(requiredXp).toLocaleString('en')}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
