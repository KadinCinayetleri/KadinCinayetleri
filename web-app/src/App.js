
import './App.css';
import AccountMenu from './components/Navbar';
import TurkeyMap from 'turkey-map-react';
import { Box, Grid, Drawer, Button, Paper, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, FormControlLabel, FormGroup, Checkbox, Chip} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ListLeft from './components/ListLeft';
import { useEffect, useState} from 'react';
import axios from 'axios';
import cities from '../src/json/cities.json';

function App() {
  const [cityCount, setCityCount] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [drawer, setDrawer] = useState(false)
  const [baslangicDate, setBaslangicDate] = useState(null);
  const [bitisDate, setBitisDate] = useState(null);
  const [yasCheck, setYasCheck] = useState({resit: false, resit_degil: false});
  const [filterStack, setFilterStack] = useState([]);
  const [filterIdCounter, setFilterIdCounter] = useState(0);
  useEffect(()=>{
    axios
    .get("http://localhost:4000/getcitycount")
    .then(function (response) {
      setCityCount(response.data)
    });
  },[])

  const handleClick = async ({plateNumber}) => {
    await setSelectedCity(plateNumber)
    processFilter("city")
  };

  const renderCity = (cityComponent, city) => {
    for(var i in cityCount){
      if(cityCount[i]._id === city.plateNumber){
        if(cityCount[i].count <25){
          cityComponent.props['data-count-class'] = "1";
        }else if(25<=cityCount[i].count && cityCount[i].count<50){
          cityComponent.props['data-count-class'] = "2";
        }else if(50<=cityCount[i].count && cityCount[i].count<75){
          cityComponent.props['data-count-class'] = "3";
        }else if(75<=cityCount[i].count && cityCount[i].count<100){
          cityComponent.props['data-count-class'] = "4";
        }else if(100<=cityCount[i].count && cityCount[i].count<150){
          cityComponent.props['data-count-class'] = "5";
        }else if(150<=cityCount[i].count && cityCount[i].count<200){
          cityComponent.props['data-count-class'] = "6";
        }else if(200<=cityCount[i].count){
          cityComponent.props['data-count-class'] = "7";
        }
        cityComponent.props['data-count'] = cityCount[i].count;
      }
    }
    
    cityComponent.props.key = city.id;
    return (cityComponent);
  };
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYasCheck({
      ...yasCheck,
      [event.target.name]: event.target.checked,
    });
  };

  const processFilter = (type) => {
    const uniqueId = () => {return parseInt(Date.now() * Math.random()).toString()};
    if(type === "date"){
      setFilterStack(filterStack.filter(item => item.filterType !== "date"))
      if(baslangicDate !== null || bitisDate !== null){
        setFilterStack(oldStack => [...oldStack, {id:uniqueId() ,filterType: "date", value: {start: baslangicDate, end: bitisDate}}])
      }
      
    }else if(type === "age"){
      setFilterStack(filterStack.filter(item => item.filterType !== "age"))
      if(yasCheck.resit){
        setFilterStack(oldStack => [...oldStack, {id:uniqueId() ,filterType: "age", value: "Reşit"}])
      } 
      if(yasCheck.resit_degil){
        setFilterStack(oldStack => [...oldStack, {id:uniqueId() ,filterType: "age", value: "Reşit Değil"}])
      }
    }else if(type === "city"){
      setFilterStack(filterStack.filter(item => item.filterType !== "city"))
      setFilterStack(oldStack => [...oldStack, {id:uniqueId() ,filterType: "city", value: selectedCity}])
    }
  };
  const deleteFilter = (id) => {
    setFilterStack(filterStack.filter(item => item.id !== id))
  };

  return (
    <div className="App">
      <header className="App-header">
        <AccountMenu></AccountMenu>
      </header>
      <Drawer
        
        anchor={"right"}
        open={drawer}
        onClose={() => {setDrawer(false)}}
      >
            <Paper sx={{height: '100vh', width: 250, overflow: 'auto'}}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Tarih</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container rowSpacing={2}>
                    <Grid item>
                      <DatePicker
                        label="Başlangıç"
                        value={baslangicDate}
                        maxDate={dayjs()}
                        onChange={(newValue) => {
                          setBaslangicDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Bitiş"
                        value={bitisDate}
                        maxDate={dayjs()}
                        onChange={(newValue) => {
                          setBitisDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
                <Button sx={{height: 40, borderRadius: 1, marginTop: 5, marginLeft:1}} onClick={()=>processFilter("date")} variant="contained" color="success"> Uygula</Button>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Yaş</Typography>
              </AccordionSummary>
              <AccordionDetails>
                
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} checked={yasCheck.resit} onChange={handleCheck} name="resit" label="Reşit" />
                  <FormControlLabel control={<Checkbox />} checked={yasCheck.resit_degil} onChange={handleCheck} name="resit_degil" label="Reşit Değil" />
                </FormGroup>
                
                <Button sx={{height: 40, borderRadius: 1, marginTop: 5, marginLeft:1}} onClick={()=>processFilter("age")} variant="contained" color="success"> Uygula</Button>
              </AccordionDetails>
            </Accordion>
            
            

            </Paper>

      </Drawer>
      
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <ListLeft data={selectedCity} filter={filterStack}/>
        </Grid>   
        <Grid item xs={10}  rowSpacing={2}>
        <Grid sx={{display: "flex", alignItems: "center", justifyContent: "flex-start"}} container xs={12}>
          <Grid item xs={1}>
            <Button sx={{
              height: 25, 
              borderRadius: 5,
              margin: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
              }} onClick={()=>{setDrawer(true)}} variant="contained" color="success">
              <FilterAltIcon></FilterAltIcon>
            </Button>
          </Grid>
          {(filterStack.length !== 0) &&
            
              <Grid item xs={11}>
                <Box
                  sx={{
                    width: "auto",
                    maxHeight: 50,
                    backgroundColor: 'warning.light',
                    opacity: [0.9, 0.8, 0.7],
                    margin: 2,
                    padding: 0.5,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid sx={{display: "flex", alignItems: "center"}} item xs={11}>
                      {filterStack.map(function(item, i){
                        if(item.filterType === "city"){
                          return (<Chip sx={{height: 25, backgroundColor: "white", marginRight: 0.5}} label={cities.find(city => city.plate === selectedCity).name} onDelete={() => {deleteFilter(item.id); setSelectedCity("")}} />);
                        }else if(item.filterType === "date"){
                          return (<Chip sx={{height: 25, backgroundColor: "white", marginRight: 0.5}} label={item.value.start.format("DD/MM/YYYY")+" - "+item.value.end.format("DD/MM/YYYY")} onDelete={() => deleteFilter(item.id)} />);
                        }else if(item.filterType === "age"){
                          return (<Chip sx={{height: 25, backgroundColor: "white", marginRight: 0.5}} label={item.value} onDelete={() => deleteFilter(item.id)} />);
                        }
                        
                      })}
                    </Grid>
                    
                  </Grid>
                  
                </Box>
              </Grid>
          }
            </Grid>
          
          <Grid item xs={12}>
            <TurkeyMap showTooltip hoverable onClick={handleClick} cityWrapper={renderCity} viewBox={{top: 0, left: 0, width: 1050, height: 585}}></TurkeyMap>
          </Grid>
        </Grid>      
      </Grid>     
    </div>
  );
}



export default App;
