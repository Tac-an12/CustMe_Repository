import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Autocomplete, TextField, Button, Chip } from "@mui/material";
import apiService from "../services/apiService";

type Skill = {
  skill_id: number;
  skill_name: string;
};

const DesignerInformationPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bio, setBio] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]); // Changed to an array to hold multiple files
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const roleId = state?.roleId;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await apiService.get<{ data: Skill[] }>("/user-skills");
        setSkillsList(response.data.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are completed
    if (!roleId || skills.length === 0 || !bio || files.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    console.log("Submitting form data:");
    console.log("Role ID:", roleId);
    console.log("Selected Skills:", skills);
    console.log("Bio:", bio);
    console.log("Selected Portfolio Files:", files.map(file => file.name).join(", "));

    navigate("/register", {
      state: {
        roleId,
        skills: skills.map((skill) => skill.skill_id),
        bio,
        portfolioFiles: files, // Pass multiple files here
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm shadow-lg border border-gray-200">
        <h2 className="text-center text-lg font-semibold text-black mb-3">Professional Information</h2>

        <Autocomplete
          multiple
          options={skillsList}
          getOptionLabel={(option) => option.skill_name}
          value={skills}
          onChange={(event, newValue) => setSkills(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.skill_name}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Skills"
              placeholder="Select Skills"
              fullWidth
            />
          )}
          className="mb-3"
        />

        <div className="mb-3">
          <label htmlFor="portfolio-upload" className="block text-sm font-medium text-gray-700 mb-2">Portfolio:</label>
          <div
            className="border-dashed border-2 border-gray-400 rounded-lg p-3 text-center bg-white"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="text-gray-500 text-sm mb-2">Drag & Drop here</p>
            <p className="text-gray-500 text-sm mb-3">or</p>
            <label
              htmlFor="portfolio-upload"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Browse files
            </label>
            <input
              id="portfolio-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf, .jpg, .jpeg, .png" // Allow only specific file types
              multiple // Allow multiple files
            />
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-700 text-sm">Selected Files:</p>
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index} className="text-gray-700 text-sm">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <TextField
          label="Tell Us About Yourself (Bio)"
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mb-3"
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Proceed to Register
        </Button>
      </div>
    </div>
  );
};

export default DesignerInformationPage;
