import ms from '@almeidx/ms';
import Head from 'next/head';
import { useState } from 'react';

import Input from '../../components/Input';
import { XP } from '../../utils/constants';

const averageXpPerMessage = (40 + 15) / 2;
const timePerMessage = ms('1m20s');

export default function Calculator() {
  const [level, setLevel] = useState('');
  const [initialLevel, setInitialLevel] = useState('');

  const calculateAmountOfMessages = () => Math.ceil(XP(parseInt(level, 10)) / averageXpPerMessage);
  const calculateTime = () => Math.ceil(calculateAmountOfMessages() * timePerMessage);

  return (
    <div className="min-h-screen bg-discord-dark flex flex-col items-center">
      <Head>
        <title>Level Calculator | Pepe Manager</title>
      </Head>

      <header className="flex flex-col gap-4 items-center mb-6">
        <h1>Level Calculator</h1>
        <p className="text-gray-400 font-light">Calculate how much you need to message to reach a certain level!</p>
      </header>

      <main className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
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
            onChange={(e) => setInitialLevel(e.target.value)}
            onClear={() => setInitialLevel('')}
            placeholder="Enter the initial level"
            value={initialLevel}
          />
        </div>

        {level && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <span className="text-white font-bold">Approximate Messages</span>
              <p className="text-gray-200 text-4xl text-center">{calculateAmountOfMessages().toLocaleString('en')}</p>
            </div>
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <span className="text-white font-bold">Estimated Time</span>
              <p className="text-gray-200 text-4xl text-center">{ms(calculateTime())}</p>
            </div>
            <div className="bg-discord-not-quite-black rounded-md px-4 py-3 flex flex-col gap-2">
              <span className="text-white font-bold">XP Required</span>
              <p className="text-gray-200 text-4xl text-center">
                {Math.ceil(XP(parseInt(level, 10))).toLocaleString('en')}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
