import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import PmSidenav from '../components/PmSidenav'
import { useSelector } from 'react-redux';
import { useAdminSeListMutation } from '../slices/adminApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice'
import FormContainer from '../components/FormContainer';



function PmLocationScreen() {

  const dispatch = useDispatch();
  const {userInfo} = useSelector((state)=>state.auth)
  const [seListData] =useAdminSeListMutation()
  // const seId=userInfo._id;
  // const seLocation = userInfo;
  // console.log('userrrr',userInfo.location);

  const [pse, setPse] = useState('');
  const [seList, setSeList] = useState([]);
  const [Se, setSe] = useState('');
  const [selectedSeId, setSelectedSeId] = useState('');
  const [selectedSe, setSelectedSe] = useState(null);



  const handleChangePse =async (event) => {
    // setPse(event.target.value);
    const selectedSeName = event.target.value;
    console.log('sse',selectedSeName);
    // console.log("sloc",userInfo.location);
    const selectedSe = seList.find((se) => se.name===selectedSeName)
    if (selectedSe  && selectedSe.position) {
 console.log('ss',selectedSe.position.latitude);
      setPse(selectedSeName);
      setSelectedSe(selectedSe);
      dispatch(setCredentials({ location: selectedSe.location }));
    }
    else {
      console.error('Selected Site Engineer or their position is invalid.');
      setPse('');
      dispatch(setCredentials({ location: null }));
    }
  };

  const fetchPmAndSeList = async () => {
    try {
     
      const seResponse = await seListData();

     console.log('seresponse:',seResponse);
      const seData = seResponse.data;

    //  console.log('poz',seData.name);
      setSeList(seData);
    } catch (error) {
      console.error('Error fetching  SE data', error);
    }
  };



  const loadMap = async () => {
    try {
      const [esriConfig, Map, MapView, Locate, Graphic, GraphicsLayer] = await loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Locate',
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
        
      ]);

      esriConfig.apiKey = 'AAPKa4f0ea779a9141eaa6048f2140a30e8erb4-WWmX4l0_APHlL-IyDnoTRzgqGFj6QjNlt3gpD-SZ-CAgX1yiIfotjAxscEby';
      if (selectedSe && selectedSe.position){
      const bmap = new Map({
        basemap: 'streets-vector'
      });

      const view = new MapView({
        map: bmap,
        center: [selectedSe.position.longitude, selectedSe.position.latitude],
        zoom: 12,
        container: 'viewDiv',
      });

      const graphicsLayer = new GraphicsLayer();
      bmap.add(graphicsLayer);

      
      const point = { //Create a point
        type: "point",
        longitude: selectedSe.position.longitude,
        latitude: selectedSe.position.latitude
        
     };
     console.log('sss',selectedSe.position.latitude);
     const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255], // White
            width: 1
        }
     };

     const popupTemplate = {
      title: "{Name}",
      content: "{Description}"
   }
   const attributes = {
      Name: selectedSe.name,
      Description: 'Site Engineer' 
   }


     const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate
   });
   graphicsLayer.add(pointGraphic);

      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToOverride: function(view, options) {
          options.target.scale = 1500;
          return view.goTo(options.target);
          
        }
      });
      view.ui.add(locate, "top-left");
    }
    } catch (error) {
      console.error('Error loading ArcGIS modules:', error);
    }
  };



  useEffect(() => {
    loadMap();
    fetchPmAndSeList()
   
  }, [selectedSe]);



  return (
    <Box sx={{ display: 'flex' }}>
     <PmSidenav/>
 
  <Box component="main" sx={{ flexGrow: 1, p: 3, ml: -20 }}>
       
          <FormControl sx={{ minWidth: 200, marginTop: 1 }}>
            <InputLabel id="se-label" sx={{ marginTop: -1 }}>Site Engineer</InputLabel>
            <Select labelId="se-label" id="se"
              value={pse} onChange={handleChangePse}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {seList.map((se) => (
                <MenuItem key={se.name} value={se.name}>
                  {se.name}
                  
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
         
       
  <Box id="viewDiv" sx={{ ml: 10, height: '400px', width: '800px' }}></Box>;
    </Box>
    </Box>
)
}
export default PmLocationScreen;
