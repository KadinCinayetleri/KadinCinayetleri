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
import WarningIcon from '@mui/icons-material/Warning';
import cities from '../json/cities.json';

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
    const date = new Date(data.date).toLocaleDateString("tr-TR")
    setName(data.name)
    setAge(data.age)
    setCity(data.city)
    setDate(date)
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
  const [pageNumber, setPageNumber] = React.useState(1);
  const [filterStack, setFilterStack] = React.useState(props.filter);
  const [murderCount, setMurderCount] = React.useState("");
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
    setFilterStack(props.filter)
  },[props.data,props.filter])
  React.useEffect(()=>{
    setIsLoading(true)
    let query = "page="+pageNumber;
    if(filterStack != []){
      query += calcQuery(filterStack);
    }
    let cancel
    axios({
      method: 'GET',
      url: 'http://localhost:4000/getmurder?'+query,
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
    axios({
      method: 'GET',
      url: 'http://localhost:4000/getmurdercount?'+query,
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
    .then(function (response) {
      setMurderCount(response.data)
    });
    return () => cancel()
    
  },[selectedCity, pageNumber, filterStack])

  const calcQuery = (filter) => {
    let query = "";
    filterStack.forEach(element => {
      if(element.filterType === "city"){
        query += "&city="+selectedCity
      }
      if(element.filterType === "age"){
        query += "&age="+element.value
      }
      if(element.filterType === "date"){
        query += "&date="+element.value.start.format("YYYY-MM-DD")+element.value.end.format("YYYY-MM-DD")
      }
      if(element.filterType === "byWho"){
        query += "&byWho="+element.value
      }
      if(element.filterType === "why"){
        query += "&why="+element.value
      }
    });
    return query
  }

  return (
    <Paper style={{height: '92vh', overflow: 'auto'}}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {!sideData.length && !isLoading && (
          <Typography component={'span'} variant={'body2'}>
            <WarningIcon fontSize='large'></WarningIcon>
            <h4>No Data Found!</h4>
          </Typography>
        ) || !isLoading &&(
          <Typography component={'span'} variant={'body2'}>
            <h4 style={{color: "red"}}>{murderCount}</h4>
          </Typography>
        )}
        {sideData.map((data, index)=>{
          const date = new Date(data.date).toLocaleDateString("tr-TR")
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
                    {" - "+date}
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
                    {" - "+date}
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
          Ya????: {age}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          ??ehir: {city ? cities.find(a => a.plate === city).name : ""}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Tarih: {date}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Neden ??ld??r??ld??: {why}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Kim Taraf??ndan ??ld??r??ld??: {byWho}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Koruma Talebi: {protection}
        </Typography>
        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
          Nas??l ??ld??l??ld??: {how}
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