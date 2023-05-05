import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { auth, db } from '../firebase';
import { doc, getDoc, getDocs, setDoc, collection, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';

// Get Window dimensions
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();

  const user = auth.currentUser;

  const [photo, setPhoto] = useState('https://us.123rf.com/450wm/glebstock/glebstock1606/glebstock160600487/58913681-hidden-face-in-the-shadow-male-person-silhouette.jpg?ver=6');
  const [profiles, setProfiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const swipeRef = useRef(null);

  // On user pass
  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  // On user like
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    // get user profile data from the firestores database
    const userProfile = await (await getDoc(doc(db, 'users', user.uid))).data();

    // ensure generated ids will be consistent between different accounts
    const generateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

    // Check if liked profile has swiped on user
    getDoc(doc(db, 'users', userSwiped.id, 'likes', user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists() || userSwiped.match == true) {
          setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.id), userSwiped);
          // Store match details in firestore database
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: userProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp()
          })

          navigation.navigate('Match', {photo, userSwiped});
        } else {
          setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.id), userSwiped);
        }
      }
    )
  }

  // Fetch profiles
  useEffect(() => {
    let getData;

    const fetchProfiles = async () => {
      // Get passed and liked profile ids from firestore database
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );
      const likes = await getDocs(collection(db, 'users', user.uid, 'likes')).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );

      // Check if there are passed or liked users, if none then pass an empty variable
      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const likedUserIds = likes.length > 0 ? likes : ['test'];

      getData = onSnapshot(
        // query the firestore database and filter out passed and liked user ids
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...likedUserIds])
        ),
          (snapshot) => {
            setProfiles(
              // filter out user id and map all profile ids to array
              snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
        );
      });
    };

    fetchProfiles();

    return getData;
  }, [db]);

  useEffect(() => {
    onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      // if user profile exists and photoURL is not null
      if (snapshot.exists() && snapshot.data().photoURL != null) {
        // set photoURL from user profile
        setPhoto(snapshot.data().photoURL);
      }
    })
  }, []);

  const handleLogout = () => {
    auth.signOut()
    .then(() => {
      navigation.navigate('Login');
    })
    .catch(error => {
    Alert.alert(error.message);
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#281D37' }}>
      <Text
        style={{ position: 'absolute', alignSelf: 'center', top: '45%', fontSize: 20, color: '#F6D5F0' }}
      >
        No more profiles
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#38284C',
        height: 60 }}
      >
        <View>
          <TouchableOpacity
            onPress={handleLogout}
          >
            <AntDesign name='logout' size={24} color='#02fc95'/>
          </TouchableOpacity>
        </View>
        <View>
          <Image
            style={{ height: 180, width: 220, resizeMode: 'contain' }}
            source={require('../Images/logo.png')}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <AntDesign name='infocirlceo' size={24} color='#00aeff'/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ position: 'absolute' }}>
        <Swiper
          ref={swipeRef}
          cardVerticalMargin= {90}
          cardHorizontalMargin={20}
          stackSize={2}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity={true}
          stackSeparation={0}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}

          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}

          overlayLabels={{
            left: {
              title: "PASS",
              style: {
                label: {
                  textAlign: 'right',
                  marginTop: -15,
                  paddingRight: 15,
                  color: 'red',
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  textAlign: 'left',
                  marginTop: -15,
                  paddingLeft: 15,
                  color: '#4DED30',
                },
              },
            },
          }}
          cards={profiles}
          renderCard={(card) => card ? (
            <View key={card.id}
              style={{ backgroundColor: 'white', justifyContent: 'center', borderRadius: 15, borderWidth: 3, borderColor: '#F6D5F0' }}>
              <TouchableWithoutFeedback
                onPress={() => { navigation.navigate('Details', {card})}}
              >
                <Image style={{ height: '100%', width: '100%', borderRadius: 12 }} source={{ uri: card.photoURL }} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => { navigation.navigate('Details', {card})}}
              >
                <View style={styles.cardShadow}>
                  <View>
                    <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 20, color: '#FEECEF' }}>{card.displayName}</Text>
                    <Text style={{ fontFamily: 'Roboto', color: '#FEECEF' }}>{card.job}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#FEECEF' }}>
                      {card.age}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableOpacity
                onPress={() => swipeRef.current.swipeLeft()}
                style={{
                  position: 'absolute',
                  left: '10%',
                  bottom: '3%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f34a66',
                  height: windowHeight/12,
                  width: windowHeight/12,
                  borderRadius: 40 }}
              >
                <Entypo name='cross' color='#fdcbd3' size={24}/>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { navigation.navigate('Details', {card})}}
                style={{
                  position: 'absolute',
                  left: windowWidth * 0.295,
                  bottom: '3%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: windowHeight/12,
                  width: windowWidth * 0.3,
                  borderRadius: 40 }}
              >
                <Text style={{ fontSize: 15, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF' }}>DETAILS</Text>
                <MaterialIcons name='expand-more' color='#FEECEF' size={28}/>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => swipeRef.current.swipeRight()}
                style={{
                  position: 'absolute',
                  right: '10%',
                  bottom: '3%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#5bb570',
                  height: windowHeight/12,
                  width: windowHeight/12,
                  borderRadius: 40 }}
              >
                <AntDesign name='heart' color='#ace4bc' size={24}/>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
            </View>
          )}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{
            alignItems: 'center',
            paddingTop: '1%',
            height: 60,
            width: '28%'
          }}
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 40, borderWidth: 2, borderColor: '#F6D5F0', resizeMode: 'contain' }}
            source={{ uri: photo }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={{
            justifyContent: 'center',
            paddingLeft: '2%',
            borderRadius: 20,
            backgroundColor: '#642b47',
            height: 50,
            width: '22%'
          }}
        >
          <MaterialIcons name='navigate-before' color='#f04e6f' size={40}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={{
            justifyContent: 'center',
            paddingLeft: '8%',
            borderRadius: 20,
            backgroundColor: '#103e30',
            height: 50,
            width: '22%'
          }}
        >
          <MaterialIcons name='navigate-next' color='#33e986' size={40}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={{
            alignItems: 'center',
            paddingTop: '1%',
            height: 60,
            width: '28%'
          }}
        >
          <Ionicons name='chatbubbles-outline' size={40} color='#eb7a4f'/>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: (windowWidth-77)/2 }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 70.5,
            width: 70.5
          }}
        >
          <Image
            style={{ height: 55, width: 55, resizeMode: 'contain', opacity: 0.8 }}
            source={require('../Images/icon3.png')}
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              margin: '10%',
              backgroundColor: 'rgba(66, 41, 98, 0.9)',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#BE3D8D',
              paddingVertical: '15%',
              paddingHorizontal: '10%' }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, lineHeight: 30, textAlign: 'center', color: '#F6D5F0' }}>
                Welcome to MatchMaker.
                Swipe right to like a profile and swipe left to pass.
                When you have found a match, start chatting to
                discover common interests and build a relationship.
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f34a66',
                  height: 30,
                  width: 30,
                  borderRadius: 30 }}
              >
                <Entypo name='cross' color='#fdcbd3' size={16}/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    padding: 15,
    justifyContent: 'space-between',
    height: 150,
    backgroundColor: 'rgba(66,41,98, 0.3)',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height:1,
    },
    shadowOpacity: 0.2,
  },
});
