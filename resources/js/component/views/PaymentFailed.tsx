import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PaymentFailed = ({ message }) => {
    return (
        <Box className="flex flex-col items-center justify-center h-screen bg-red-50">
            <Typography variant="h4" className="text-red-600 font-bold mb-4">
                Payment Failed!
            </Typography>
            <Typography variant="body1" className="text-gray-800 mb-4">
                {message}
            </Typography>
            <Typography variant="body1" className="text-gray-800 mb-4">
                Please try again or contact support if the issue persists.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                href="/" // Adjust the href to your home route
            >
                Return to Home
            </Button>
        </Box>
    );
};

export default PaymentFailed;
