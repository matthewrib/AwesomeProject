//icons from icons8.com

import * as React from 'react' ;
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Image, ScrollView, Modal, ActivityIndicator, FlatList } from 'react-native';

import { FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, onSnapshot, serverTimestamp, query, where, doc, updateDoc, deleteDoc, setDoc, getCountFromServer, orderBy } from 'firebase/firestore'
import Animated, { useAnimatedScrollHandler, useSharedValue, withTiming } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StopwatchTimer, { StopwatchTimerMethods} from 'react-native-animated-stopwatch-timer';
import * as Haptics from 'expo-haptics';


//icons from icons8.com

//deviceSize
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
let logInDate = '';

//screens
function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  let uid = '';

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("response: ", response);
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your emails!')
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      <Text title='title' style={[styles.header1, {marginBottom: deviceHeight/20}]}>Recollect </Text>
      <View style={styles.inputContainer} backgroundColor='#D9D9D9'>
        <TextInput title='email' style={styles.smallInput}
          value={email}
          placeholder='email'
          placeholderTextColor='rgba(0, 0, 0, 0.5)'
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer} backgroundColor='#D9D9D9'>
        <TextInput title='password' style={styles.smallInput}
          value={password}
          placeholder='password'
          placeholderTextColor='rgba(0, 0, 0, 0.5)'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      
      { loading ? ( <ActivityIndicator size='large' color="#000000"/> 
      ) : ( 
        <>
          <TouchableOpacity title='login'
          style={[styles.inputContainer, styles.signUpGreen]}
          onPress={signIn}
          activeOpacity={0.7}
          >
              <Text style={styles.paragraph1}>
                login!
              </Text>
          </TouchableOpacity> 
          <TouchableOpacity title='sigin'
          style={[styles.inputContainer, styles.signUpRed]}
          onPress={signUp}
          activeOpacity={0.7}
          >
              <Text style={styles.paragraph1}>
                sign up!
              </Text>
          </TouchableOpacity> 
        </>
      )} 
      <StatusBar style="auto" />
    </View>
  );
}
function HomeScreen({navigation}) {
  const quotes = ['"Out of difficulties grow miracles." - Jean de la Bruyere', 
  '"It is never too late to be what you might have been." - George Eliot',
  '"It is during our darkest moments that we must focus to see the light." - Aristotle Onassis',
  `"If opportunity doesn't knock, build a door." - Milton Berle`,
  '"Happiness resides not in possessions, and not in gold, happiness dwells in the soul." - Democritus',
  '"From a small seed a mighty trunk may grow." - Aeschylus',
  '"Memories of our lives, of our works and our deeds will continue in others." - Rosa Parks'
  ];
  const date = new Date();
  let dailyQuote = quotes[date.getDay()];

  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer, {width: deviceWidth/1.02}]}>
        <Text title='meditation title' style={[styles.header1, {marginRight: 40,textAlign:'left', width: deviceWidth/1.8}]}>welcome! </Text>
        <TouchableOpacity title='sign out'
        onPress={()=>FIREBASE_AUTH.signOut()}
        activeOpacity={1}>
          <Image source={require('./assets/icons/arrow.png')}
          style={{height:80, width: 80}} 
          />
        </TouchableOpacity>
      </View>
      <View style={{height: deviceHeight-deviceHeight/5}}>
        <View style={{width: deviceWidth/1.15, height: deviceHeight-deviceHeight/5}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View title='to quote'
              style={[styles.button, {backgroundColor: '#8DD08A'}]}
            >
              <Text style={styles.header3}>
                {dailyQuote} 
              </Text>
            </View> 
          </View>
          <View style={{flex: 0.6, marginBottom: deviceHeight/50, marginTop: deviceHeight/50, flexDirection: 'row'}}>
            <TouchableOpacity title='to meditation'
              style={[styles.button, {backgroundColor: '#8B99CE', marginRight: deviceHeight/50}]}
              onPress={()=>navigation.navigate("Meditation")}
              activeOpacity={0.7}
            >
              <Image source={require('./assets/icons/meditation.png')}
              />
              <Text style={styles.paragraph2}>
                meditation 
              </Text>
            </TouchableOpacity> 
            <TouchableOpacity title='to to do list'
              style={[styles.button, {backgroundColor: '#FA8181'}]}
              onPress={()=>navigation.navigate("To Do")}
              activeOpacity={0.7}
            >
              <Image source={require('./assets/icons/todolist.png')} 
              />
              <Text style={styles.paragraph2}>
                to do list 
              </Text>
            </TouchableOpacity> 
          </View>
          <View style={{flex: 0.6, flexDirection: 'row'}}>
            <TouchableOpacity title='to journal'
              style={[styles.button, {backgroundColor: '#776158', marginRight: deviceHeight/50}]}
              onPress={()=>navigation.navigate("Journal")}
              activeOpacity={0.7}
            >
              <Image source={require('./assets/icons/journal.png')} 
              />
              <Text style={styles.paragraph2}>
                journal 
              </Text>
            </TouchableOpacity> 
            <TouchableOpacity title='to habits'
              style={[styles.button, {backgroundColor: '#FFEEB1'}]}
              onPress={()=>navigation.navigate("Habits")}
              activeOpacity={0.7}
            >
              <Image source={require('./assets/icons/habits.png')} 
              />
              <Text style={styles.paragraph2}>
                habit tracker 
              </Text>
            </TouchableOpacity> 
          </View>
        </View>
      </View>
    </View>
  );
}
function MeditationScreen({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [pressed, setPressed] = useState(false);
  const [circleColor, setCircleColor] = useState('rgb(38, 33, 107)');
  const [status, setStatus] = useState("start");
  const stopwatchRef = React.useRef(null);

  const originY = useSharedValue(-5);
  const handleText1 = () => {
    if(pressed == false){
      setStatus('stop');
      setCircleColor('#6f75ad');
      originY.value = withTiming(originY.value + 20);
      setPressed(true);
    } else {
      setStatus('start');
      originY.value = withTiming(originY.value - 20);
      setCircleColor('rgb(38, 33, 107)');
      setPressed(false);
    }
  };

  return(
    <View style={[styles.container, {backgroundColor: '#8B99CE'}]}>
      <View style={[styles.rowContainer, {width: deviceWidth/1.02}]}>
        <Text title='meditation title' style={[styles.header1, {marginRight: 40,textAlign:'left', width: deviceWidth/1.8}]}>meditation </Text>
        <TouchableOpacity title='back'
        onPress={()=>navigation.navigate("Home")}
        activeOpacity={1}>
          <Image source={require('./assets/icons/arrow.png')}
          style={{height:80, width: 80}} 
          />
        </TouchableOpacity>
      </View>
      <View style={{width: deviceWidth/1.02, alignItems: 'center', height: deviceHeight-deviceHeight/5, justifyContent: 'center'}}>
        <View style={{marginBottom: 30}}>
          <Text style={[styles.header2, {height: 40, alignItems: 'center'}]}>timer:</Text>
          <TouchableOpacity
          onPress={()=>setIsModalVisible(true)}
          >
            <Text style={styles.header2}>{minutes} minutes</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.outerCircle, {marginTop: 20}]}>
          <TouchableOpacity
          onPress={() => {
            handleText1()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            if(!pressed){
              stopwatchRef.current?.play()
              setPressed(true)
            } else if (pressed) {
              stopwatchRef.current?.pause()
              stopwatchRef.current?.reset()
              setPressed(false)
            }
          }}
          >
            <View style={[styles.innerCircle, {backgroundColor: circleColor}]}>
              <Animated.Text style={[styles.header2,{color: 'white', marginBottom: originY, opacity: 1}]}>
                {status}
              </Animated.Text>
              <Animated.View>
                <StopwatchTimer
                style={{marginTop: originY, opacity: 1}}
                textCharStyle={{fontSize: 30,
                  letterSpacing: 0,
                  color: 'white',
                  fontFamily: 'Itim'
                }}
                ref={stopwatchRef}
                mode={'timer'}
                trailingZeros={0}
                initialTimeInMs={minutes * 60 * 1000}
                containerStyle={styles.stopWatchContainer}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
          <Modal visible={isModalVisible} 
          onRequestClose={() => setIsModalVisible(false)}
          animationType='fade'
          transparent={true}
          >
            <View style={styles.defaultModal}>
              <View style={{height: 400}}>
                <ScrollView
                snapToInterval={400}
                decelerationRate={0}
                showsVerticalScrollIndicator={false}
                >
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(1)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        1 minute
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(2)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        2 minutes
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(3)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        3 minutes
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(4)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        4 minutes
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(5)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        5 minutes
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    underlayColor="#FAB"
                    
                    onPress={() => {
                      setMinutes(6)
                      setIsModalVisible(false)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                  >
                    <View style={styles.scrollButtons}>
                      <Text style={[styles.header2, {color: 'white'}]}>
                        6 minutes
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}
function ToDoScreen({navigation}){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const auth = FIREBASE_AUTH;
  let userId = '';

  if (auth.currentUser !== null) {
    auth.currentUser.providerData.forEach((profile) => {
      console.log("  Provider-specific UID: " + profile.uid);
      userId = profile.uid;
    });
  }

  useEffect(() => {
    const todoRef = collection(FIREBASE_DB, 'todos');
    const q = query(todoRef, where("identification", "==", userId), where("done", "==", false), orderBy("docIndex"));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        console.log('UPDATED');
        const todos = [];
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
          console.log("current", userId);
          todos.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setTodos(todos);
      },
    });

    return () => subscriber(); 
  }, []);

  const addTodo = async () => {
    const todoRef = collection(FIREBASE_DB, 'todos');
    const snapshot = await getCountFromServer(todoRef);
    let count = snapshot.data().count;
    console.log('count: ', count);
    const doc = await addDoc(collection(FIREBASE_DB, 'todos'), { title: todo, done: false, identification: userId, createdAt: serverTimestamp(), docIndex: count});
    console.log('what', doc);
    console.log('thing', todos);
    setTodo('');
  };

  const renderTodo = ({item}) => {
    const ref = doc(FIREBASE_DB, `todos/${item.id}`);

    const finishTodo = async () => {
      updateDoc(ref, {done: !item.done}); 
    };

    return (
      <View style={styles.toDoContainer}>
        <View style={styles.toDo}>
          <Text style={styles.header3}>
            {item.title}
          </Text>
        </View>
        <View style={styles.toDoButton}>
          <TouchableOpacity
          style={{flex: 1, backgroundColor: '#D9D9D9', borderRadius: 20, elevation: deviceWidth/200}}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            finishTodo(),
            console.log('deleted'),
            console.log(ref);
          }}
          >
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return(
    <View style={[styles.container, {backgroundColor: '#FA8181'}]}>
      <View style={[styles.rowContainer, {width: deviceWidth/1.02}]}>
        <Text title='meditation title' style={[styles.header1, {marginRight: 40,textAlign:'left', width: deviceWidth/1.8}]}>to do list </Text>
        <TouchableOpacity title='back'
        onPress={()=>navigation.navigate("Home")}
        activeOpacity={1}>
          <Image source={require('./assets/icons/arrow.png')}
          style={{height:80, width: 80}} 
          />
        </TouchableOpacity>
      </View>
      <View style={{width: deviceWidth/1.15, alignItems: 'center', height: deviceHeight-deviceHeight/5, justifyContent: 'center'}}>
        <View style={{width: deviceWidth/1.15, height: 2*deviceHeight/3}}>
          <FlatList data={todos} renderItem={(item) => renderTodo(item)} keyExtractor={(todo) => todo.id} /> 
        </View>
        <TouchableOpacity 
        style={{width: deviceWidth/1.15, height: (deviceHeight-deviceHeight/5) - 2*deviceHeight/3, backgroundColor: '#F96262', elevation: deviceWidth/200, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.header2}>
            new task
          </Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} 
        onRequestClose={() => setIsModalVisible(false)}
        animationType='fade'
        transparent={true}
        >
          <View style={styles.defaultModal}>
            <View style={styles.inputContainer} backgroundColor='#D9D9D9'>
              <TextInput title='todo' style={styles.smallInput}
                value={todo}
                placeholder='task'
                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                onChangeText={(text) => setTodo(text)}
              />
              
            </View>
            <TouchableOpacity 
            style={[styles.inputContainer, {backgroundColor: '#F96262', elevation: deviceWidth/200, paddingLeft: 0}]}
            onPress={() => {addTodo(), setIsModalVisible(false)}}
            disabled={todo === ''}
            >
              <Text style={styles.header3}>
                confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
}
function JournalScreen({navigation}){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entry, setEntry] = useState('');
  const [rating, setRating] = useState('');
  const [entries, setEntries] = useState([]);
  const auth = FIREBASE_AUTH;
  let userId = '';

  if (auth.currentUser !== null) {
    auth.currentUser.providerData.forEach((profile) => {
      console.log("  Provider-specific UID: " + profile.uid);
      userId = profile.uid;
    });
  }

  useEffect(() => {
    const journalsRef = collection(FIREBASE_DB, 'Journals');
    const q = query(journalsRef, where("identification", "==", userId), orderBy("docIndex"))

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        console.log('UPDATED');
        const entries = [];
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
          console.log("current", userId);
          entries.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setEntries(entries);
      },
    });

    return () => subscriber(); 
  }, []);

  const addEntry = async () => {
    const date = new Date();
    const journalsRef = collection(FIREBASE_DB, 'Journals');
    const snapshot = await getCountFromServer(journalsRef);
    let count = snapshot.data().count;
    const doc = await addDoc(collection(FIREBASE_DB, 'Journals'), {dayRating: rating, dayEntry: entry, identification: userId, createdAt: serverTimestamp(), day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear(), docIndex: count});
    console.log('what', doc);
    setEntry('');
    setRating('')
  };

  const renderEntry = ({item}) => {
    const ref = doc(FIREBASE_DB, `Journals/${item.id}`);

    return (
      <View style={{width: deviceWidth/1.15, height: 2*deviceHeight/3, marginHorizontal: 23}}>
        <View style={{alignItems: 'center', backgroundColor: '#A8938A', flexDirection: 'column', width: deviceWidth/1.15, height: 2*deviceHeight/3 - (deviceHeight/25), marginVertical: deviceHeight/60, borderRadius: 20, elevation: deviceWidth/200}}>
          <View style={{width: (deviceWidth/1.15)/1.3,  height: (2*deviceHeight/3 - (deviceHeight/25))/7, marginVertical: 10, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: 'rgba(0, 0, 0, 0.3)'}}>
            <Text style={styles.header3}>
              {item.month}/{item.day}/{item.year} | {item.dayRating}/10 day
            </Text>
          </View>
          <View style={{width: (deviceWidth/1.15)/1.3,  height: 5.2*((2*deviceHeight/3 - (deviceHeight/25))/7), marginVertical: 10, padding: 10}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.header3, {textAlign: 'left'}]}>
                {item.dayEntry}
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  return(
    <View style={[styles.container, {backgroundColor: '#776158'}]}>
      <View style={[styles.rowContainer, {width: deviceWidth/1.02}]}>
        <Text title='meditation title' style={[styles.header1, {marginRight: 40, textAlign:'left', width: deviceWidth/1.8}]}>journaling </Text>
        <TouchableOpacity title='back'
        onPress={()=>navigation.navigate("Home")}
        activeOpacity={1}>
          <Image source={require('./assets/icons/arrow.png')}
          style={{height:80, width: 80}} 
          />
        </TouchableOpacity>
      </View>
      <View style={{width: deviceWidth/1.02, alignItems: 'center', height: deviceHeight-deviceHeight/5, justifyContent: 'center'}}>
        <FlatList
          data={entries}
          renderItem={(item) => renderEntry(item)} 
          keyExtractor={(entry) => entry.id}
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity 
        style={{width: deviceWidth/1.15, height: (deviceHeight-deviceHeight/5) - 2*deviceHeight/3, backgroundColor: '#A8938A', elevation: deviceWidth/200, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.header2}>
            new entry
          </Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} 
        onRequestClose={() => setIsModalVisible(false)}
        animationType='fade'
        transparent={true}
        >
          <View style={styles.defaultModal}>
            <View style={{width: deviceWidth/1.43, height: deviceHeight/15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{backgroundColor: 'rgba(168,147,138,0.9)', borderRadius: 20, height: deviceHeight/15, width: deviceWidth/2.5, justifyContent: 'center'}}>
                <Text style={styles.header3}>
                  rating:
                </Text>
              </View>
              <View style={{backgroundColor: 'rgba(168,147,138,0.9)', alignItems: 'center', borderRadius: 20, height: deviceHeight/15, width: deviceWidth/1.43 - deviceWidth/2.3, justifyContent: 'center', backgroundColor:'#D9D9D9'}}>
                <TextInput title='entry' style={styles.smallInput}
                  value={rating}
                  inputMode='decimal'
                  placeholder='rating'
                  placeholderTextColor='rgba(0, 0, 0, 0.5)'
                  onChangeText={(text) => setRating(text)}
                />
              </View>
            </View>
            <View style={{backgroundColor: 'rgba(168,147,138,0.9)', borderRadius: 20, height: deviceHeight/15, width: deviceWidth/1.43, marginTop: deviceHeight/70, justifyContent: 'center'}}>
              <Text style={styles.header3}>
                entry: 
              </Text>
            </View>
            <View style={{width: deviceWidth/1.43, height: deviceHeight/3, elevation: deviceWidth/200, padding: 25, borderRadius: 20, margin: deviceHeight/70}} backgroundColor='#D9D9D9'>
              <TextInput title='entry' style={styles.smallInput}
                value={entry}
                multiline={true}
                placeholder='entry'
                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                onChangeText={(text) => setEntry(text)}
              />
            </View>
            <TouchableOpacity 
            style={[styles.inputContainer, {backgroundColor: '#A8938A', elevation: deviceWidth/200, paddingLeft: 0}]}
            onPress={() => {addEntry(), setIsModalVisible(false)}}
            disabled={entry === ''}
            >
              <Text style={styles.header3}>
                confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
}
function HabitsScreen({navigation}){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [habit, setHabit] = useState('');
  const [habits, setHabits] = useState([]);
  const auth = FIREBASE_AUTH;
  let userId = '';

  if (auth.currentUser !== null) {
    auth.currentUser.providerData.forEach((profile) => {
      console.log("  Provider-specific UID: " + profile.uid);
      userId = profile.uid;
    });
  }

  useEffect(() => {
    const todoRef = collection(FIREBASE_DB, 'habits');
    const q = query(todoRef, where("identification", "==", userId), orderBy("docIndex"));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        console.log('UPDATED');
        const habits = [];
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
          console.log("current", userId);
          habits.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setHabits(habits);
      },
    });

    return () => subscriber(); 
  }, []);
  
  const addHabit = async () => {
    const todoRef = collection(FIREBASE_DB, 'habits');
    const snapshot = await getCountFromServer(todoRef);
    let count = snapshot.data().count;
    const doc = await addDoc(collection(FIREBASE_DB, 'habits'), { title: habit, done: false, timesCompleted: 0, identification: userId, createdAt: serverTimestamp(), bgColor: '#FFF6D6', docIndex: count });
    console.log('what', doc);
    setHabit('');
  };

  const renderHabit = ({item}) => {
    const ref = doc(FIREBASE_DB, `habits/${item.id}`);

    const updateHabit = async () => {
      if(item.done == false){
        updateDoc(ref, {done: !item.done, timesCompleted: 1, bgColor: '#CBB872'}); 
      } else {
        updateDoc(ref, {done: !item.done, timesCompleted: 0, bgColor: '#FFF6D6'});
      }
      console.log('time', item.createdAt);
    };

    const deleteHabit = async () => {
      deleteDoc(ref);
    }

    return (
      <TouchableOpacity
        style={[styles.habitButton, {backgroundColor: item.bgColor}]}
        activeOpacity={0.7}
        onPress={() => {
          updateHabit()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          deleteHabit()
        }}
      >
        <Text style={styles.header2}>
          {item.title}
        </Text>
        <Text style={[styles.header3, {fontSize: 20, marginTop: -5}]}>
          {item.timesCompleted} days done 
        </Text>
      </TouchableOpacity> 
    );
  };

  return(
    <View style={[styles.container, {backgroundColor: '#FFEEB1'}]}>
      <View style={[styles.rowContainer, {width: deviceWidth/1.02}]}>
        <Text title='meditation title' style={[styles.header1, {marginRight: 40, textAlign:'left', width: deviceWidth/1.7}]}>habits </Text>
        <TouchableOpacity title='back'
        onPress={()=>navigation.navigate("Home")}
        activeOpacity={1}>
          <Image source={require('./assets/icons/arrow.png')}
          style={{height:80, width: 80}} 
          />
        </TouchableOpacity>
      </View>
      <View style={{width: deviceWidth/1.15, alignItems: 'center', height: deviceHeight-deviceHeight/5, justifyContent: 'center'}}>
        <View style={{width: deviceWidth/1.15, height: 2*deviceHeight/3, alignItems: 'center'}}>
          <FlatList 
            data={habits}
            numColumns={2}
            renderItem={(item) => renderHabit(item)} 
            keyExtractor={(todo) => todo.id}
          />
        </View>
        <TouchableOpacity 
        style={{width: deviceWidth/1.15, height: (deviceHeight-deviceHeight/5) - 2*deviceHeight/3, backgroundColor: '#FFF2C2', elevation: deviceWidth/200, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.header2}>
            new habit
          </Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} 
        onRequestClose={() => setIsModalVisible(false)}
        animationType='fade'
        transparent={true}
        >
          <View style={styles.defaultModal}>
            <View style={styles.inputContainer} backgroundColor='#D9D9D9'>
              <TextInput title='habit' style={styles.smallInput}
                value={habit}
                placeholder='habit'
                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                onChangeText={(text) => setHabit(text)}
              />
              
            </View>
            <TouchableOpacity 
            style={[styles.inputContainer, {backgroundColor: '#FFF2C2', elevation: deviceWidth/200, paddingLeft: 0}]}
            onPress={() => {addHabit(), setIsModalVisible(false)}}
            disabled={habit === ''}
            >
              <Text style={styles.header3}>
                confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) =>{
      setUser(user);
      logInDate = new Date();
      console.log('user', user);
      console.log('date:', logInDate);
      console.log('date:');
    })
  }, []);

  const [fontsLoaded] = useFonts({
    'Itim': require('./assets/fonts/Itim-Regular.ttf'),
  })
  if (!fontsLoaded) {
    return null;
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        )}

        <Stack.Group>
          <Stack.Screen name="Meditation" component={MeditationScreen} options={{ headerShown: false }}/>
        </Stack.Group>

        <Stack.Screen name="To Do" component={ToDoScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Journal" component={JournalScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Habits" component={HabitsScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  //containers
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  //text
  header1: {
    width: deviceWidth/1.15,
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Itim',
  },
  header2: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Itim'
  },
  header3: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Itim'
  },
  paragraph1: {
    fontFamily: 'Itim',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  paragraph3: {
    fontSize: 12,
    fontFamily: 'Itim',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  paragraph2: {
    fontSize: 15,
    fontFamily: 'Itim',
    color: 'rgba(0, 0, 0, 0.5)',
  },

  //colors
  signUpGreen: {
    backgroundColor: '#9CB785',
  },
  signUpRed: {
    backgroundColor: '#E17B7E',
  },
  scrollButtons: {
    color: 'white', 
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    width: deviceWidth,
  },

  //inputs
  inputContainer: {
    width: deviceWidth/1.43,
    height: deviceHeight/10.27,
    elevation: deviceWidth/200,
    paddingLeft: 25,
    borderRadius: 20,
    justifyContent: 'center',
    margin: deviceHeight/102,
  },
  smallInput: {
    fontFamily: 'Itim',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    flex: 1,
    elevation: deviceWidth/200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  //circles
  outerCircle: {
    backgroundColor: '#6f75ad',
    height: 350,
    width: 350,
    borderRadius: 800,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: deviceWidth/200,
  },
  innerCircle:{
    height: 335,
    width: 335,
    borderRadius: 800,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //transparent 
  defaultModal: {
    flex: 1,
    backgroundColor: 'rgba(00, 00, 00, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //timer
  stopWatchContainer: {
    marginTop: -20,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //habits and todo
  toDoContainer: {
    flexDirection: 'row',
    width: deviceWidth/1.15, 
    height: (deviceHeight-deviceHeight/5)/9, 
    marginVertical: deviceHeight/60, 
  },
  toDo: {
    flex: 3.5, 
    paddingTop: 5,
    borderBottomWidth: 4, 
    borderBottomColor: '#F96262', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  toDoButton: {
    flex: 1, 
    justifyContent: 'center',
    marginLeft: 5,
  },
  habitContainer: {
    flexDirection: 'row',
    width: deviceWidth/1.15, 
    height: (deviceHeight-deviceHeight/5)/4, 
    marginVertical: deviceHeight/60, 
  },
  habitButton: {
    width: (deviceWidth/1.15)/2.1,
    height: (deviceHeight/5.5),
    margin: deviceHeight/200,
    elevation: deviceWidth/200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
