import React from 'react'
import {Routes, Route, Link, NavLink } from 'react-router-dom'; 
import HomeScreen from './screens/HomeScreen';
import StatisticScreen from './screens/StatisticScreen';

const App = () => {
  return (
    <Routes>
      <Route path='statistic' element={<StatisticScreen />} />
      <Route path='/' element={<HomeScreen />} />
    </Routes>
  )
}

export default App