import React, { useState, useEffect, useRef } from 'react';

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
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import moment from 'moment';

import { useIsFocused } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInputMask } from 'react-native-masked-text';

import { Colors, Images, Constants } from '@constants';

import { getData, setData, uploadMedia } from '../../service/firebase';

export default function RequestScreen({ navigation }) {
  const [logo, setLogo] = useState();
  const [bname, setBname] = useState();
  const [address, setAddress] = useState();
  const [location, setLocation] = useState({});
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [site, setSite] = useState();
  const [membershipId, setMembershipId] = useState();

  const [photoLocalPath, setPhotoLocalPath] = useState('');
  const [imgDownloadUrl, setImgDownloadUrl] = useState('');

  const [spinner, setSpinner] = useState(false);

  let refAddress = useRef();
  let refInput = useRef();

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    if (Constants.user?.bid) {
      var business = Constants.business.find(each => each.id == Constants.user?.bid);

      setLogo(business.img ? business.img : null);
      setBname(business.name);
      setAddress(business.address);
      setLocation(business.location);
      setPhone(business.phone);
      setEmail(business.email);
      setSite(business.site);
      setMembershipId(business.mid);
    }
  }

  useEffect(() => {
    if(address){
      refAddress.current?.setAddressText(address);    
    }
  }, [address])

  onBusinessLogo = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        setPhotoLocalPath(response.uri);
        setLogo(response.uri)
      }
    });
  };

  uploadPhoto = () => {
    return new Promise(async (resolve, reject) => {
      var platformPhotoLocalPath = Platform.OS === "android" ? photoLocalPath : photoLocalPath.replace("file://", "")
      let newPath = '';
      await ImageResizer.createResizedImage(platformPhotoLocalPath, 300, 300, 'PNG', 50, 0, null)
        .then(response => {
          newPath = response.uri;
        })
        .catch(err => {
          console.log('image resizer error', err);
        });

      await uploadMedia('business', Constants.user?.id, newPath)
        .then((downloadURL) => {
          if (!downloadURL) return;
          // console.log('downloadURL', downloadURL)

          setImgDownloadUrl(downloadURL);

          resolve();
        })
        .catch((err) => {
          console.log('upload photo error', err);
          reject(err);
        })
    })
  }

  requestBusiness = async () => {

    var nBusiness = {};
    nBusiness.id = '';
    nBusiness.name = bname;
    nBusiness.img = imgDownloadUrl;
    nBusiness.address = address;
    nBusiness.phone = phone;
    nBusiness.email = email;
    nBusiness.site = site;
    nBusiness.mid = membershipId;
    nBusiness.desc = '';
    nBusiness.operatingHours = {};
    nBusiness.location = location;
    nBusiness.rating = 0;
    nBusiness.slideImgs = [];
    nBusiness.active = true;
    nBusiness.status = 'ready';
    nBusiness.requestDate = moment().format("MM/DD/YYYY");

    let act = '';
    if (Constants.business.findIndex(each => each.id == Constants.user?.bid) == -1) act = 'add';
    else {
      act = 'update';
      nBusiness.id = Constants.user?.bid
    }

    await setData('business', act, nBusiness)
      .then((res) => {
        Alert.alert(
          'Requested Success!',
          '',
          [
            { text: "OK", onPress: () => { setSpinner(false); } }
          ]);

        if (act == 'add') {
          nBusiness.id = res.id;
          Constants.business.push(nBusiness);

          Constants.user.role = 'business';//temp, later admin has to do
          Constants.user.bid = res.id;//temp, later admin has to do

          remoteUpdateUserToBusiness();
        }
        else if (act == 'update') {
          Constants.business.splice(Constants.business.findIndex(each => each.id == nBusiness.id), 1, nBusiness);
        }

        console.log('remote add business success', Constants.business.length);
      })
      .catch((err) => {
        Alert.alert(
          'Request Error!',
          err.Error,
          [
            { text: "OK", onPress: () => setSpinner(false) }
          ]);
        console.log('remote add business error', err);
      })
  }

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  remoteUpdateUserToBusiness = async () => {
    await setData('users', 'update', Constants.user)
      .then((res) => {
        console.log('remote user updated to business, but need to be approved');
      })
      .catch((err) => {
        console.log('remote user update error');
      })
  }

  onRequest = async () => {
    if (!logo) {
      Alert.alert('Please upload logo image');
      return;
    }
    if (!bname) {
      Alert.alert('Please enter business name');
      return;
    }
    if (!address) {
      Alert.alert('Please enter address');
      return;
    }
    if (!phone) {
      Alert.alert('Please enter contact number');
      return;
    }
    if (!email) {
      Alert.alert('Please enter email');
      return;
    }
    if (!validateEmail()) {
      Alert.alert('Please enter a valid email');
      return;
    }
    // if (!site) {
    //   Alert.alert('Please enter site url');
    //   return;
    // }
    if (!membershipId) {
      Alert.alert('Please select membership');
      return;
    }    

    setSpinner(true);
    if (photoLocalPath) {
      await uploadPhoto()
        .then(() => {
          requestBusiness();
        })
        .catch((err) => {
          console.log('upload photo error', err);
          setSpinner(false);
        })
    }
    else {
      requestBusiness();
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Request a Business Account</Text>
        </View>
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps='always'>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onBusinessLogo()}>
            {
              logo &&
              <Image style={styles.logoImg} source={{ uri: logo }} />
            }
            {
              !logo &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Business Logo</Text>
              </>
            }
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Business Name'}
          placeholderTextColor={Colors.greyColor}
          value={bname}
          onChangeText={(text) => setBname(text)}
        >
        </TextInput>
        <GooglePlacesAutocomplete
          ref={refAddress}
          textInputProps={styles.inputBox}
          placeholder='Address'
          enablePoweredByContainer={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            var location = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng
            }
            setLocation(location);
            setAddress(data.description);
          }}
          query={{
            key: 'AIzaSyDdPAhHXaBBh2V5D2kQ3Vy7YYrDrT7UW3I',
            language: 'en'
          }}
        />

        <TextInputMask
          type={'custom'}
          options={{
            mask: '+1 (999) 999 - 9999'
          }}
          refInput={refInput}
          style={styles.inputBox}
          placeholder='Contact Number'
          placeholderTextColor={Colors.greyColor}
          value={phone}
          keyboardType={'numeric'}          
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Email'}
          placeholderTextColor={Colors.greyColor}
          value={email}
          onChangeText={(text) => setEmail(text)}
        >
        </TextInput>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Website'}
          placeholderTextColor={Colors.greyColor}
          value={site}
          onChangeText={(text) => setSite(text)}
        >
        </TextInput>
        <View style={[styles.inputBox, { marginBottom: normalize(100, 'height'), paddingLeft: 5 }]}>
          {
            Platform.OS === 'android' &&
            <RNPickerSelect
              items={
                Constants.memberships.map(each => ({
                  label: each.level + ' - $' + each.price,
                  value: each.id
                }))
              }
              onValueChange={(value) => {
                console.log(value)
                if(value){
                  setMembershipId(value);
                }
              }}
              value={membershipId}
            />
          }
          {
            Platform.OS === 'ios' &&
            <DropDownPicker
              items={
                Constants.memberships.map(each => ({
                  label: each.level + ' - $' + each.price,
                  value: each.id
                }))
              }
              defaultValue={membershipId}
              placeholder='Select Membership'
              placeholderStyle={{
                fontSize: RFPercentage(2.4),
                // color: 'rgba(136,100,157,1)'
              }}
              labelStyle={{
                fontSize: RFPercentage(2.4),
                color: 'rgba(50,55,55,1)'
              }}
              containerStyle={{ height: '100%' }}
              style={{ backgroundColor: 'transparent' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: 'transparent' }}
              onChangeItem={item => setMembershipId(item.value)}
            />
          }
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={() => onRequest()}>
        <Text style={styles.btnTxt}>REQUEST ACCOUNT</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  body: {
    width: '90%',
    height: '78%',
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: normalize(150, 'height'),
    backgroundColor: Colors.greyWeakColor,
    marginTop: normalize(10, 'height'),
    borderRadius: normalize(8)
  },
  logoImg: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(8)
  },
  logoBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
  },

  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
  },

  btn: {
    width: '80%',
    height: normalize(40, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(10, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});