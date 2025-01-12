import React, { createContext, useContext, useState } from 'react';
import { Map } from 'rot-js';

interface DungeonState {
  map: { [key: string]: string };
  level: number;
}

interface DungeonContextType {
  dungeonState: DungeonState;
  generateNewLevel: () => void;
}

const DungeonContext = createContext<DungeonContextType | undefined>(undefined);

export const DungeonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dungeonState, setDungeonState] = useState<DungeonState>({
    map: {},
    level: 1,
  });

  const generateNewLevel = () => {
    const newMap: { [key: string]: string } = {};
    const mapSize = 15;

    let generator: any

    // Alternate between Digger and Uniform based on the current level
    if (dungeonState.level % 2 === 0) {
      generator = new Map.Uniform(mapSize, mapSize, {
        roomWidth: [3, 6],
        roomHeight: [3, 6],
      });
    } else {
      generator = new Map.Digger(mapSize, mapSize, {
        roomWidth: [3, 6],
        roomHeight: [3, 6],
        corridorLength: [2, 5],
        dugPercentage: 0.2,
      });
    }

    // Define the callback for creating the map
    const digCallback = (x: number, y: number, value: number) => {
      const key = `${x},${y}`;
      newMap[key] = value ? '#' : '.';
    };

    // Create the map
    generator.create(digCallback);

    // Update the state with the new map
    setDungeonState(prevState => ({
      map: newMap,
      level: prevState.level + 1,
    }));
  };

  return (
    <DungeonContext.Provider value={{ dungeonState, generateNewLevel }}>
      {children}
    </DungeonContext.Provider>
  );
};

export const useDungeon = () => {
  const context = useContext(DungeonContext);
  if (context === undefined) {
    throw new Error('useDungeon must be used within a DungeonProvider');
  }
  return context;
};