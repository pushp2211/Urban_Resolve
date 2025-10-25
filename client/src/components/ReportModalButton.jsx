import React from 'react'
import { Tooltip, IconButton } from '@mui/material'
import { useState } from 'react'
import ReportModal from './ReportModal';
import SummarizeIcon from '@mui/icons-material/Summarize';
function ReportModalButton() {
    const [open, setOpen] = useState(false);
    const handleReportModalClose = (e)=>{
        e.stopPropagation();
        setOpen(false);
    }
    const handleReportModalOpen = ()=>{
        setOpen(true);
    }
  return (
    <Tooltip title="Report">
        <IconButton
            onClick={handleReportModalOpen}
        >
            <SummarizeIcon color='error'
                
            />
        </IconButton>
        <ReportModal open={open} handleReportModalClose={handleReportModalClose}/>
    </Tooltip>
  )
}

export default ReportModalButton