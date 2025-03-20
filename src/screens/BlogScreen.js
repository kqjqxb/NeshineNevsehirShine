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

const fontK2DRegular = 'K2D-Regular';

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
          <View style={{ marginTop: dimensions.height * 0.1 }}></View>
          <View style={{
            width: dimensions.width * 0.9,
            paddingTop: dimensions.height * 0.01,
            height: dimensions.height * 0.07,
            borderRadius: dimensions.width * 0.031,
            backgroundColor: '#39383D',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#CCA65A',
            shadowOffset: {
              width: 0,
              height: -dimensions.height * 0.0021,
            },
            shadowOpacity: 1,
            shadowRadius: dimensions.width * 0.001,
            elevation: 5,
            marginBottom: dimensions.height * 0.01,
          }}>
            <Text
              style={{
                fontFamily: fontK2DRegular,
                color: 'white',
                fontSize: dimensions.width * 0.064,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 600,
                marginBottom: dimensions.height * 0.01,
              }}>
              Blog
            </Text>
          </View>
          {blogData.map((blog, index) => (
            <View key={blog.id} style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.04,
              backgroundColor: '#39383D',
              marginTop: dimensions.height * 0.021,
              shadowColor: '#111',
              shadowOffset: {
                width: 0,
                height: dimensions.height * 0.007,
              },
              shadowOpacity: 0.88,
              shadowRadius: dimensions.width * 0.03,
              elevation: 5,
            }}>
              <Image
                source={blog?.image}
                style={{
                  width: '100%',
                  height: dimensions.height * 0.21,
                  borderTopLeftRadius: dimensions.width * 0.04,
                  borderTopRightRadius: dimensions.width * 0.04,
                }}
                resizeMode="stretch"
              />

              <View style={{
                alignItems: 'center',
                alignSelf: 'center',
                padding: dimensions.width * 0.05,
              }}>
                <Text
                  style={{
                    fontFamily: fontK2DRegular,
                    textAlign: "left",
                    fontSize: dimensions.width * 0.05,
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    color: '#CCA65A',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {blog?.title}
                </Text>

                <Text
                  style={{
                    fontFamily: fontK2DRegular,
                    textAlign: "left",
                    fontSize: dimensions.width * 0.039,
                    alignSelf: 'flex-start',
                    fontWeight: 400,
                    color: '#C6C6C6',
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
                  marginBottom: dimensions.height * 0.028,
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCulinaryBlog(blog);
                      setIsBlogOpened(true);
                    }}
                    style={{
                      alignSelf: 'center',
                      width: dimensions.width * 0.61,
                    }}
                  >
                    <LinearGradient
                      colors={['#CCA65A', '#FDFADD']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        width: dimensions.width * 0.61,
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
                          fontFamily: fontK2DRegular,
                          color: 'black',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600
                        }}>
                        Read Now
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
                      backgroundColor: '#2F2E31',
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
                    }}>
                    <Image
                      source={require('../assets/icons/whiteShareCulinaryIcon.png')}
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
        <ScrollView ref={scrollViewRef}  style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
        }} contentContainerStyle={{
          paddingBottom: dimensions.height * 0.16,
        }} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: dimensions.height * 0.1 }}></View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedCulinaryBlog(null);
                setIsBlogOpened(false);
              }}
              style={{
                width: dimensions.height * 0.07,
                marginRight: dimensions.width * 0.04,
                height: dimensions.height * 0.07,
                paddingTop: dimensions.height * 0.01,
                borderRadius: dimensions.width * 0.031,
                backgroundColor: '#39383D',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#CCA65A',
                shadowOffset: {
                  width: 0,
                  height: -dimensions.height * 0.0021,
                },
                shadowOpacity: 1,
                shadowRadius: dimensions.width * 0.001,
                elevation: 5,
                marginBottom: dimensions.height * 0.01,
              }}>
              <ChevronLeftIcon size={dimensions.width * 0.1} color='#CCA65A' />
            </TouchableOpacity>

            <View style={{
              flex: 1,
              height: dimensions.height * 0.07,
              paddingTop: dimensions.height * 0.01,
              borderRadius: dimensions.width * 0.031,
              backgroundColor: '#39383D',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#CCA65A',
              shadowOffset: {
                width: 0,
                height: -dimensions.height * 0.0021,
              },
              shadowOpacity: 1,
              shadowRadius: dimensions.width * 0.001,
              elevation: 5,
              marginBottom: dimensions.height * 0.014,
              paddingHorizontal: dimensions.width * 0.05
            }}>
              <Text
                style={{
                  fontFamily: fontK2DRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.064,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  paddingBottom: dimensions.height * 0.01
                }}>
                Reading:
              </Text>
            </View>
          </View>
          <Image
            source={selectedCulinaryBlog?.image}
            style={{
              width: dimensions.width * 0.9,
              height: dimensions.height * 0.21,
              borderRadius: dimensions.width * 0.04,
            }}
            resizeMode="stretch"
          />

          <Text
            style={{
              fontFamily: fontK2DRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.055,
              marginTop: dimensions.height * 0.021,
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
              fontFamily: fontK2DRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.043,
              marginTop: dimensions.height * 0.01,
              alignSelf: 'flex-start',
              fontWeight: 400,
              color: '#C6C6C6',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: dimensions.width * 0.8,
              marginTop: dimensions.height * 0.005

            }}
          >
            {selectedCulinaryBlog?.text}
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
                setSelectedCulinaryBlog(null);
                setIsBlogOpened(false);
              }}
              style={{
                alignSelf: 'center',
                width: dimensions.width * 0.7,
              }}
            >
              <LinearGradient
                colors={['#CCA65A', '#FDFADD']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  width: dimensions.width * 0.7,
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
                    fontFamily: fontK2DRegular,
                    color: 'black',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                  Back Home
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
                backgroundColor: '#39383D',
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
              }}>
              <Image
                source={require('../assets/icons/whiteShareCulinaryIcon.png')}
                style={{
                  width: dimensions.width * 0.055,
                  height: dimensions.width * 0.055,
                  textAlign: 'center',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView >
  );
};

export default BlogScreen;
