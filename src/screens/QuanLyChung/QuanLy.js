import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    Image,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    Animated,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { transform } from '@babel/core';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-screens';
//import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default GridMatHang = function ({ navigation = useNavigation() }) {
    const data = [
        { id: 'a', value: 'A' },
        { id: 'b', value: 'B' },
        { id: 'c', value: 'C' },
        { id: 'd', value: 'D' },
        { id: 'e', value: 'E' },
        { id: 'f', value: 'F' },
    ];
    const numColumns = 3;
    const size = Dimensions.get('window').width / numColumns;

    return (
        <FlatList
          data={data}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.item}>{item.value}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={numColumns} />
      );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    items: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginHorizontal: 5,
    },

    image: {
        width: 100,
        height: 100,

    },

    productCard: {
        height: 200,
        width: 190,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        width: size,
        height: size,
    },
    item: {
        flex: 1,
        margin: 3,
        backgroundColor: 'lightblue',
    }
});