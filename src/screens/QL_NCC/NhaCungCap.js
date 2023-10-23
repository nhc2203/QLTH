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
    Alert,
    StatusBar,
    RefreshControl
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { transform } from '@babel/core';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-screens';
import DatePicker from 'react-native-date-picker'
// import Searchbar from './Search';

import AntIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/MaterialIcons';



const marginBottomItem = 20;
const paddingItem = 10;
const imgHeight = 100;
const sizeOfItem = imgHeight + paddingItem * 2 + marginBottomItem;
const pxWindow = Dimensions.get('window');

export default QLMH = function ({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    //Animated
    const Yscroll = React.useRef(new Animated.Value(0)).current;
    //Data API
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    //Mat Hang 
    const [tenNCC, setTenNCC] = useState('');
    const [email, setEmail] = useState('');
    const [hideId, setHideId] = useState(null);
    const [diaChi, setDiaChi] = useState('');
    const [sdt, setSDT] = useState(null);
    const [trangThai, setTrangThai] = useState(2);
    //Tim Kiem
    const [value, setValue] = useState()
    const [search, setSearch] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [query, setQuery] = useState();
    const [error, setError] = useState()

    useEffect(() => {
        getList();
        getTimKiem();
    }, []);
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 3000);
        setFilterData('');
        getList();
        getTimKiem();
    };
    //List MH
    const getList = () => {
        axios
            .get(
                'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/NhaCungCap',
            )
            .then(json => setData(json.data))
            .finally(() => setLoading(false));

    };

    const getTimKiem = () => {
        axios
            .get(
                'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/NhaCungCap',
            )
            .then(
                json2 => setFilterData(json2.data))

    };

    //Xoa
    const handleDelete = item => {
        axios
            .delete(
                'https://sheet.best/api/sheets/2a16d1f0-e29b-4e26-abdb-754a1be9366a/tabs/NhaCungCap/MANCC/' +
                item.MANCC,
            )
            .then(json => {
                getList();
                getTimKiem();
            });
    };
    //LUU
    const handleSave = () => {
        if (hideId == null) {
            axios
                .post('https://sheetdb.io/api/v1/e3l66thzdhdwt/?sheet=NhaCungCap', {
                    data: {
                        TENNCC: tenNCC,
                        SDT: sdt,
                        EMAIL: email,
                        DIACHI: diaChi,
                    },
                })
                .then(json => {
                    setTenNCC(null);
                    setSDT(null);
                    setEmail(null);
                    setDiaChi(null);
                    setModalVisible(false);
                    getList();
                    getTimKiem();
                });
        } else {
            fetch(
                'https://sheet.best/api/sheets/2a16d1f0-e29b-4e26-abdb-754a1be9366a/tabs/NhaCungCap/MANCC/' +
                hideId,
                {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        TENNCC: tenNCC,
                        SDT: sdt,
                        EMAIL: email,
                        DIACHI: diaChi,
                    }),
                },
            ).then(json => {
                setTenNCC(null);
                setSDT(null);
                setEmail(null);
                setDiaChi(null);
                setModalVisible(false);
                getList();
                getTimKiem();
            })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };
    //Ẩn Mã Mặt Hàng
    const handleVisibleModal = () => {
        setModalVisible(!modalVisible);
        setHideId(null);
    };
    //Sửa
    const handleEdit = item => {
        setModalVisible(true);
        setHideId(item.MANCC);
        setTenNCC(item.TENNCC);
        setSDT(item.SDT);
        setEmail(item.EMAIL);
        setDiaChi(item.DIACHI);
    };

    //Hàm Tìm Kiếm
    //Set dữ liệu cho các thành phần trong Mặt Hàng
    const onChangeName = value => {
        setTenNCC(value);
    };

    const onChangeSDT = value => {
        setSDT(value);
    };
    const onChangeEmail = value => {
        setEmail(value);
    };
    const onChangeDiaChi = value => {
        setDiaChi(value);
    };
    //List Mat Hang Animated
    const renderItem = ({ item, index }) => {
        const scale = Yscroll.interpolate({
            inputRange: [-1, 0, sizeOfItem * index, sizeOfItem * (index + 2)],
            outputRange: [1, 1, 1, 0],
        });
        return (
            <TouchableOpacity>
                <Animated.View
                    style={[
                        styles.item,
                        {
                            transform: [{ scale }],
                        },
                    ]}>

                    <View style={styles.wrapText}>
                        <Text style={styles.fontSize}>{index + 1}.{' '}{item.TENNCC}</Text>
                        <Text style={styles.fontSize}>SĐT: {item.SDT}</Text>
                        <Text style={styles.fontSize}>Email: {item.EMAIL}</Text>
                        <Text style={styles.fontSize}>Địa Chỉ: {item.DIACHI}</Text>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <Text style={styles.txt_del}>Xóa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEdit(item)}>
                            <Text style={styles.txt_edit}>Sửa</Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </TouchableOpacity>
        );
    };
    const ItemSeparatorView = () => {
        return (
            <View
                style={{ width: '100%' }}
            />
        )
    }
    const updateSearch = (text) => {
        if (text) {
            const newData = data.filter(function (item) {
                const itemData = item.TENNCC
                    ? item.TENNCC.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(newData);
            setSearch(text);
        } else {
            setFilterData(data);
            setSearch(text);
        }
    }
    return (
        <SafeAreaView>
            {StatusBar.setHidden(true, 'none')}
            <View style={{ height: pxWindow.height * 0.18, borderColor: 'red', borderWidth: 0 }}>
                <View style={styles.header_container}>
                    <TouchableOpacity onPress={() => { navigation.navigate('HomeScreen') }}>
                        <Text>
                            <IonIcons
                                style={{ color: 'green', textAlign: 'center' }}
                                name="arrow-back"
                                size={30}
                            />
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.txt_main}>Nhà Cung Cấp</Text>
                    <TouchableOpacity onPress={handleVisibleModal}>
                        <Text>
                            <IonIcons
                                style={{ color: 'green', textAlign: 'center' }}
                                name="add-box"
                                size={30}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.containerS]}>
                    <View style={styles.searchContainer}>
                        <View style={styles.vwSearch}>
                            <IonIcons
                                style={{ color: 'blue', textAlign: 'center' }}
                                name="search"
                                size={30}
                            />
                        </View>
                        <TextInput
                            value={search}
                            placeholder="Tìm theo tên nhà cung cấp..."
                            style={styles.textInput}
                            onChangeText={(text) => updateSearch(text)}
                        />
                    </View>
                    {
                        error &&
                        <Text style={styles.txtError}>
                            {error}
                        </Text>
                    }
                </View >
            </View>
            <View style={{ height: pxWindow.height * 0.82, borderColor: 'blue', borderWidth: 0 }}>
                <Modal animationType="slide" visible={modalVisible} style={styles.form}>
                    <ScrollView>
                        <View style={styles.form}>
                            <TouchableOpacity onPress={handleVisibleModal}>
                                <Text style={styles.txtClose}>
                                    <IonIcons
                                        style={{ color: 'red', textAlign: 'center' }}
                                        name="close"
                                        size={30}
                                    />
                                </Text>
                            </TouchableOpacity>
                            <Text>Tên Nhà Cung Cấp:</Text>
                            <TextInput
                                value={tenNCC}
                                style={styles.text_input}
                                placeholder="Tên Nhà Cung Cấp"
                                autoCapitalize="none"
                                onChangeText={onChangeName}
                            />

                            <Text>Số Điện Thoại:</Text>
                            <TextInput
                                value={sdt}
                                style={styles.text_input}
                                placeholder="Số Điện Thoại"
                                autoCapitalize="none"
                                onChangeText={onChangeSDT}
                            />

                            <Text>Email:</Text>
                            <TextInput
                                value={email}
                                style={styles.text_input}
                                placeholder="Email"
                                autoCapitalize="none"
                                onChangeText={onChangeEmail}
                            />
                            <Text>Địa Chỉ:</Text>
                            <TextInput
                                value={diaChi}
                                style={styles.text_input}
                                placeholder="Địa Chỉ"
                                autoCapitalize="none"
                                onChangeText={onChangeDiaChi}
                            />
                            <View style={{ height: 25, width: '100%', borderWidth: 0, marginTop: 30 }}>
                                <TouchableOpacity onPress={handleSave} style={styles.btnContainer}>
                                    <Text style={styles.textButton}>
                                        {hideId == null ? 'Lưu lại' : 'Cập nhật'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: '20%', width: '10%', }}></View>
                        </View>
                    </ScrollView>
                </Modal>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Animated.FlatList
                        data={filterData}
                        renderItem={renderItem}
                        ItemSeparatorComponent={ItemSeparatorView}
                        keyExtractor={item => `key-${item.MANCC}`}
                        contentContainerStyle={{
                            padding: 20,
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: Yscroll } } }],
                            { useNativeDriver: true },
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    form: {
        height: pxWindow.height,
        padding: 15,
        marginTop: 10,
    },

    txtClose: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'right',
    },

    header_container: {
        padding: 15,
        backgroundColor: '#eeeeee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0,
    },

    txt_main: {
        fontSize: 22,
    },

    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: 'white',
        width: '100%',
        height: '100%',
        backgroundColor: 'green'
    },

    text_input: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        // marginTop: 10,
    },

    btnContainer: {
        width: '110%',
        height: '150%',
        right: '5%',
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerS: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        // height: '100%', width: '100%' 
    },

    txt_del: {
        color: 'red',
        textAlign: 'right',
    },

    txt_edit: {
        color: 'green',
        textAlign: 'right',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        padding: 10,

        // marginTop: 10,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    fontSize: {
        fontSize: 18,
    },
    image: {
        width: pxWindow.width * 0.3,
        height: imgHeight,
    },
    wrapText: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        marginBottom: marginBottomItem,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 3,
        shadowRadius: 20,
        padding: paddingItem,
    },
    container: {
        width: '100%',
        flex: 1,
    },
    txtError: {
        marginTop: '2%',
        width: '89%',
        color: 'white',

    },
    vwClear: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        // backgroundColor: 'green',
        flex: 1,
    },

    vwSearch: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        // width: 40,
        // backgroundColor: 'red'
    },
    icSearch: {
        height: 18, width: 18
    },
    searchContainer:
    {
        backgroundColor: 'white',
        width: '90%',
        height: 40,
        flexDirection: 'row',
        borderRadius: 10,

    },
    fontSize: {
        fontSize: 18,
    },
    enabled: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',

    },
    disabled: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',

    },
    txt_del: {
        color: 'red',
        textAlign: 'right',

    },

    txt_edit: {
        color: 'green',
        textAlign: 'right',
    },
});
  //npm install @rneui/themed @rneui/base
  //npm install react-native-elements/react-native-elements#base
  //npm i @expo/vector-icons
  //npm install react-native-element-dropdown --save
