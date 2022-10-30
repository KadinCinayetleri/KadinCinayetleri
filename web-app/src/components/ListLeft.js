import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';
import cities from '../../src/json/cities.json';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ListLeft(props) {
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState("");
  const [city, setCity] = React.useState("");
  const [date, setDate] = React.useState("");
  const [why, setWhy] = React.useState("");
  const [byWho, setByWho] = React.useState("");
  const [protection, setProtection] = React.useState("");
  const [how, setHow] = React.useState("");
  const [killerStatus, setKillerStatus] = React.useState("");
  const [source, setSource] = React.useState("");
  const [name, setName] = React.useState("");
  const handleOpen = (data) => {
    setName(data.name)
    setAge(data.age)
    setCity(data.city)
    setDate(data.date)
    setWhy(data.why[0] ? data.why[0].why : "Bilinmiyor")
    setByWho(data.byWho[0] ? data.byWho[0].byWho : "Bilinmiyor")
    setProtection(data.protection)
    setHow(data.howKilled[0] ? data.howKilled[0].howKilled : "Bilinmiyor")
    setKillerStatus(data.killerStatus[0] ? data.killerStatus[0].killerStatus:"Bilinmiyor") 
    setSource(data.source)
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const [sideData, setSideData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedCity, setSelectedCity] = React.useState(props.data);
  const [pageNumber, setPageNumber] = React.useState(1)
  const observer = React.useRef();
  const lastMurderRef = React.useCallback(node =>{
    if(isLoading || !hasMore) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setPageNumber(p => p+1)
      }
    })
    
    if(node) observer.current.observe(node)
  }, [isLoading]);

  

  React.useEffect(()=>{
    setSideData([])
    setPageNumber(1)
    setHasMore(true)
    setSelectedCity(props.data)
  },[props.data])

  React.useEffect(()=>{
    setIsLoading(true)
    if(selectedCity === ""){
      let cancel
      axios({
        method: 'GET',
        url: 'http://192.168.1.49:4000/murderall/'+pageNumber,
        cancelToken: new axios.CancelToken(c => cancel = c)
      })
      .then(function (response) {
        if(response.data.error === undefined){
          setSideData(old => old.concat(response.data))
          setIsLoading(false)
        }else{
          setHasMore(false)
          setIsLoading(false)
        }
      });
      return () => cancel()
      
    }else{
      let cancel
      axios({
        method: 'GET',
        url: 'http://192.168.1.49:4000/murderbycity/'+selectedCity+"/"+pageNumber,
        cancelToken: new axios.CancelToken(c => cancel = c)
      })
      .then(function (response) {
        if(response.data.error === undefined){
          setSideData(old => old.concat(response.data))
          setIsLoading(false)
        }else{
          setHasMore(false)
          setIsLoading(false)
        }
      });
      return () => cancel()
    }
    
  },[selectedCity, pageNumber])

  return (
    <Paper style={{height: '92vh', overflow: 'auto'}}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {sideData.map((data, index)=>{
          if(sideData.length === index + 1){
            return(
              <ListItemButton ref={lastMurderRef} onClick={()=>{handleOpen(data)}} key={index} alignItems="flex-start">
              <ListItemText
                primary={data.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {cities.find(city => city.plate === data.city).name}
                    </Typography>
                    {" - "+data.date}
                  </React.Fragment>
                }
                />
              </ListItemButton>
            )
          }else{
            return(
              <ListItemButton onClick={()=>{handleOpen(data)}} key={index} alignItems="flex-start">
              <ListItemText
                primary={data.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {cities.find(city => city.plate === data.city).name}
                    </Typography>
                    {" - "+data.date}
                  </React.Fragment>
                }
                />
              </ListItemButton>
            )
          }
          
        })}
        <CircularProgress className={isLoading ? '' : 'hideLoading'} />
      </List>
      <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
    <Fade in={open}>
      <Box sx={style}>
        <Typography color={"red"} id="spring-modal-title" variant="h6" component="h2">
          {name}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Yaşı: {age}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Şehir: {city ? cities.find(a => a.plate === city).name : ""}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Tarih: {date}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Neden Öldürüldü: {why}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Kim Tarafından Öldürüldü: {byWho}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Koruma Talebi: {protection}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Nasıl Öldülüldü: {how}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Katilin Durumu: {killerStatus}
        </Typography>
        <Button sx={{ mt: 1 }} onClick={()=>{window.open(source, '_blank');}} variant="outlined">Kaynak</Button>
      </Box>
    </Fade>
  </Modal>
    </Paper>
    
  );
}