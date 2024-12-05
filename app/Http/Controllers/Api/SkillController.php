<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\PrintingSkill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    protected $skillModel;
    protected $printingSkillModel;

    // Use dependency injection to set up models
    public function __construct(Skill $skill, PrintingSkill $printingSkill)
    {
        $this->skillModel = $skill;
        $this->printingSkillModel = $printingSkill;
    }

    // Fetch all User Skills
    public function getAllUserSkills()
    {
        return response()->json([
            'data' => $this->skillModel->getAllUserSkills() // Uses Skill model to get user skills
        ], 200);
    }

    // Fetch all Printing Skills
    public function getAllPrintingSkills()
    {
        return response()->json([
            'data' => $this->printingSkillModel->getAllPrintingSkills() // Uses PrintingSkill model to get printing skills
        ], 200);
    }
}
