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
    StatusBar
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
  
  export default QLBH = function ({ navigation }) {
    //Animated
    const Yscroll = React.useRef(new Animated.Value(0)).current;
    //Data API
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    //Mat Hang 
    const [tenHd, setTenHd] = useState('');
    const [moTa, setMoTa] = useState('');
    const [hideId, setHideId] = useState(null);
    const [MaNCCData, setMaNCCData] = useState([]);
    const [ML, setML] = useState(null);
    const [tenLoai, setTenLoai] = useState(null);
    const [date, setDate] = React.useState(new Date());
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
      handleMaloai();
    }, []);
    
    //List MH
    const getList = () => {
      axios
        .get(
          'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/HoaDonBan',
        )
        .then(json => setData(json.data))
        .finally(() => setLoading(false));
  
    };
  
    const getTimKiem = () => {
      axios
        .get(
          'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/HoaDonBan',
        )
        .then(
          json2 => setFilterData(json2.data))
  
    };
  
    //Lay Ma Loai
    const handleMaloai = () => {
      axios
        .get(
          'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/NhaCungCap',
        )
        .then(response => {
          var count = Object.keys(response.data).length;
          let LoaiArray = [];
          for (var i = 0; i < count; i++) {
            LoaiArray.push({
              value: response.data[i].MANCC,
              label: response.data[i].TENNCC,
            });
          }
          setMaNCCData(LoaiArray);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    //Xoa
    const handleDelete = item => {
      axios
        .delete(
          'https://sheet.best/api/sheets/2a16d1f0-e29b-4e26-abdb-754a1be9366a/tabs/HoaDonNhap/MAHD/' +
          item.MAHD,
        )
        .then(json => {
          getList();
        });
    };
    //LUU
    const handleSave = () => {
      if (hideId == null) {
        axios
          .post('https://sheetdb.io/api/v1/e3l66thzdhdwt/?sheet=HoaDonNhap', {
            data: {
              TENHD: tenHd,
              MANCC: ML,
              NGAYLAP: date,
              TRANGTHAI: trangThai,
            },
          })
          .then(json => {
            setTenHd('');
            setML('');
            setModalVisible(false);
            getList();
          });
      } else {
        fetch(
          'https://sheet.best/api/sheets/2a16d1f0-e29b-4e26-abdb-754a1be9366a/tabs/HoaDonNhap/MAHD/' +
          hideId,
          {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              TENHD: tenHd,
              MANCC: ML,
              NGAYLAP: date
            }),
          },
        ).then(json => {
          getList();
  
          setTenHd('');
          setML('');
          setModalVisible(false);
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
      setHideId(item.MAHD);
      setTenHd(item.TENHD);
    };
  
    //Hàm Tìm Kiếm
    //Set dữ liệu cho các thành phần trong Mặt Hàng
    const onChangeName = value => {
      setTenHd(value);
    };
  
    const onChangeDate = value => {
      setDate(value);
    };
    const onChangeML = value => {
      setML(value);
    };
  
    //List Mat Hang Animated
    const renderItem = ({ item, index }) => {
      const scale = Yscroll.interpolate({
        inputRange: [-1, 0, sizeOfItem * index, sizeOfItem * (index + 2)],
        outputRange: [1, 1, 1, 0],
      });
      return (
        <TouchableOpacity onPress={() =>
          navigation.navigate("ThanhToan", {
            MAHD: item.MAHD,
          })
        }>
          <Animated.View
            style={[
              styles.item,
              {
                transform: [{ scale }],
              },
            ]}>
  
            <View style={styles.wrapText}>
              <Text style={styles.fontSize}>{index + 1}.{' '}{item.MAHD}</Text>
              <Text style={styles.fontSize}>Ngày Nhập: {item.NGAYLAP}</Text>
              <Text style={styles.fontSize}>Thành Tiền: {item.THANHTIEN}</Text>
              <Text style={item.TRANGTHAI == 1 ? styles.enabled : styles.disabled}>{item.TRANGTHAI == 1 ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</Text>
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
          const itemData = item.TENHD
            ? item.TENHD.toUpperCase()
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
            <TouchableOpacity onPress={() => { navigation.navigate('Trang Chủ') }}>
              <Text>
                <IonIcons
                  style={{ color: 'green', textAlign: 'center' }}
                  name="arrow-back"
                  size={30}
                />
              </Text>
            </TouchableOpacity>
            <Text style={styles.txt_main}>Hóa Đơn Bán Hàng</Text>
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
                placeholder="Tìm theo tên hóa đơn nhập..."
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
                <Text>Tên hóa đơn lập:</Text>
                <TextInput
                  value={tenHd}
                  style={styles.text_input}
                  placeholder="Tên Hóa Đơn"
                  autoCapitalize="none"
                  onChangeText={onChangeName}
                />
                <Text>Nhà Cung Cấp:</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={MaNCCData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Mã Loại' : '...'}
                  searchPlaceholder="Tìm theo tên loại..."
                  value={ML}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    onChangeML(item.value);
                    setTenLoai(item.label);
                    setIsFocus(false);
                  }}
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
              keyExtractor={item => `key-${item.MAHD}`}
              contentContainerStyle={{
                padding: 20,
              }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: Yscroll } } }],
                { useNativeDriver: true },
              )}
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
  