import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default ChitietMH = ({ navigation, route }) => {
  const id = route.params.MAMH;
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    getMatHangTheoLoai();
  }, []);

  const getMatHangTheoLoai = () => {
    axios
      .get(
        'https://sheetdb.io/api/v1/e3l66thzdhdwt/search?MAMH=' + id,
      )
      .then(json => setDetail(json.data));
  }
  return detail.map((item, key) => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.courseContainer}>
          <View>
            <Image
              style={styles.cardImage}
              source={{ uri: item.HINHANH }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.mainHeader}>{item.TENMH}</Text>
          <Text style={styles.description}>{item.MOTA}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.price}> {item.DONGIA} </Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate("Course")}>
              <Text style={styles.buttonText}> Join Now </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "red",
    paddingHorizontal: 20,
  },
  courseContainer: {
    // height: "50%",
    // display: "flex",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    textAlign: "center",
    borderRadius: 5,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: 30,
  },

  cardImage: {
    width: "100%",
    display: "flex",
    alignSelf: "center",
    height: undefined,
    aspectRatio: 1,
  },

  mainHeader: {
    fontSize: 22,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    paddingTop: 10,
    paddingBottom: 15,
    fontFamily: "JosefinSans_500Medium",
    textAlign: "center",
  },

  subHeader: {
    fontSize: 18,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    paddingBottom: 15,
    fontFamily: "JosefinSans_500Medium",
    textAlign: "center",
  },

  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#7d7d7d",
    paddingBottom: 20,
    fontFamily: "JosefinSans_300Light",
    lineHeight: 20,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  price: {
    backgroundColor: "#344055",
    color: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 1,
    borderTopLeftRadius: 1,
    fontSize: 20,
    fontFamily: "JosefinSans_400Regular",
    textAlign: "center",
  },
  buttonStyle: {
    backgroundColor: "#809fff",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#eee",
    fontFamily: "JosefinSans_400Regular",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});