import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UseKeyboardBottomInsetOptions {
  enabled?: boolean;
  extraOffset?: number;
}

export const useKeyboardBottomInset = ({
  enabled = true,
  extraOffset = 0,
}: UseKeyboardBottomInsetOptions = {}) => {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
      return undefined;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [enabled]);

  return useMemo(() => {
    const bottomInset = Math.max(0, keyboardHeight - insets.bottom + extraOffset);

    return {
      bottomInset,
      insets,
      keyboardHeight,
      keyboardVisible,
    };
  }, [extraOffset, insets, keyboardHeight, keyboardVisible]);
};
