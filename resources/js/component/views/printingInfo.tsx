import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Autocomplete, TextField, Button, Chip } from "@mui/material";
import apiService from "../services/apiService";

type PrintingSkill = {
  printing_skill_name: string;
  printing_skill_id: number;
};

const PrintingInformationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const roleId = state?.roleId;

  const [selectedPrintingServices, setSelectedPrintingServices] = useState<PrintingSkill[]>([]);
  const [printingSkillsList, setPrintingSkillsList] = useState<PrintingSkill[]>([]);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null); // Changed to single file
  const [certificationFile, setCertificationFile] = useState<File | null>(null); // Changed to single file
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchPrintingSkills = async () => {
      try {
        const response = await apiService.get<{ data: PrintingSkill[] }>("/printing-skills");
        setPrintingSkillsList(response.data.data);
      } catch (error) {
        console.error("Error fetching printing skills:", error);
      }
    };
    fetchPrintingSkills();
  }, []);

  const handlePortfolioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Get the FileList

    if (files && files.length > 0) {
      setPortfolioFile(files[0]); // Set the first file only
    }
  };

  const handleCertificationsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Get the FileList

    if (files && files.length > 0) {
      setCertificationFile(files[0]); // Set the first file only
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!roleId || selectedPrintingServices.length === 0 || !bio || !portfolioFile) {
      alert("Please complete all required fields.");
      return;
    }

    const selectedPrintingServiceIds = selectedPrintingServices.map(
      (service) => service.printing_skill_id
    );

    console.log("Role ID:", roleId);
    console.log("Bio:", bio);
    console.log("Selected Printing Service IDs:", selectedPrintingServiceIds);
    console.log("Selected Portfolio File:", portfolioFile?.name);
    console.log("Selected Certification File:", certificationFile?.name);

    // Navigate to /register with collected data
    navigate("/register", {
      state: {
        roleId,
        bio,
        printingServices: selectedPrintingServiceIds,
        portfolioFile, // Pass the single portfolio file
        certificationFile, // Pass the single certification file
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <form onSubmit={handleSubmit}>
          {/* Printing Services Multi-select with Chips */}
          <div className="mb-4 mt-5">
            <Autocomplete
              multiple
              options={printingSkillsList}
              getOptionLabel={(option) => option.printing_skill_name}
              value={selectedPrintingServices}
              onChange={(event, newValue) => setSelectedPrintingServices(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.printing_skill_name} {...getTagProps({ index })} variant="outlined" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Printing Services" placeholder="Select Services" fullWidth />
              )}
            />
          </div>

          {/* Portfolio File Upload */}
          <div className="mb-3">
            <label htmlFor="portfolio-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio:
            </label>
            <div className="border-dashed border-2 border-gray-400 rounded-lg p-3 text-center bg-white">
              <p className="text-gray-500 text-sm mb-2">Drag & Drop here</p>
              <p className="text-gray-500 text-sm mb-3">or</p>
              <label htmlFor="portfolio-upload" className="text-blue-500 hover:underline cursor-pointer">
                Browse file
              </label>
              <input id="portfolio-upload" type="file" onChange={handlePortfolioFileChange} className="hidden" />
              {portfolioFile && (
                <div className="mt-2">
                  <p className="text-gray-700 text-sm">Selected File:</p>
                  <p className="text-gray-700 text-sm">{portfolioFile.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Certifications File Upload */}
          <div className="mb-3">
            <label htmlFor="certifications-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Certifications/Accreditations (Optional):
            </label>
            <div className="border-dashed border-2 border-gray-400 rounded-lg p-3 text-center bg-white">
              <p className="text-gray-500 text-sm mb-2">Drag & Drop here</p>
              <p className="text-gray-500 text-sm mb-3">or</p>
              <label htmlFor="certifications-upload" className="text-blue-500 hover:underline cursor-pointer">
                Browse file
              </label>
              <input id="certifications-upload" type="file" onChange={handleCertificationsFileChange} className="hidden" />
              {certificationFile && (
                <div className="mt-2">
                  <p className="text-gray-700 text-sm">Selected File:</p>
                  <p className="text-gray-700 text-sm">{certificationFile.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* About the Business */}
          <div className="mb-4">
            <TextField
              label="About the Business"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Proceed to Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PrintingInformationPage;
