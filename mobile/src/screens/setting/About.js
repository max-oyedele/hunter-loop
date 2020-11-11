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

export default function AboutScreen({ navigation }) {
  
  function onContact(){
    navigation.navigate('Contact');
  }
  
  return (
    <ImageBackground style={styles.container} source={Images.authBack}>
      <View style={styles.backIconRow}>
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <EntypoIcon name="chevron-thin-left" style={styles.backIcon}></EntypoIcon>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTxt}>About the App</Text>
      </View>
      <View style={styles.body}>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tip}>
            Version 1.00
            {'\n'}
            Copyright 2020 - Hunter.com
            {'\n'}
            James Stroleny Inc.
          </Text>
        </View>

        <View style={styles.descContainer}>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing edit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis this is more or less part
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => onContact()}>
          <Text style={styles.btnTxt}>CONTACT US</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  backIconRow: {
    width: '9%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: normalize(50, 'height'),
    zIndex: 10,
    // marginTop: normalize(50, 'height'),        
  },
  backIcon: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
  },
  label: {
    width: '100%',
    height: '43%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelTxt: {
    fontSize: RFPercentage(3),
    color: Colors.whiteColor
  },
  body: {
    flex: 1,
    width: '80%',        
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(20, 'height'),    
  },
  
  tipContainer: {
    width: '80%',
    marginTop: normalize(20, 'height'),    
  },
  tip: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
    textAlign: 'center'
  },
  descContainer: {
    width: '100%',
    height: normalize(150, 'height'),
    marginTop: normalize(20, 'height'),
  },
  desc:{
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,    
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,    
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(50, 'height'),
    borderRadius: normalize(8),
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});