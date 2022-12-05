import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';

export default function Navbar() {
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Link to="/" ><Typography sx={{ minWidth: 100 }}>Harita</Typography></Link>
        <Link to="/statistic"><Typography sx={{ minWidth: 100 }}>İstatistikler</Typography></Link>
      </Box>
    </React.Fragment>
  );
}
