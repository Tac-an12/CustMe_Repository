import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CommunityJoin = () => {
  const navigate = useNavigate();

  const handleNavigation = (roleId) => {
    const targetPage = roleId === 3 ? '/desingner-Info' : '/printing-Info';
    navigate(targetPage, { state: { roleId } });
  };
  // <Route path="/desingner-Info" element={<DesignerInformationPage/>} />
  // <Route path="/printing-Info" element={<PrintingInformationPage/>} />
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "2rem",
          width: "80%",
          maxWidth: "800px",
          textAlign: "center",
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'extrabold' }}>
          Join our community
        </Typography>

        <div className="flex justify-around mt-8">
          <Card
            onClick={() => handleNavigation(3)}
            className="flex flex-col items-center p-4 hover:bg-yellow-500 cursor-pointer mr-4"
            sx={{
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <img
              src="https://www.pngall.com/wp-content/uploads/13/Paint-Palette-Design-PNG-Photo.png"
              alt="Designer Icon"
              style={{ width: 100, height: 100, marginBottom: '1rem' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" className="text-center">
                Showcase your skills and attract clients for your design projects.
              </Typography>
              <Typography
                variant="body2"
                className="text-center"
                sx={{ fontWeight: 'bold', mt: 4, fontSize: '1.2rem' }}
              >
                I AM DESIGNER
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => handleNavigation(4)}
            className="flex flex-col items-center p-4 hover:bg-yellow-500 cursor-pointer ml-4"
            sx={{
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px', 
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3569/3569998.png"
              alt="Printing Provider Icon"
              style={{ width: 100, height: 100, marginBottom: '1rem' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" className="text-center">
                Offer your printing services to a wide audience and grow your business.
              </Typography>
              <Typography
                variant="body2"
                className="text-center"
                sx={{ fontWeight: 'bold', mt: 4, fontSize: '1.2rem' }}
              >
                I AM PRINTING PROVIDER
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Box>

      <div className="absolute top-8 left-8">
        <Link to="/" className="bg-yellow-500 text-white px-4 py-2 rounded">
          Back
        </Link>
      </div>
    </div>
  );
};

export default CommunityJoin;
