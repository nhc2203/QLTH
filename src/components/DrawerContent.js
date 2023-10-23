import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItemList, DrawerItem
} from '@react-navigation/drawer';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

export function CustomDrawer(props) {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#8200d6' }}>
                <ImageBackground source={{uri: 'https://images.pexels.com/photos/220072/pexels-photo-220072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}} style={{padding:20}}>
                    <Image source={{uri: 'https://www.nicepng.com/png/detail/202-2024687_profile-icon-for-the-politics-category-profile-icon.png'}}
                        style={{height: 80, width: 80}}/>
                    <Text style={{color: '#fff', fontSize: 18, fontFamily:'Roboto_Medium'}}>Nguyễn Hùng Cường</Text>
                </ImageBackground>
                <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
                    <DrawerItemList  {...props} />
                </View>
            </DrawerContentScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});