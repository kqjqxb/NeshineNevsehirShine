import React, { useEffect, useState, } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Dimensions, ImageBackground, SafeAreaView, Modal, Share } from 'react-native';
import neshineQuestionsData from '../components/neshineQuestionsData';
import { XMarkIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontKarlaRegular = 'Karla-Regular';

const NeshineQuizzScreen = ({ selectedNeshineScreen, isNeshineQuizStarted, setIsNeshineQuizStarted }) => {
  const [currentNeshineQuestionIndex, setCurrentNeshineQuestionIndex] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedNeshineAnswer, setSelectedNeshineAnswer] = useState(null);
  const [neshineBorderColor, setNeshineBorderColor] = useState('#FDCC06');
  const [correctNeshineAnswers, setCorrectNeshineAnswers] = useState(0);
  const [isNeshineReplyButtonActive, setIsNeshineReplyButtonActive] = useState(true);
  const [isNeshineQuizFinished, setIsNeshineQuizFinished] = useState(false);
  const [randomQuestionsData, setRandomQuestionsData] = useState([]);
  const [availableUntil, setAvailableUntil] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const isQuizAvailable = availableUntil === null;

  useEffect(() => {
    const uniqueQuestions = Array.from(
      new Map(neshineQuestionsData.map(q => [q.id, q])).values()
    );
    const shuffled = uniqueQuestions.sort(() => Math.random() - 0.5);
    setRandomQuestionsData(shuffled.slice(0, 5));
  }, [selectedNeshineScreen]);

  const shareNeshineQuizResult = async () => {
    try {
      await Share.share({
        message: `I have ${correctNeshineAnswers}/5 correct answers in the 'NeShine - Nevşehir Shine' daily quiz!`,
      });
    } catch (error) {
      console.error('Error share:', error);
    }
  };

  const saveFinishTime = async () => {
    try {
      await AsyncStorage.setItem('quizFinishTime', new Date().toISOString());
    } catch (error) {
      console.error('Error saving finish time:', error);
    }
  };

  const handleNeshineAnswerSelect = (isCorrect) => {
    setIsNeshineReplyButtonActive(false);
    if (isCorrect) {
      setCorrectNeshineAnswers((prev) => prev + 1);
      setNeshineBorderColor('#52FF2B');
    } else {
      setNeshineBorderColor('#FF382B');
    }

    setTimeout(() => {
      setIsNeshineReplyButtonActive(true);
      setSelectedNeshineAnswer(null);
      setNeshineBorderColor('#FDCC06');
      if (currentNeshineQuestionIndex < randomQuestionsData.length - 1) {
        setCurrentNeshineQuestionIndex(prev => prev + 1);
      } else {
        setIsNeshineQuizFinished(true);
        saveFinishTime();
      }
    }, 500);
  };

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const finishTimeStr = await AsyncStorage.getItem('quizFinishTime');
        if (finishTimeStr) {
          const finishTime = new Date(finishTimeStr);
          const today = new Date();

          if (
            finishTime.getDate() === today.getDate() &&
            finishTime.getMonth() === today.getMonth() &&
            finishTime.getFullYear() === today.getFullYear()
          ) {
            const nextMidnight = new Date(today);
            nextMidnight.setDate(today.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0);

            if (Date.now() < nextMidnight.getTime()) {
              setAvailableUntil(nextMidnight.getTime());
            } else {
              setAvailableUntil(null);
            }
          } else {
            setAvailableUntil(null);
          }
        } else {
          setAvailableUntil(null);
        }
      } catch (error) {
        console.error('Error checking quiz availability:', error);
      }
    };

    checkAvailability();

    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
      checkAvailability();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [isNeshineQuizFinished]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: dimensions.width,
        height: dimensions.height,
      }}>
      {!isNeshineQuizStarted && !isNeshineQuizFinished ? (
        <>
          <Image
            source={require('../assets/images/yellowQuizImage.png')}
            style={{
              width: dimensions.width * 0.23,
              height: dimensions.width * 0.23,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.16,
            }}
            resizeMode='contain'
          />
          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: 'white',
              fontSize: dimensions.width * 0.064,
              textAlign: 'center',
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              fontWeight: 500,
              marginTop: dimensions.height * 0.04,
            }}>
            Get your daily shine quiz
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: '#C9C9C9',
              fontSize: dimensions.width * 0.043,
              textAlign: 'center',
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              fontWeight: 500,
              marginTop: dimensions.height * 0.014,
            }}>
            5 questions, time limited - 60 seconds
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (isQuizAvailable) {
                setIsNeshineQuizStarted(true);
              }
            }}
            disabled={!isQuizAvailable}
            style={{
              height: dimensions.height * 0.07,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.5,
              shadowColor: '#FDCC06',
              shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
              shadowOpacity: 0.4,
              shadowRadius: dimensions.width * 0.03,
              elevation: 5,
              marginTop: dimensions.height * 0.05,
              opacity: isQuizAvailable ? 1 : 0.7,
            }}
          >
            <LinearGradient
              colors={['#FFF0B5', '#FDCC06']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                borderRadius: dimensions.width * 0.5,
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.064,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fontKarlaRegular,
                  color: 'black',
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  fontWeight: 600,
                  zIndex: 10
                }}>
                {isQuizAvailable
                  ? 'Start'
                  : `Available after: 23:59`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : isNeshineQuizStarted && !isNeshineQuizFinished ? (
        <SafeAreaView style={{
          flex: 1,
          display: 'flex',
          width: dimensions.width * 0.9,
          alignSelf: 'center',
        }}>
          <Image
            source={require('../assets/images/yellowQuizImage.png')}
            style={{
              width: dimensions.width * 0.19,
              height: dimensions.width * 0.19,
              alignSelf: 'flex-start',
              marginTop: dimensions.height * 0.025,

            }}
            resizeMode='contain'
          />
          <Text
            style={{
              fontSize: dimensions.width * 0.043,
              fontFamily: fontKarlaRegular,
              color: '#fff',
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              marginTop: dimensions.height * 0.03,
            }}
          >
            Question {currentNeshineQuestionIndex + 1}/5
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaRegular,
              fontSize: dimensions.width * 0.041,
              fontSize: dimensions.width * 0.0505,
              color: '#fff',
              textAlign: 'left',
              fontWeight: 600,
              paddingVertical: dimensions.height * 0.014,
            }}
          >
            {randomQuestionsData[currentNeshineQuestionIndex].question}
          </Text>

          {randomQuestionsData[currentNeshineQuestionIndex].answers.map((answ, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedNeshineAnswer(answ);
              }}
              disabled={!isNeshineReplyButtonActive}
              key={index} style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: dimensions.width * 0.5,
                marginTop: dimensions.height * 0.003,
                marginVertical: dimensions.height * 0.01,
                borderColor: neshineBorderColor,
                borderWidth: selectedNeshineAnswer?.neshineAnswer === answ.neshineAnswer ? dimensions.width * 0.005 : 0,
              }}>
              <LinearGradient
                colors={['#3D3D3D', '#1E1E1E']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  borderRadius: dimensions.width * 0.5,
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: dimensions.width * 0.046,
                    fontFamily: fontKarlaRegular,
                    color: 'white',
                    fontWeight: 700,
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginLeft: dimensions.width * 0.02,
                    maxWidth: dimensions.width * 0.84,
                    paddingVertical: dimensions.height * 0.02,
                  }}
                >
                  {answ.neshineAnswer}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => handleNeshineAnswerSelect(selectedNeshineAnswer?.isCorrect)}
            disabled={!isNeshineReplyButtonActive || !selectedNeshineAnswer}
            style={{
              borderRadius: dimensions.width * 0.025,
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.1,
            }}>
            <LinearGradient
              colors={['#FFF0B5', '#FDCC06']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                justifyContent: 'center',
                borderRadius: dimensions.width * 0.5,
                alignSelf: 'center',
                height: dimensions.height * 0.064,
                width: dimensions.width * 0.9,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#181818',
                  fontSize: dimensions.width * 0.05,
                  fontWeight: 700,
                  textAlign: 'center',
                  paddingHorizontal: dimensions.width * 0.05,
                  fontFamily: fontKarlaRegular,
                }}>
                Next
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <>
          <Image
            source={require('../assets/images/yellowQuizImage.png')}
            style={{
              width: dimensions.width * 0.23,
              height: dimensions.width * 0.23,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.16,
            }}
            resizeMode='contain'
          />
          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: 'white',
              fontSize: dimensions.width * 0.064,
              textAlign: 'center',
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              fontWeight: 500,
              marginTop: dimensions.height * 0.04,
            }}>
            Result
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: '#C9C9C9',
              fontSize: dimensions.width * 0.043,
              textAlign: 'center',
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              fontWeight: 500,
              marginTop: dimensions.height * 0.014,
            }}>
            Right answers: {correctNeshineAnswers}/5
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsNeshineQuizFinished(false);
              setIsNeshineQuizStarted(false);
              setIsNeshineReplyButtonActive(true);
              setCorrectNeshineAnswers(0);
              setCurrentNeshineQuestionIndex(0);
            }}
            style={{
              elevation: 5,
              justifyContent: 'center',
              alignItems: 'center',
              shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
              shadowOpacity: 0.4,
              alignSelf: 'center',
              shadowRadius: dimensions.width * 0.03,
              shadowColor: '#FDCC06',
              marginTop: dimensions.height * 0.03,
            }}
          >
            <LinearGradient
              colors={['#FFF0B5', '#FDCC06']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                borderRadius: dimensions.width * 0.5,
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.064,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  zIndex: 12,
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  fontFamily: fontKarlaRegular,
                  fontWeight: 600,
                  color: 'black',
                }}>
                Back Home
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              shareNeshineQuizResult();
            }}
            style={{
              justifyContent: 'center',
              shadowOpacity: 0.4,
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: dimensions.height * 0.01,
            }}
          >
            <LinearGradient
              colors={['#3D3D3D', '#1E1E1E']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                borderRadius: dimensions.width * 0.5,
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.064,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fontKarlaRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  fontWeight: 600,
                  zIndex: 10
                }}>
                Share results
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default NeshineQuizzScreen;
