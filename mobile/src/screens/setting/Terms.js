import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images } from '@constants';

export default function TermsScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Terms and Conditions</Text>
        </View>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsTxt}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing edit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis this is more or less part
          {'\n'}{'\n'}
          Lorem ipsum dolor sit amet, consectetuer adipiscing edit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis this is more or less part
          {'\n'}{'\n'}
          Lorem ipsum dolor sit amet, consectetuer adipiscing edit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis this is more or less part
      </Text>
      </View>

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.greyWeakColor,
  },
  header: {
    width: '100%',
    height: normalize(70, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconBackContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  termsContainer: {
    width: '90%',
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    padding: normalize(10),
    borderRadius: normalize(7),
  },
  termsTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
  }

});