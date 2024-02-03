import React, { useEffect} from 'react';
import { loadModules } from 'esri-loader';
import { Box } from '@mui/material';
import SeSidenav from '../components/SeSidenav';
import { useSeLocationMutation } from '../slices/userApiSlice';
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice';



function SeLocationScreen() {

  const[seLocation] = useSeLocationMutation()
  const {userInfo} = useSelector((state)=>state.auth)
  const seId = userInfo._id;
  const dispatch =useDispatch();

  
 console.log("SeId::",userInfo.location);
  const loadMap = async () => {
   
        try {
            
          const [esriConfig, Map, MapView, Locate,Track, Graphic] = await loadModules(['esri/config', 'esri/Map', 'esri/views/MapView', 'esri/widgets/Locate', "esri/widgets/Track",
          "esri/Graphic"]);

          esriConfig.apiKey = 'AAPKa4f0ea779a9141eaa6048f2140a30e8erb4-WWmX4l0_APHlL-IyDnoTRzgqGFj6QjNlt3gpD-SZ-CAgX1yiIfotjAxscEby'; 

          const bmap = new Map({
            basemap: 'streets-vector' 
          });

          const view = new MapView({
            map: bmap,
            center: [76.936638, 8.524139], 
            zoom: 12, 
            container: 'viewDiv' 
          });

          const locate = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
              options.target.scale = 1500;
              return view.goTo(options.target);
              
            }
          });
          locate.on('locate', async (event) => {
            const { position } = event;
            const {longitude, latitude } = position.coords;
            dispatch(setCredentials({location: {longitude, latitude}}))
            await seLocation({longitude,latitude, seId})
            
            // console.log('Latitude:', latitude);
            // console.log('Longitude:', longitude);
          });



          view.ui.add(locate, "top-left");

        //   const track = new Track({
        //     view: view,
        //     graphic: new Graphic({
        //       symbol: {
        //         type: "simple-marker",
        //         size: "12px",
        //         color: "green",
        //         outline: {
        //           color: "#efefef",
        //           width: "1.5px"
        //         }
        //       }
        //     }),
        //     useHeadingEnabled: false
        //   });
        //   view.ui.add(track, "top-left");

        } catch (error) {
          console.error('Error loading ArcGIS modules:', error);
        }

        
      };

  useEffect(() => {
      loadMap(); 
      
  }, [dispatch]);

  return (
    
    <>
  <SeSidenav/>
  <Box id="viewDiv" sx={{ ml: 30,height: '400px', width: '800px' }}></Box>
  
  </>)
}

export default SeLocationScreen
