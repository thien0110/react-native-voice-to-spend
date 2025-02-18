import Voice, { type SpeechErrorEvent } from '@react-native-community/voice';
import type { SpeechResultsEvent } from '@react-native-community/voice';

import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { useEffect, useState } from 'react';
export interface SpeechResponse {
  data: ISpend | null;
  success: boolean;
  message: string;
}
export interface ISpend {
  original: string;
  price: string;
  name: string;
  createAt: string;
}
export interface VoiceToTextProps {
  onSpeechSuccess: (response: SpeechResponse) => void;
  onSpeechVolumeChangedProp: (volume: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
  isDark?: boolean;
}
const parseTextToSpend = (input: string) => {
  const regex_get_cost =
    /(?:\d{1,3}(?:[.,]\d{3})*|\d+) ?(?:ca|k)\b|\d{1,3}(?:[.,]\d{3})+|\d{4,}/gi;
  const match = input.match(regex_get_cost);
  if (match) {
    const money = match[0].replace(/\s+/g, '').replace(/k|K|ca/g, '000');
    return {
      original: input,
      // price: parseInt(money, 10),
      price: money,
      name: input.replace(match[0], '').trim(),
      createAt: new Date().toISOString(),
    };
  } else {
    return null;
  }
};
const VoiceToText = (props: VoiceToTextProps) => {
  const {
    onSpeechSuccess,
    onSpeechVolumeChangedProp,
    onStart,
    onEnd,
    isDark = true,
  } = props;
  // const [recognized, setRecognized] = useState(false);
  const [end, setEnd] = useState(false);
  // const [started, setStarted] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const onSpeechVolumeChanged = (e: any) => {
    // console.log('onSpeechVolumeChanged: ', e);
    onSpeechVolumeChangedProp(e);
  };
  const onSpeechStart = () => {
    onStart?.();
    setEnd(false);
    // setStarted(true);
  };

  const onSpeechRecognized = () => {
    // setRecognized(true);
  };

  const onSpeechEnd = () => {
    onEnd?.();
    setEnd(true);
    // setStarted(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    onSpeechSuccess({
      data: null,
      success: false,
      message: JSON.stringify(e.error),
    });
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e.value!);
  };
  const _startRecognizing = async () => {
    try {
      await Voice.start('vi-VN');
    } catch (e) {
      console.error('From-VoiceToText: ', e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('From-VoiceToText: ', e);
    }
  };
  useEffect(() => {
    if (end && results.length > 0) {
      const firstResult = results[0];
      if (firstResult) {
        const result = parseTextToSpend(firstResult);
        if (result) {
          onSpeechSuccess({ data: result, success: true, message: '' });
        } else {
          onSpeechSuccess({
            data: null,
            success: false,
            message:
              'Chi tiêu không hợp lệ, vui lòng thử lại. VD: Ăn sáng 50 nghìn',
          });
        }
      } else {
        onSpeechSuccess({
          data: null,
          success: false,
          message: 'Không có kết quả hợp lệ.',
        });
      }
    }
  }, [end, results]);
  return (
    <TouchableHighlight
      style={[
        styles.container_button,
        !isDark && { backgroundColor: '#fff', borderColor: '#2e2e2e' },
      ]}
      onPressIn={_startRecognizing}
      onPressOut={() => {
        setTimeout(() => {
          _stopRecognizing();
        }, 400);
      }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
    >
      <View style={[styles.button]} />
    </TouchableHighlight>
  );
};

export default VoiceToText;
const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#D70E17',
    borderRadius: 50,
  },
  button_active: {
    width: 25,
    height: 25,
    backgroundColor: '#D70E17',
    borderRadius: 5,
  },
  container_button: {
    backgroundColor: '#2e2e2e',
    width: 58,
    height: 58,
    borderRadius: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
