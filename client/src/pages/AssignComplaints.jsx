import React from 'react'
import { COMPLAINT_STATUS } from '../../../backend/src/enum/ComplaintStatus';
import { COMPLAINT_URGENCY } from '../../../backend/src/enum/ComplaintUrgency';
import axios from "axios";
import { useState, useEffect } from 'react';

function AssignComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  const FetchAssignedComplaint = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: 1,
        limit: 10,
      };

      if (statusFilter) {
        queryParams.status = statusFilter;
      }

      if (urgencyFilter) {
        queryParams.urgency = urgencyFilter;
      }

      // Convert object to query string
      const queryString = new URLSearchParams(queryParams).toString();

      const res = await axios.get(
        `http://localhost:5000/api/v1/complaints/my-assigned?${queryString}`, 
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = res.data.data; // backend sends apiResponse(data)
      setComplaints(data.complaints);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>AssignComplaints</div>
  )
}

export default AssignComplaints