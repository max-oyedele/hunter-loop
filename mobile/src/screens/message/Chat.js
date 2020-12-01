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
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import firebase from '@react-native-firebase/app';

import {
  GiftedChat,  
  Time,
} from "react-native-gifted-chat";

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images, Constants } from '@constants';
import { checkInternet } from '../../service/firebase';

export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const user = Constants.user;
  const chatee = Constants.users.find(each => each.id == route.params.chateeId);

  const [chatRef, setChatRef] = useState();
  const [chats, setChats] = useState([])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { });

    makeChat();

    return (() => {
      backHandler.remove()
    })
  }, [])

  makeChat = async () => {
    var chatID = user.id < chatee.id ? user.id + '-' + chatee.id : chatee.id + '-' + user.id;

    const chatRef = firebase.database().ref('chat/' + chatID);
    setChatRef(chatRef);

    chatRef.on('value', snapshot => {
      const chatsObj = snapshot.val();
      let chats = [];
      for (let key in chatsObj) {
        chats.push(chatsObj[key]);        
      }
      chats.sort(function(a, b){return b.createdAt - a.createdAt});
      setChats(chats);
    });
  }

  onSendMessage = async (messages = []) => {
    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please connect to network.');
      return;
    }

    messages.forEach(message => {
      if (message.text.trim() == "") {
        return;
      }

      const chat = {        
        _id: message._id,
        text: message.text,
        user: { 
          _id: user.id,
          avatar: user.img
        },
        createdAt: new Date().getTime()
      }

      chatRef.push(chat);
    });
  }

  renderTime = (props) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Time {...props} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>{chatee.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : null} style={styles.giftedChat} keyboardVerticalOffset={30}>
        <GiftedChat
          messages={chats}
          onSend={messages => onSendMessage(messages)}
          user={{ _id: user.id }}
          isAnimated
          showAvatarForEveryMessage
          renderAvatarOnTop={true}          
          alwaysShowSend={true}
          renderLoading={() => (<ActivityIndicator size="large" color="#0000ff" />)}          
          renderTime={timeProps => renderTime(timeProps)}
        />
      </KeyboardAvoidingView>

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
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
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  giftedChat: {
    width: '100%',
    height: '86%',
    backgroundColor: Colors.whiteColor,    
  },

});