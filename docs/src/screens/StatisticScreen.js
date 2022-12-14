import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import YearChart from '../components/YearChart';
import ByWhoChart from '../components/ByWhoChart';
import WhyKilledChart from '../components/WhyKilledChart';

function StatisticScreen() {
    const [tabValue, setTabValue] = useState(0);
    const handleTabValueChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <div className='App'>
            <header className="App-header">
                <Navbar></Navbar>
            </header>
            <Grid
            container
            direction="row"
            rowSpacing={4}
            justifyContent="center"
            alignItems="center"
            >
                <Grid item xs={12}>
                    <Tabs value={tabValue} onChange={handleTabValueChange} centered>
                        <Tab label="Yıl" />
                        <Tab label="Fail" />
                        <Tab label="Bahane" />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                {tabValue === 0 && (
                    <YearChart />
                )}
                {tabValue === 1 && (
                    <ByWhoChart/>
                )}
                {tabValue === 2 && (
                    <WhyKilledChart />
                )}
                </Grid>
            </Grid>
        </div>
    )
}

export default StatisticScreen