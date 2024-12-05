import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import apiServices from "../services/apiService";

interface RequestModalProps {
  open: boolean;
  handleClose: () => void;
  setRequestContent: Dispatch<SetStateAction<string>>;
  selectedPost: number | null;
  targetUserId: number;
  role: string;  // Role is passed as a prop now
}

const RequestModal: React.FC<RequestModalProps> = ({
  open,
  handleClose,
  setRequestContent,
  selectedPost,
  targetUserId,
  role,  // Receiving role as a prop
}) => {
  const [requestContent, setLocalRequestContent] = useState('');

  useEffect(() => {
    if (!open) {
      setLocalRequestContent('');
    }
    console.log('RequestModal opened. Target User ID:', targetUserId);
  }, [open, targetUserId]);

  const handleSubmitWrapper = async () => {
    try {
      if (!selectedPost) {
        console.error("No post selected for payment.");
        return;
      }

      // Prepare data for request
      setRequestContent(requestContent);

      // Determine the API endpoint based on the user's role
      const apiEndpoint = role === 'User' 
        ? '/pay-for-product'  // For User, use 'pay-for-product'
        : '/create-request';  // For Graphic Designers or Printing Shops, use 'create-request'

      // Send the request to create InitialPayment and Request models
      const response = await apiServices.post(apiEndpoint, {
        post_id: selectedPost,
        target_user_id: targetUserId,
        request_content: requestContent,
      });

      if (role === 'User') {
        // For User, get the checkout URL and open it in a new tab
        const checkoutUrl = response.data.checkout_url;
        if (checkoutUrl) {
          window.open(checkoutUrl, '_blank');
        } else {
          console.error("Checkout session failed: No checkout URL received");
        }
      }

      handleClose();
    } catch (error) {
      console.error("Payment or request submission error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Submit a Request</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Request Content"
          type="text"
          fullWidth
          variant="outlined"
          value={requestContent}
          onChange={(e) => {
            setLocalRequestContent(e.target.value);
            setRequestContent(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmitWrapper} color="primary">
          {role === 'User' ? 'Submit and Pay 20%' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestModal;
