import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

function SearchUser() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Build query params
            const params = new URLSearchParams();
            params.append("email", email);

            const res = await axios.get(`/api/v1/admin/search?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setResult(res.data.data); // assuming apiResponse wraps data in data field
        } catch (err) {
            let message = "Something went wrong. Please try again.";

            // Server error from apiError
            if (err.response && err.response.data) {
                const data = err.response.data;
                message = data.message || message;

                // Optional: show validation errors from apiError.errors
                if (data.errors && data.errors.length > 0) {
                    message += " " + data.errors.join(", ");
                }
            }
            // Network error
            else if (err.request) {
                message = "Network error. Please check your internet connection.";
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>SearchUser</div>
    )
}

export default SearchUser