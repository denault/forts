import type { Peer } from '@p2p-rooms/shared';
import { useMediaStore } from '../stores/mediaStore';
import VideoTile from './VideoTile';

interface VideoGridProps {
  localStream: MediaStream | null;
  peers: Map<string, Peer>;
  remoteStreams: Map<string, MediaStream>;
  displayName: string;
}

export default function VideoGrid({ localStream, peers, remoteStreams, displayName }: VideoGridProps) {
  const { isMuted, isCameraOff, screenStream, isScreenSharing } = useMediaStore();
  const totalTiles = peers.size + 1 + (isScreenSharing ? 1 : 0);

  const getGridClass = () => {
    if (totalTiles === 1) return 'grid-cols-1 max-w-2xl';
    if (totalTiles === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-4xl';
    if (totalTiles <= 4) return 'grid-cols-2 max-w-5xl';
    if (totalTiles <= 6) return 'grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  const peerArray = Array.from(peers.values());

  return (
    <div className={`grid ${getGridClass()} gap-3 h-full auto-rows-fr mx-auto w-full content-center`}>
      <VideoTile
        stream={localStream}
        displayName={displayName}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isLocal={true}
      />

      {isScreenSharing && screenStream && (
        <VideoTile
          stream={screenStream}
          displayName={`${displayName}'s screen`}
          isMuted={true}
          isCameraOff={false}
          isLocal={true}
          isScreenShare={true}
        />
      )}

      {peerArray.map((peer, index) => (
        <VideoTile
          key={peer.id}
          stream={remoteStreams.get(peer.id) || null}
          displayName={peer.displayName}
          isMuted={peer.isMuted}
          isCameraOff={peer.isCameraOff}
          delay={index * 50}
        />
      ))}
    </div>
  );
}
