import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { DungeonProvider, useDungeon } from './DungeonContext';
import { PlayerProvider, usePlayer } from './PlayerContext';

const GameView: React.FC = () => {
  const { dungeonState, generateNewLevel } = useDungeon();
  const { playerState, movePlayer } = usePlayer();

  const renderMap = () => {
    const viewRadius = 4; // This gives a 10x10 grid
    const mapSize = 15; // Assuming the map is 50x50
    const rows = [];

    // Calculate the top-left corner of the view
    let startX = Math.max(0, Math.min(playerState.position.x - viewRadius, mapSize - 2 * viewRadius - 1));
    let startY = Math.max(0, Math.min(playerState.position.y - viewRadius, mapSize - 2 * viewRadius - 1));

    for (let y = startY; y < startY + 2 * viewRadius + 1; y++) {
      let row = '';
      for (let x = startX; x < startX + 2 * viewRadius + 1; x++) {
        const key = `${x},${y}`;
        if (x === playerState.position.x && y === playerState.position.y) {
          row += '@'; // Player
        } else {
          row += dungeonState.map[key] || ' '; // Map tile or empty space if out of bounds
        }
      }
      rows.push(<Text key={y} style={styles.mapRow}>{row}</Text>);
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <Text>Level: {dungeonState.level}</Text>
      <Text>Player Position: ({playerState.position.x}, {playerState.position.y})</Text>
      <Text>Lives: {playerState.lives}/{playerState.maxLives}</Text>
      <TouchableOpacity onPress={generateNewLevel} style={styles.button}>
        <Text>Generate New Level</Text>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        {renderMap()}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => movePlayer(0, -1)} style={styles.button}><Text>Up</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => movePlayer(0, 1)} style={styles.button}><Text>Down</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => movePlayer(-1, 0)} style={styles.button}><Text>Left</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => movePlayer(1, 0)} style={styles.button}><Text>Right</Text></TouchableOpacity>
      </View>
    </View>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <DungeonProvider>
      <PlayerProvider>
        <SafeAreaView style={backgroundStyle}>
          <GameView />
        </SafeAreaView>
      </PlayerProvider>
    </DungeonProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  mapContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
  mapRow: {
    fontFamily: 'monospace',
    fontSize: 14, // Slightly reduced font size to fit more on screen
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default App;