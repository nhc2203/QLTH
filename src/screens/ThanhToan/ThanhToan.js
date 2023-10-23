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
  Dimensions,
} from 'react-native';
import Global from '../../api/Global';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import IonIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import Dialog from "react-native-dialog";
const marginBottomItem = 20;
const paddingItem = 10;
const imgHeight = 100;
const sizeOfItem = imgHeight + paddingItem * 2 + marginBottomItem;
const pxWindow = Dimensions.get('window');
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const imageWidth = width / 4;
const imageHeight = (imageWidth * 452) / 361;
let nextid = 1;
const ThanhToan = ({ navigation, route }) => {
  const id = route.params.MAHD;

  const [modalVisible, setModalVisible] = useState(false);//Modal
  const [visible, setVisible] = useState(false);//Dialog
  //Animated
  const Yscroll = React.useRef(new Animated.Value(0)).current;
  //Data API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  //Mat Hang
  const [donGia, setDonGia] = useState(0);
  const [maLoai, setMaLoai] = useState(0);
  const [hideId, setHideId] = useState(null);
  const [soluong, setSoLuong] = useState(1);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [maHD, setMaHD] = useState([]);
  //Tim Kiem
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [error, setError] = useState()
  //Ban Hang
  const [products, setProducts] = useState([]);
  const [object, setObject] = useState([]);
  const [mhd, setMHD] = useState(null);

  const takeObject = () => {
    var count = products.length;
    let LoaiArray = [];
    for (var i = 0; i < count; i++) {
      LoaiArray.push({
        MAHD: products[i].MAHD,
        MAMH: products[i].MAMH,
        SOLUONG: products[i].SOLUONG,
        DONGIA: products[i].DONGIA,
      });
    }
    setObject(JSON.stringify(LoaiArray));
    console.log(JSON.stringify(LoaiArray));
  }
  const handleVisibleModal = () => {
    setModalVisible(!modalVisible);
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    getList();
    getTimKiem();
    handleMaHD();
  }, []);
  //List MH
  const getList = () => {
    axios
      .get(
        'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/MatHang',
      )
      .then(json => setData(json.data))
      .finally(() => setLoading(false));

  };

  const getTimKiem = () => {
    axios
      .get(
        'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/MatHang',
      )
      .then(
        json2 => setFilterData(json2.data))
      .finally(() => setLoading(false));

  };
  const handleSave = () => {
    axios
      .post('https://sheetdb.io/api/v1/e3l66thzdhdwt/?sheet=ChiTietHoaDonBan', {
        data: object

      }).catch(function (error) {
        console.log(error);
      });
  }
  const handleMaHD = () => {
    axios
      .get(
        'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/HoaDonBan',
      )
      .then(response => {
        var count = Object.keys(response.data).length;
        let LoaiArray = [];
        for (var i = 0; i < count; i++) {
          LoaiArray.push({
            value: response.data[i].MAHD,
            label: response.data[i].MAHD,
          });
        }
        setMaHD(LoaiArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const onChangeID = value => {
    setHideId(value);
  };

  const onChangePrice = value => {
    setDonGia(value);
  };

  const onChangeSoLuong = value => {
    setSoLuong(value);
  };

  const onChangeMHD = value => {
    setMHD(value);
  };

  const renderItem = ({ item, index }) => {
    const scale = Yscroll.interpolate({
      inputRange: [-1, 0, sizeOfItem * index, sizeOfItem * (index + 2)],
      outputRange: [1, 1, 1, 0],
    });
    return (
      <Animated.View
        style={[
          styles.item,
          {
            transform: [{ scale }],
          },
        ]}>
        <Image
          style={styles.image}
          source={{ uri: item.HINHANH }}
          resizeMode="contain"
          contentContainerStyle={{ padding: 20 }}
        />
        <View style={styles.wrapText}>
          <Text style={styles.fontSize}>{item.TENMH}</Text>
          <Text style={styles.fontSize}>{item.DONGIA}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => {
            products.push({
              MAHD: id,
              MAMH: item.MAMH,
              TENMH: item.TENMH,
              DONGIA: item.DONGIA,
              HINHANH: item.HINHANH,
              SOLUONG: soluong,
            })
            calculateTotal(),
              takeObject()
          }}>
            <Text>Thêm</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={showDialog}>
            <Text>Thêm</Text>
            <View style={styles.container_Dialog}>
              <Dialog.Container visible={visible}>
                <Dialog.Title>Thêm Số Lượng</Dialog.Title>
                <Dialog.Input
                  placeholder="Số Lượng"
                  value={soluong}
                  autoCapitalize="none"
                  onChangeText={onChangeSoLuong}>
                </Dialog.Input>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Ok" onPress={() => {
                  products.push({
                    MAHD: id,
                    MAMH: item.MAMH,
                    TENMH: item.TENMH,
                    DONGIA: item.DONGIA,
                    HINHANH: item.HINHANH,
                    SOLUONG: soluong,
                  })
                  calculateTotal(),
                    takeObject(),
                    handleCancel()
                }} />
              </Dialog.Container>
            </View>
          </TouchableOpacity> */}
        </View>

      </Animated.View>
    );
  };

  const ItemDisplay = () => {
    return (
      products.map((products, index) => (
        <View style={styles.product} key={products.MAMH}>
          <Image source={{ uri: products.HINHANH }} style={styles.productImage} />
          <View style={styles.mainRight}>
            <Text style={styles.txtName}>{products.TENMH}</Text>
            <TouchableOpacity onPress={() => handleDelete(products.MAMH)}>
              <Text style={{ fontFamily: 'Avenir', color: '#969696' }}>X</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.txtPrice}>{products.DONGIA}Đ</Text>
          </View>
          <View style={styles.productController}>
            <View style={styles.numberOfProduct}>
              <TouchableOpacity onPress={() => increaseQuantity(index)}>
                <Text>+</Text>
              </TouchableOpacity>
              <Text>{products.SOLUONG}</Text>
              <TouchableOpacity onPress={() => decreaseQuantity(index)}>
                <Text>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))
    )
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
        const itemData = item.TENMH
          ? item.TENMH.toUpperCase()
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

  const increaseQuantity = (sol) => {
    const newItems = [...products];

    newItems[sol].SOLUONG++;

    setProducts(newItems);
    calculateTotal();
  }

  const decreaseQuantity = (sol) => {
    const newItems = [...products];

    newItems[sol].SOLUONG--;

    setProducts(newItems);
    calculateTotal();
  }

  const calculateTotal = () => {
    const totalItemCount = [...products].reduce((total, item) => {
      return total + item.SOLUONG;
    }, 0);
    const totalPrice = [...products].reduce((total, item) => {
      return total + (item.DONGIA * item.SOLUONG);
    }, 0);
    setTotalItemCount(totalItemCount);
    setTotalPrice(totalPrice);
    console.log(totalPrice);
  };

  const handleDelete = (itemId) => {
    const items = [...products].filter(item => item.MAMH != itemId)
    setProducts(items);
    console.log(items);
    calculateTotal();
  };
  return (
    <View style={{ height: pxWindow.height * 0.18, borderColor: 'red', borderWidth: 0, flex: 1, backgroundColor: '#DFDFDF', }}>
      <View style={styles.header_container}>
        <TouchableOpacity onPress={() => { navigation.navigate('HoaDonBan') }}>
          <Text>
            <IonIcons
              style={{ color: 'green', textAlign: 'center' }}
              name="arrow-back"
              size={30}
            />
          </Text>
        </TouchableOpacity>
        <Text style={styles.txt_main}>Hóa Đơn Bán {id}</Text>
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

      <View style={{ borderColor: 'blue', borderWidth: 0 }}>
        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.header_container}>
            <TouchableOpacity onPress={handleVisibleModal}>
              <Text>
                <IonIcons
                  style={{ color: 'green', textAlign: 'center' }}
                  name="arrow-back"
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
                placeholder="Tìm theo tên mặt hàng..."
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
          <Animated.FlatList
            data={filterData}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparatorView}
            keyExtractor={item => `key-${item.MAMH}`}
            contentContainerStyle={{
              padding: 20,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: Yscroll } } }],
              { useNativeDriver: true },
            )}
          />
        </Modal>
      </View>

      <ScrollView>
        {ItemDisplay()}
      </ScrollView>
      <View style={styles.totalParent}>
        <View style={styles.total}>
          <Text style={styles.textHeading}>Tổng Số Lượng: </Text>
          <Text style={{ fontWeight: 'bold' }}>{totalItemCount}</Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.textHeading}>Giá Bán: </Text>

          <Text style={{ fontWeight: 'bold' }}>{totalPrice}Đ</Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.textHeading}>Tổng Giá Bán: </Text>
          <Text style={{ fontWeight: 'bold' }}>{totalPrice}Đ</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleSave()}>
          <View style={styles.checkoutBtn}>
            <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>
              Checkout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  header_container: {
    padding: 15,
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt_main: {
    fontSize: 22,
  },
  vwClear: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
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
  containerS: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    // height: '100%', width: '100%' 
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
  product: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: '#3B5458',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 2,
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    flex: 1,
    resizeMode: 'center'
  },
  mainRight: {
    flex: 1,
    justifyContent: 'space-between',
  },
  txtPrice: {
    paddingLeft: 20,
    color: '#C21C70',
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Avenir'
  },
  productController: {
    flex: 1,
    flexDirection: 'row'
  },
  numberOfProduct: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  txtName: {
    paddingLeft: 20,
    color: '#A7A7A7',
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Avenir'
  },
  totalParent: {
    padding: 10,
    marginTop: 10,

    backgroundColor: 'white'
  },
  checkoutBtn: {
    backgroundColor: '#40AA54',
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 5,
    width: '100%',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  innerText: {
    display: 'flex',
    width: 130,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
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
  dropDownContainer: {
    flexDirection: 'row',
  },
  container_Dialog: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
export default ThanhToan
