import * as React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';


import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../../enum/roles';
export default function InfoPieChart({ data}) {
  const {user} = useAuth();
  // console.log(data)
  return (
    <Box
      sx={{
        width:"17rem",
        height:"17rem"
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            dataKey="value"
            label = {data.label}
            paddingAngle={0}
            nameKey="label"
            cornerRadius={10}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.label}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
