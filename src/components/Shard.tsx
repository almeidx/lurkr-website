import ms from '@almeidx/ms';

interface ShardProps {
  guilds: number;
  id: number;
  members: number;
  memory: number;
  ping: number;
  selected: boolean;
  uptime: number;
}

export default function Shard({ guilds, id, members, memory, ping, selected, uptime }: ShardProps) {
  return (
    <tr
      className={selected ? 'animate-pulse' : ''}
      style={{ backgroundColor: selected ? 'rgba(16, 185, 129, 0.5)' : 'inherit' }}
    >
      <td className="py-3">{id.toLocaleString('en')}</td>
      <td>{guilds.toLocaleString('en')}</td>
      <td>{members.toLocaleString('en')}</td>
      <td>{ping.toLocaleString('en')}</td>
      <td>{memory.toLocaleString('en')}</td>
      <td>{ms(uptime, false)}</td>
    </tr>
  );
}
