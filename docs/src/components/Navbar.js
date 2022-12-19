import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import { Button, Stack } from '@mui/material';

export default function Navbar() {
  const style = {
    color: "#fbe9e7",
    borderColor: "#fbe9e7",
    '&:hover': {
      color: '#ff8a65',
      borderColor: '#ff7043',
    },
  }
  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
        <Button sx={style} href="/" variant="outlined">Harita</Button>
        <Button sx={style} href="/statistic" variant="outlined">İstatistikler</Button>
      </Stack>
    </React.Fragment>
  );
}
