import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import blogData from '../components/blogData';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const fontKarlaRegular = 'Karla-Regular';
const fontKarlaLight = 'Karla-Light';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const BlogScreen = ({ }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isBlogOpened, setIsBlogOpened] = useState(false);
  const [selectedCulinaryBlog, setSelectedCulinaryBlog] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [isBlogOpened]);

  const shareCulinaryBlog = async (title) => {
    try {
      await Share.share({
        message: `Read about ${title} on the Culinary Crovvn - Melbourn!`,
      });
    } catch (error) {
      console.error('Error share:', error);
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: dimensions.width * 0.05,
      width: dimensions.width,
    }}>
      {!isBlogOpened ? (
        <ScrollView ref={scrollViewRef} style={{
          width: dimensions.width,
          alignSelf: 'center',
        }} contentContainerStyle={{
          paddingBottom: dimensions.height * 0.16,
        }} showsVerticalScrollIndicator={false}>
          {blogData.map((blog, index) => (
            <View key={blog.id} style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.04,
              backgroundColor: '#181818',
              marginTop: dimensions.height * 0.021,
              shadowColor: '#111',
              shadowOffset: {
                width: 0,
                height: dimensions.height * 0.007,
              },
              shadowOpacity: 0.88,
              shadowRadius: dimensions.width * 0.03,
              elevation: 5,
              borderColor: 'white',
              borderWidth: dimensions.width * 0.003,
            }}>

              <View style={{
                alignItems: 'center',
                alignSelf: 'center',
                padding: dimensions.width * 0.05,
              }}>
                <Text
                  style={{
                    fontSize: dimensions.width * 0.052,
                    textAlign: "left",
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    color: 'white',
                    alignItems: 'center',
                    fontFamily: fontKarlaRegular,
                  }}
                >
                  {blog?.title}
                </Text>

                <Text
                  style={{
                    fontFamily: fontKarlaExtraLight,
                    textAlign: "left",
                    fontSize: dimensions.width * 0.048,
                    alignSelf: 'flex-start',
                    color: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: dimensions.width * 0.8,
                    marginTop: dimensions.height * 0.005

                  }}
                >
                  {blog?.time}
                </Text>

                <View style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.025,
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCulinaryBlog(blog);
                      setIsBlogOpened(true);
                    }}
                    style={{
                      alignSelf: 'center',
                    }}
                  >
                    <LinearGradient
                      colors={['#FFF0B5', '#FDCC06']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        width: dimensions.width * 0.43,
                        height: dimensions.height * 0.066,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.037,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontKarlaRegular,
                          color: 'black',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600
                        }}>
                        Read
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => {
                      shareCulinaryBlog(blog?.title)
                    }}
                    style={{
                      padding: dimensions.width * 0.04,
                      width: dimensions.width * 0.14,
                      height: dimensions.width * 0.14,
                      backgroundColor: 'transparent',
                      borderRadius: dimensions.width * 0.035,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#111',
                      shadowOffset: {
                        width: 0,
                        height: dimensions.height * 0.004,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: dimensions.width * 0.0005,
                      elevation: 5,
                      borderColor: 'white',
                      borderWidth: dimensions.width * 0.003,
                    }}>
                    <Image
                      source={require('../assets/icons/whiteShareNeshineIcon.png')}
                      style={{
                        width: dimensions.width * 0.055,
                        height: dimensions.width * 0.055,
                        textAlign: 'center',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView ref={scrollViewRef} style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
        }} contentContainerStyle={{
          paddingBottom: dimensions.height * 0.16,
        }} showsVerticalScrollIndicator={false}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginVertical: dimensions.height * 0.03
          }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedCulinaryBlog(null);
                setIsBlogOpened(false);
              }}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <ChevronLeftIcon size={dimensions.height * 0.025} color='#FDCC06' />
              <Text
                style={{
                  fontFamily: fontKarlaLight,
                  textAlign: "left",
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'flex-start',
                  color: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Blog /
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fontKarlaLight,
                textAlign: "left",
                fontSize: dimensions.width * 0.043,
                alignSelf: 'flex-start',
                color: '#FDCC06',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {' '}Reading
            </Text>

          </View>

          <Text
            style={{
              fontFamily: fontKarlaRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.055,
              alignSelf: 'flex-start',
              fontWeight: 600,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedCulinaryBlog?.title}
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaLight,
              textAlign: "left",
              fontSize: dimensions.width * 0.04,
              alignSelf: 'flex-start',
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: dimensions.width * 0.8,
              marginVertical: dimensions.height * 0.019
            }}
          >
            {selectedCulinaryBlog?.time}
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.043,
              marginTop: dimensions.height * 0.01,
              alignSelf: 'flex-start',
              fontWeight: 400,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: dimensions.width * 0.8,
              marginTop: dimensions.height * 0.005

            }}
          >
            {selectedCulinaryBlog?.text}
          </Text>

          <Text
            style={{
              fontFamily: fontKarlaLight,
              textAlign: "left",
              fontSize: dimensions.width * 0.04,
              alignSelf: 'flex-start',
              color: '#FDCC06',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: dimensions.height * 0.023
            }}
          >
            {selectedCulinaryBlog?.mustVisit}
          </Text>

          <TouchableOpacity
            onPress={() => {
              shareCulinaryBlog(blog?.title)
            }}
            style={{
              padding: dimensions.width * 0.04,
              width: dimensions.width * 0.14,
              height: dimensions.width * 0.14,
              backgroundColor: 'transparent',
              borderRadius: dimensions.width * 0.035,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#111',
              shadowOffset: {
                width: 0,
                height: dimensions.height * 0.004,
              },
              shadowOpacity: 0.3,
              shadowRadius: dimensions.width * 0.0005,
              elevation: 5,
              alignSelf: 'flex-start',
              borderColor: 'white',
              borderWidth: dimensions.width * 0.003,

            }}>
            <Image
              source={require('../assets/icons/whiteShareNeshineIcon.png')}
              style={{
                width: dimensions.width * 0.055,
                height: dimensions.width * 0.055,
                textAlign: 'center',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView >
  );
};

export default BlogScreen;
