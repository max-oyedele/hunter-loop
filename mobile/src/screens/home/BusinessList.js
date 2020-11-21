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
  Alert,
  BackHandler
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useIsFocused } from '@react-navigation/native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { SliderPicker } from 'react-native-slider-picker';

import { Colors, Images, Constants } from '@constants';
import BusinessItem from '../../components/BusinessItem';

import { getData } from '../../service/firebase';
import { getDistance } from 'geolib';

export default function BusinessListScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [business, setBusiness] = useState(Constants.business.filter(each => each.status === 'approved'));
  const [services, setServices] = useState(Constants.services);
  const [refresh, setRefresh] = useState(false);

  const [distanceSearch, setDistanceSearch] = useState(false);
  const [distance, setDistance] = useState(1000);

  const [categorySearch, setCategorySearch] = useState(false);
  const [categories, setCategories] = useState(Constants.categories);
  const [activeCategory, setActiveCategory] = useState();

  useEffect(() => {   
    var cates = [...categories];

    // var allHunting = {
    //   id: 0,
    //   kind: 'hunting',
    //   name: 'All hunting'
    // };
    // var allFishing = {
    //   id: 1,
    //   kind: 'fishing',
    //   name: 'All fishing'
    // };
    var all = {
      id: 1,
      kind: 'all',
      name: 'All'
    };

    // cates.unshift(allFishing);    
    // cates.unshift(allHunting);
    cates.unshift(all);
    setCategories(cates);
  }, [])

  // useEffect(()=>{
  //   const onBackPress = () => {      
  //     return true;
  //   };
  //   BackHandler.addEventListener(
  //     'hardwareBackPress', onBackPress
  //   );

  //   return () => {  
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress', onBackPress
  //     );
  //   }
  // })

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    getBusiness();
  }

  async function getBusiness(){
    await getData('business')
      .then((res) => {
        if (res) {
          setBusiness(res)
        }
      })
  }

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    getBusiness();
  }

  onBusinessItem = (item) => {
    navigation.navigate('ServiceList', { businessItem: item })
  }

  onSearch = (text) => {
    var filtered = Constants.business.filter(each => (each.name?.toLowerCase().includes(text.toLowerCase()) || each.address?.toLowerCase().includes(text.toLowerCase())) && each.status === 'approved');
    setBusiness(filtered);
    setKeyword(text);
  }

  getDistanceMile = (item) => {
    let myLocation = (Constants.location.latitude && Constants.location.latitude) ? Constants.location : Constants.user.location;
    
    if ((!myLocation?.latitude || !myLocation?.longitude) ||
      (!item.location?.latitude || !item.location?.longitude)) {
      return 0;
    }
    else {
      var distance = getDistance(myLocation, item.location);
      var distanceMile = distance / 1000 / 1.6;
      return distanceMile.toFixed(2);
    }    
  }

  onDistanceSearch = (distance) => {
    setDistance(distance);
    setKeyword('');
    setActiveCategory('');

    var filteredBusiness = Constants.business.filter(each => getDistanceMile(each) < distance && each.status === 'approved');
    setBusiness(filteredBusiness);
  }

  onCategorySearch = (category) => {
    if (category.name == 'All hunting') {
      var bids = [];
      var huntingCategories = Constants.categories.filter(e => e.kind == 'hunting');
      var huntingCategoryIds = [];
      huntingCategories.forEach(each => {
        huntingCategoryIds.push(each.id);
      })
      services.forEach(each => {
        if (huntingCategoryIds.includes(each.cid)) {
          bids.push(each.bid)
        }
      });
      var filteredBusiness = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
      setBusiness(filteredBusiness);
    }
    else if (category.name == 'All fishing') {
      var bids = [];
      var fishingCategories = Constants.categories.filter(e => e.kind == 'fishing');
      var fishingCategoryIds = [];
      fishingCategories.forEach(each => {
        fishingCategoryIds.push(each.id);
      })
      services.forEach(each => {
        if (fishingCategoryIds.includes(each.cid)) {
          bids.push(each.bid)
        }
      });
      var filteredBusiness = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
      setBusiness(filteredBusiness);
    }
    else if (category.name == 'All') {
      setBusiness(Constants.business);
    }
    else {
      var bids = [];
      services.forEach(each => {
        if (each.cid == category.id) {
          bids.push(each.bid);
        }
      });
      var filteredBusiness = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
      setBusiness(filteredBusiness);
    }

    setActiveCategory(category.name);
  }

  onRefresh = () => {
    setRefresh(!refresh)
  }

  return (
    <ImageBackground style={styles.container} source={Images.background}>
      <View style={styles.header}>
        <View style={styles.iconProfileContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <EntypoIcon name="user" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.iconMapContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('MapView')}>
            <EntypoIcon name="map" style={[styles.headerIcon, { fontSize: RFPercentage(3.2) }]}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Hunters Loop</Text>
        </View>
        <View style={styles.iconMessageContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Message')}>
            <EntypoIcon name="message" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.iconSettingContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            <EntypoIcon name="cog" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchOverlay}>
        <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            placeholder={'Search'}
            placeholderTextColor={Colors.greyWeakColor}
            value={keyword}
            onChangeText={(text) => onSearch(text)}
          >
          </TextInput>
          <TouchableOpacity onPress={() => setDistanceSearch(!distanceSearch)}>
            <EntypoIcon name="location-pin" style={[styles.searchBoxIcon, { fontSize: RFPercentage(4.2) }]}></EntypoIcon>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategorySearch(!categorySearch)}>
            <EntypoIcon name="funnel" style={styles.searchBoxIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        {
          distanceSearch &&
          <View style={styles.distanceSearchPart}>
            <SliderPicker
              minLabel={'0'}
              maxLabel={'2000'}
              maxValue={2000}
              callback={position => onDistanceSearch(position)}
              defaultValue={distance}
              labelFontColor={Colors.whiteColor}
              labelFontWeight={'200'}
              showFill={true}
              fillColor={Colors.yellowToneColor}
              labelFontSize={22}
              labelFontWeight={'bold'}
              showNumberScale={true}
              showSeparatorScale={true}
              buttonBackgroundColor={Colors.yellowToneColor}
              scaleNumberFontWeight={'200'}
              buttonDimensionsPercentage={6}
              heightPercentage={1}
              widthPercentage={80}
            />
            <Text style={{fontSize: RFPercentage(2.5), fontWeight: 'bold', color: Colors.whiteColor, position: 'absolute', alignSelf: 'center'}}>{distance} mi</Text>
          </View>
        }
        {
          categorySearch &&
          <View style={styles.categorySearchPart}>
            {
              categories.map((each, index) => {
                return (
                  <TouchableOpacity style={[styles.categorySearchBtn, each.name == activeCategory ? { borderColor: Colors.yellowToneColor } : null]} onPress={() => onCategorySearch(each)}>
                    <Text style={styles.btnTxt}>
                      {each.name}
                    </Text>
                    {/* <TouchableOpacity onPress={() => {
                      var cates = [...categories];
                      cates.splice(cates.findIndex(e => e.id == each.id), 1);
                      setCategories(cates);
                    }}>
                      <EntypoIcon name="circle-with-cross" style={styles.iconClose}></EntypoIcon>
                    </TouchableOpacity> */}
                  </TouchableOpacity>
                )
              })
            }
          </View>
        }
      </View>


      <ScrollView style={styles.scrollBody}>
        {
          business.map((each, index) => {
            if(Constants.user.bid){
              if(Constants.user.bid == each.id) return null;
            }
            return <BusinessItem key={index} item={each} onPress={onBusinessItem} onRefresh={onRefresh} />
          })
        }
        {
          business.length == 0 &&
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>No Items</Text>
          </View>
        }
      </ScrollView>
    </ImageBackground>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  header: {
    width: '100%',
    height: normalize(70, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconProfileContainer: {
    width: '12.5%',
    justifyContent: 'center',
    paddingLeft: normalize(20)
  },
  iconMapContainer: {
    width: '12.5%',
    justifyContent: 'center',
    paddingLeft: normalize(20)
  },
  titleContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconMessageContainer: {
    width: '12.5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconSettingContainer: {
    width: '12.5%',
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

  searchOverlay: {
    backgroundColor: Colors.blackColor,
    width: '100%',
    // height: normalize(60, 'height'),
    opacity: 0.6,
    justifyContent: 'center'
  },
  searchBoxContainer: {
    width: '90%',
    height: normalize(40, 'height'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.whiteColor,
    borderRadius: normalize(25),
    borderWidth: normalize(3),
    marginTop: normalize(10, 'height'),
    marginBottom: normalize(10, 'height'),
    paddingLeft: normalize(10)
  },
  inputBox: {
    width: '75%',
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
    paddingLeft: normalize(5)
  },
  searchBoxIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
    marginRight: normalize(10)
  },
  distanceSearchPart: {
    
  },
  categorySearchPart: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(7, 'height'),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingBottom: normalize(5, 'height'),
  },
  categorySearchBtn: {
    // width: normalize(80),
    // height: normalize(20, 'height'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(8),
    marginBottom: normalize(8, 'height'),
    paddingLeft: normalize(7),
    paddingRight: normalize(7),
    borderColor: '#333',
    borderWidth: 3
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.yellowToneColor,
  },
  iconClose: {
    fontSize: RFPercentage(2.2),
    color: Colors.greyWeakColor,
    marginLeft: normalize(5)
  },

  scrollBody: {
    width: '100%',
    height: '100%',
    marginTop: normalize(10, 'height'),
    marginBottom: normalize(5, 'height'),
  },

  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(230, 'height')
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.whiteColor
  },
});