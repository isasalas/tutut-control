import * as React from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid} from '@mui/x-data-grid';

const RutasScreen = () => {

  const baseURL = " http://localhost:3000/api/linea";
  const [Lineas, setLineas] = React.useState(Array);


  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setLineas(response.data);
    });
  }, []);

  if (!Lineas) return null;



  const columns = [
    { field: 'id', headerName: 'First name', width: 130 },
    { field: 'name', headerName: 'Last name', width: 130 },
    {field: 'description', headerName: 'Full name',width: 160},
  ];
  
  const rows =Lineas ;

  return (
    <div>

<Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
    </div>
  )
}

export default RutasScreen