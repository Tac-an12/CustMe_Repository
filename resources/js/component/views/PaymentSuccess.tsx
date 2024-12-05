import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PaymentSuccess = () => {
    return (
        <Box className="flex flex-col items-center justify-center h-screen bg-green-50">
            <Typography variant="h4" className="text-green-600 font-bold mb-4">
                Payment Successful!
            </Typography>
            <Typography variant="body1" className="text-gray-800 mb-4">
                Thank you for your payment. Your transaction has been successfully completed.
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

export default PaymentSuccess;
