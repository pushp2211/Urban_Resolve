import { Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';


export default function HorizontalChart({data}) {
  console.log(data);
  return (
    <Box
        sx={{
            minHeight: 20,
            height:"20rem",
            width:{
                xs:"90%",
                sm:"25rem",
                lg:"30rem"
            },
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
        }}
    >
        <ResponsiveContainer
        height="100%"
        width="100%"
      >
        <BarChart
        
          data={data}
          layout="vertical"
            margin={{ top: 10, right: 10, bottom: 10, left: 30 }}
        >
          {/* <CartesianGrid  /> */}
          <XAxis type="number" />
          <YAxis dataKey="role" type="category" />
          {/* <Tooltip /> */}
          <Bar dataKey="count" fill="#3f51b5" barSize={30} radius={5}/>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
