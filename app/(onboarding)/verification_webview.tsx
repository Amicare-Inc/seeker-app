import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';

// PATCH: ADD ID TO LINK
const PersonaVerification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.user.userData);
  const [isWebViewVisible, setWebViewVisible] = useState(true);
  const referenceId = userData?.id;
  const templateId = 'itmpl_2Ggp9nCYRzWgwnX5btG5xexxaprE';
//   const personaURL = 'https://withpersona.com/verify?is-webview=true&template-id=itmpl_2Ggp9nCYRzWgwnX5btG5xexxaprE&environment=sandbox';
  const personaBase = 'https://withpersona.com/verify?is-webview=true&environment=sandbox';
  const personaURL = `${personaBase}&template-id=${templateId}&reference-id=${referenceId}`;
  console.log('Persona URL:', personaURL);

  const handleNavigationChange = (navState: { url: string }) => {
    const { url } = navState;

    // Check if the URL indicates successful verification
    if (url.includes('https://personacallback')) {
      setWebViewVisible(false); // Close the WebView
      
      // Update Redux: Mark user as verified
      dispatch(updateUserFields({ idVerified: true }));
      
      // Navigate to the next screen
      router.push('/bio_screen');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isWebViewVisible && (
        <WebView
          source={{ uri: personaURL }}
          className="flex-1"
          useWebKit={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={handleNavigationChange}
        />
      )}
    </SafeAreaView>
  );
};

export default PersonaVerification;


// SUCCESS URL https://personacallback/?inquiry-id=inq_nJ6FR9x72V4NxSKWCQbog85NEwV3&persona-inquiry-id=inq_nJ6FR9x72V4NxSKWCQbog85NEwV3&reference-id=&subject=&status=completed&fields%5Bcurrent-government-id%5D%5Btype%5D=government_id&fields%5Bcurrent-government-id%5D%5Bvalue%5D%5Bid%5D=doc_U7ycQvEtLfmKat95gTyLyu1AJFp2&fields%5Bcurrent-government-id%5D%5Bvalue%5D%5Btype%5D=Document%3A%3AGovernmentId&fields%5Bselected-country-code%5D%5Btype%5D=string&fields%5Bselected-country-code%5D%5Bvalue%5D=US&fields%5Bselected-id-class%5D%5Btype%5D=string&fields%5Bselected-id-class%5D%5Bvalue%5D=dl&fields%5Baddress-street-1%5D%5Btype%5D=string&fields%5Baddress-street-1%5D%5Bvalue%5D=600%20CALIFORNIA%20STREET&fields%5Baddress-street-2%5D%5Btype%5D=string&fields%5Baddress-street-2%5D%5Bvalue%5D=&fields%5Baddress-city%5D%5Btype%5D=string&fields%5Baddress-city%5D%5Bvalue%5D=SAN%20FRANCISCO&fields%5Baddress-subdivision%5D%5Btype%5D=string&fields%5Baddress-subdivision%5D%5Bvalue%5D=CA&fields%5Baddress-postal-code%5D%5Btype%5D=string&fields%5Baddress-postal-code%5D%5Bvalue%5D=94109&fields%5Baddress-country-code%5D%5Btype%5D=string&fields%5Baddress-country-c

// ORIGINAL IN CASE

// import React, { useState } from 'react';
// import { WebView } from 'react-native-webview';
// import { SafeAreaView } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { updateUserFields } from '@/redux/userSlice';
// import { router } from 'expo-router';

// const PersonaVerification: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const userData = useSelector((state: RootState) => state.user.userData);
//   const [isWebViewVisible, setWebViewVisible] = useState(true);

//   const handleNavigationChange = (navState: { url: string }) => {
//     const { url } = navState;

//     // Check if the URL indicates successful verification
//     if (url.includes('https://personacallback')) {
//       setWebViewVisible(false); // Close the WebView
      
//       // Update Redux: Mark user as verified
//       dispatch(updateUserFields({ idVerified: true }));
      
//       // Navigate to the next screen
//       router.push('/bio_screen');
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {isWebViewVisible && (
//         <WebView
//           source={{ uri: 'https://withpersona.com/verify?is-webview=true&template-id=itmpl_2Ggp9nCYRzWgwnX5btG5xexxaprE&environment=sandbox' }}
//           className="flex-1"
//           useWebKit={true}
//           allowsInlineMediaPlayback={true}
//           mediaPlaybackRequiresUserAction={false}
//           originWhitelist={['*']}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//           onNavigationStateChange={handleNavigationChange}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default PersonaVerification;
