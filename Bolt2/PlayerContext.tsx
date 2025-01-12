import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PlayerState {
  position: { x: number; y: number };
  lives: number;
  maxLives: number;
}

interface PlayerContextType {
  playerState: PlayerState;
  movePlayer: (dx: number, dy: number) => void;
  setPlayerPosition: (x: number, y: number) => void;
  loseLife: () => void;
  gainLife: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    position: { x: 0, y: 0 },
    lives: 3,
    maxLives: 5,
  });

  const movePlayer = (dx: number, dy: number) => {
    setPlayerState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + dx,
        y: prev.position.y + dy,
      },
    }));
  };

  const setPlayerPosition = (x: number, y: number) => {
    setPlayerState(prev => ({
      ...prev,
      position: { x, y },
    }));
  };

  const loseLife = () => {
    setPlayerState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }));
  };

  const gainLife = () => {
    setPlayerState(prev => ({
      ...prev,
      lives: Math.min(prev.maxLives, prev.lives + 1),
    }));
  };

  return (
    <PlayerContext.Provider value={{ playerState, movePlayer, setPlayerPosition, loseLife, gainLife }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
