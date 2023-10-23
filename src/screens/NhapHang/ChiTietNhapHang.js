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

export default ChiTietNhapHang = ({ navigation, route }) => {
  const id = route.params.MAHD;

  const [modalVisible, setModalVisible] = useState(false);
  //Animated
  const Yscroll = React.useRef(new Animated.Value(0)).current;
  //Data API
  const [dataTest, setDataTest] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  //Mat Hang
  const [donGia, setDonGia] = useState(0);
  const [maLoai, setMaLoai] = useState(0);
  const [hideId, setHideId] = useState(null);
  const [soluong, setSoLuong] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [maMH, setMaMH] = useState([]);
  const [tenMH, setTenMH] = useState(null);
  //Tim Kiem
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [error, setError] = useState()
  //Ban Hang
  const [products, setProducts] = useState([]);
  const [object, setObject] = useState([]);
  const [mmh, setMMH] = useState(null);
  const [range, setRange] = useState(null);

  const takeObject = () => {
    var count = products.length;
    let LoaiArray = [];
    for (var i = 0; i < count; i++) {
      LoaiArray.push({
        MAHD: products[i].MAHD,
        MAMH: products[i].MAMH,
        TENMH: products[i].TENMH,
        SOLUONG: products[i].SOLUONG,
        DONGIANHAP: products[i].DONGIANHAP,
      });
    }
    setObject(JSON.stringify(LoaiArray));
    console.log(JSON.stringify(LoaiArray));
  }
  const test = () =>{
    console.log(dataTest);
  }

  const takeRangeThanhTien = () => {
    const leng = dataTest.length;
    var range = null;
    for (var i = 0; i < leng; i++)
    {
      if(dataTest[i].MAHD == id)
      {
        range = `HoaDonNhap!E${i+2}:E`;
      }
    }
    setRange(range);
    console.log('Range: ', range);
  }

  const takeRangeTrangThai = () => {
    const leng = dataTest.length;
    var range = null;
    for (var i = 0; i < leng; i++)
    {
      if(dataTest[i].MAHD == id)
      {
        range = `HoaDonNhap!F${i+2}:F`;
      }
    }
    setRange(range);
    console.log('Range: ', range);
  }

  const MappingApiToApiObj = (api) => {
    var data = [];
    var item={};
    var myValue, i;
    const leng=Object.entries(api.data.values).length-1;
    const myArray=Object.entries(api.data.values)[0][1];
    for(a = 1; a <= leng; a++){
      item={};
      myValue=Object.entries(api.data.values)[a][1];
      i = 0;
      for(var value in myArray){
        item[myArray[value]] = myValue[i]; i++;
      }
      data.push(item);
    };
    return data;
  }

  const handleVisibleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    getList();
    getListSheetAPI();
    getTimKiem();
    handleMaHD();
  }, []);
  const getListSheetAPI = () => {
    axios
      .get(
        'https://sheets.googleapis.com/v4/spreadsheets/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/values/HoaDonNhap!A1:A?key=AIzaSyD31HjiLj3xR2RRxPMHRsBVoR9NEyasSBw',
      )
      .then(data => setDataTest(MappingApiToApiObj(data)))

  };
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
      .post('https://sheetdb.io/api/v1/e3l66thzdhdwt/?sheet=ChiTietHoaDonNhap', {
        data: object

      }).catch(function (error) {
        console.log(error);
      });
  }
  const updateThanhTien = () => {
    const fx = {
      data: {
        values: [[totalPrice]],
      },
    };
    axios
    .put(
      `https://sheets.googleapis.com/v4/spreadsheets/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/values/${range}?key=AIzaSyD31HjiLj3xR2RRxPMHRsBVoR9NEyasSBw`, 
      fx.data
    )
    .then(response => {
      console.log('response', response);
    })
  }

  const updateTrangThai = () => {
    const fx = {
      data: {
        values: [[1]],
      },
    };
    axios
    .put(
      `https://sheets.googleapis.com/v4/spreadsheets/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/values/${range}?key=AIzaSyD31HjiLj3xR2RRxPMHRsBVoR9NEyasSBw`, 
      fx.data
    )
    .then(response => {
      console.log('response', response);
    })
  }


  const handleMaHD = () => {
    axios
      .get(
        'https://opensheet.elk.sh/1CU0JOnN3HZfViWBoOCqurpp537vJ90Gt_MPd9fm-lxg/MatHang',
      )
      .then(response => {
        var count = Object.keys(response.data).length;
        let LoaiArray = [];
        for (var i = 0; i < count; i++) {
          LoaiArray.push({
            value: response.data[i].MAMH,
            label: response.data[i].TENMH,
          });
        }
        setMaMH(LoaiArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const Reset = () => {
    setMMH(null);
    setDonGia(null);
    setSoLuong(null);
  }

  const onChangeID = value => {
    setHideId(value);
  };

  const onChangePrice = value => {
    setDonGia(value);
  };

  const onChangeSoLuong = value => {
    setSoLuong(value);
  };

  const onChangeMMH = value => {
    setMMH(value);
  };
  const onChangeTenMH = value => {
    setTenMH(value);
  };

  const ItemDisplay = () => {
    return (
      products.map((products, index) => (
        <View style={styles.product} key={products.MAMH}>
          <View style={styles.mainRight}>
            <Text style={styles.txtName}>{products.TENMH}</Text>
            <View>
              <Text style={styles.txtPrice}>SL: {products.SOLUONG}</Text>
            </View>
            <View>
              <Text style={styles.txtPrice}>Giá: {products.DONGIANHAP}Đ</Text>
            </View>
            <TouchableOpacity onPress={() => {
              handleDelete(products.MAMH)
              calculateTotal()
            }}>
              <Text style={{ fontFamily: 'Avenir', color: 'red' }}>X</Text>
            </TouchableOpacity>
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

  const calculateTotal = () => {
    const totalItemCount = [...products].reduce((total, item) => {
      return total + item.SOLUONG;
    }, 0);
    const totalPrice = [...products].reduce((total, item) => {
      return total + (item.DONGIANHAP * item.SOLUONG);
    }, 0);
    setTotalItemCount(totalItemCount)
    setTotalPrice(totalPrice);
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
        <TouchableOpacity onPress={() => { navigation.navigate('Trang Chủ') }}>
          <Text>
            <IonIcons
              style={{ color: 'green', textAlign: 'center' }}
              name="arrow-back"
              size={30}
            />
          </Text>
        </TouchableOpacity>
        <Text style={styles.txt_main}>Hóa Đơn Nhập{id}</Text>
        <TouchableOpacity onPress={() => {takeRangeThanhTien()}}>
          <Text>
            <IonIcons
              style={{ color: 'green', textAlign: 'center' }}
              name="add-box"
              size={30}
            />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.add}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={maMH}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Chọn hóa mặt hàng' : '...'}
          searchPlaceholder="Tìm Mặt Hàng..."
          value={mmh}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setMMH(item.value);
            setTenMH(item.label);
            setIsFocus(false);
          }}
        />
        <View style={styles.input_Container}>
          <View style={{ width: 125, height: 80, justifyContent: 'center' }} >
            <TextInput
              value={soluong}
              style={styles.text_input}
              placeholder="Số Lượng"
              autoCapitalize="none"
              onChangeText={onChangeSoLuong}
            />
          </View>
          <View style={{ width: 223, height: 80, justifyContent: 'center', marginLeft: -20 }} >
            <TextInput
              value={donGia}
              style={styles.text_input}
              placeholder="Đơn Giá Nhập"
              autoCapitalize="none"
              onChangeText={onChangePrice}
            />
          </View>
          <View style={{ width: 80, height: 77, justifyContent: 'center', marginLeft: -15 }}>
            <TouchableOpacity onPress={() => {
              if (mmh== null) {
                Alert.alert('Thông báo','Vui lòng chọn mã mặt hàng');
                return;
              }
              if (soluong == 0) {
                Alert.alert('Thông báo','Vui lòng nhập số lượng');
                return;
              }
              if (donGia == 0) {
                Alert.alert('Thông báo','Vui lòng nhập đơn giá');
                return;
              }
              products.push({
                MAHD: id,
                MAMH: mmh,
                TENMH: tenMH,
                DONGIANHAP: donGia,
                SOLUONG: soluong,
              })
              calculateTotal(),
                takeObject(),
                takeRangeThanhTien(),
                Reset()
            }}>
              <Text>
                <IonIcons
                  style={{ color: 'green', textAlign: 'center' }}
                  name="add-box"
                  size={60}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        {ItemDisplay()}
      </ScrollView>
      <View style={styles.totalParent}>
        <View style={styles.total}>
          <Text style={{ fontSize: 20, }}>Tổng Tiền Nhập</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, }}>{totalPrice}Đ</Text>
        </View>
        <TouchableOpacity
          onPress={() => {handleSave()
            //updateThanhTien()
          }}>
          <View style={styles.checkoutBtn}>
            <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>
              Hoàn Thành
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
  add: {
    padding: 5,
    backgroundColor: '#eeeeee',
    justifyContent: 'space-between',
  },
  input_Container: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtPrice: {
    color: '#C21C70',
    fontSize: 17,
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
    paddingLeft: 5,
    color: '#A7A7A7',
    fontSize: 17,
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
    fontSize: 18,
  },
  innerText: {
    display: 'flex',
    width: 130,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dropdown: {
    padding: 10,
    margin: 15,
    marginBottom: -5,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
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
  text_input: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
  },
})
