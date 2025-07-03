import React from 'react';
import { Image, View, StyleSheet, Text} from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import placeholder from '../../assets/images/placeholder.png'
import { fontFamily } from '@/theme/font-family';

const DynamicLogo = () => {
  const { authState } = useAuth();
  
  const logoUri = authState.logoConfig?.logoUrl 
    ? `${authState.logoConfig.logoUrl}?ts=${Date.now()}`
    : null;

  return (
    <View style={styles.container}>
      <Image
        source={logoUri ? { uri: logoUri } : require('../../assets/images/placeholder.png')}
        style={styles.logo}
        onError={(e) => console.log('Erro na imagem:', e.nativeEvent.error)}
      />
      <Text style={[styles.appNameText, { fontFamily: fontFamily.secondary }]}>
        {authState.logoConfig?.appName || 'Coordenador.app'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain'
  },
  appNameText: {
    fontSize: 40,
    color: '#008739',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 42,
  }
});

export default DynamicLogo;
