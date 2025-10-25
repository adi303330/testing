import { GameUI } from '@/components/game-ui';
import SpookyApparition from '@/components/spooky-apparition';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <GameUI />
      <SpookyApparition />
    </div>
  );
}
