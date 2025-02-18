import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import VoiceToText from 'react-native-voice-to-spend';
export function currencyNumber(x: string) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export default function App() {
  const [results, setResults] = useState<Item[]>([]);
  interface SpeechEvent {
    success: boolean;
    data: {
      original: string;
      price: string;
      name: string;
      createAt: string;
    } | null;
    message?: string;
  }

  interface Item {
    original: string;
    price: string;
    name: string;
    createAt: string;
  }

  const onSpeech = (e: SpeechEvent) => {
    if (e.success) {
      setResults((prev: Item[]) => [...prev, e.data!]);
    } else {
      Alert.alert('Thông báo', e.message || 'An error occurred');
    }
  };

  const ViewItem = ({ item }: { item: Item }) => {
    return (
      <View style={styles.item}>
        <Text numberOfLines={1} style={styles.item_name}>
          {item.name}
        </Text>
        <Text style={styles.item_price}>{currencyNumber(item.price)} VND</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <FlatList
        style={{ flex: 1, padding: 12 }}
        data={results}
        renderItem={ViewItem}
      />
      <View style={styles.btn_action}>
        <VoiceToText
          onSpeechSuccess={onSpeech}
          isDark={false}
          onSpeechVolumeChangedProp={(e) => {
            // console.log('pitch', e);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f4fd',
  },
  btn_action: {
    paddingBottom: 50,
    backgroundColor: '#3a8dac',
    width: '100%',
    paddingTop: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#b0a8b9',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,

    flex: 1,
  },
  item_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',

    flex: 1,
  },
  item_price: {
    fontSize: 16,
    color: '#F00',
  },
});
