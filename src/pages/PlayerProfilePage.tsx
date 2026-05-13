import { useParams } from 'react-router-dom';

export default function PlayerProfilePage() {
  const { playerId } = useParams();
  return <div>Player Profile Page: {playerId}</div>;
}
