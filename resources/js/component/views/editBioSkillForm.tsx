import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip, Button, CircularProgress } from "@mui/material";
import apiService from "../services/apiService";
import { useClientProfile } from "../context/ClientProfileContext";

type Skill = {
  skill_id: number;
  skill_name: string;
};

type PrintingSkill = {
  printing_skill_id: number;
  printing_skill_name: string;
};

interface EditProfileBioSkillProps {
  onSave: (updatedBio: string, updatedSkills: Skill[], updatedPrintingSkills: PrintingSkill[]) => void; // Trigger real-time update
  onClose?: () => void; // Optional onClose function to close the modal
}

const EditProfileBioSkill: React.FC<EditProfileBioSkillProps> = ({ onSave, onClose }) => {
  const { profile, updateBioAndSkills } = useClientProfile();
  const [bio, setBio] = useState<string>(profile?.about_me?.content || "");
  const [skills, setSkills] = useState<Skill[]>(profile?.user_skills || []);
  const [printingSkills, setPrintingSkills] = useState<PrintingSkill[]>(profile?.printing_skills || []);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [printingSkillsList, setPrintingSkillsList] = useState<PrintingSkill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (profile?.role_name === 'Graphic Designer') {
          const response = await apiService.get<{ data: Skill[] }>("/user-skills");
          setSkillsList(response.data.data);
        } else if (profile?.role_name === 'Printing Shop') {
          const response = await apiService.get<{ data: PrintingSkill[] }>("/printing-skills");
          setPrintingSkillsList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, [profile?.role_name]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const skillIds = skills.map(skill => skill.skill_id);
      const printingSkillIds = printingSkills.map(skill => skill.printing_skill_id);

      await updateBioAndSkills(profile.id, bio, skillIds, printingSkillIds);

      onSave(bio, skills, printingSkills); // Pass updated data for real-time update
      if (onClose) onClose(); // Close modal
    } catch (error) {
      console.error("Error saving bio and skills:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm shadow-lg border border-gray-200">
        <h2 className="text-center text-lg font-semibold text-black mb-3">Edit Profile Information</h2>

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

        {profile?.role_name === 'Graphic Designer' && (
          <Autocomplete
            multiple
            options={skillsList.filter(skill => !skills.some(selected => selected.skill_id === skill.skill_id))}
            getOptionLabel={(option) => option.skill_name}
            value={skills}
            onChange={(event, newValue) => setSkills(newValue as Skill[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option.skill_name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select Skills" placeholder="Select Skills" fullWidth />
            )}
            className="mb-3"
          />
        )}

        {profile?.role_name === 'Printing Shop' && (
          <Autocomplete
            multiple
            options={printingSkillsList.filter(skill => !printingSkills.some(selected => selected.printing_skill_id === skill.printing_skill_id))}
            getOptionLabel={(option) => option.printing_skill_name}
            value={printingSkills}
            onChange={(event, newValue) => setPrintingSkills(newValue as PrintingSkill[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option.printing_skill_name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select Printing Skills" placeholder="Select Printing Skills" fullWidth />
            )}
            className="mb-3"
          />
        )}

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileBioSkill;
