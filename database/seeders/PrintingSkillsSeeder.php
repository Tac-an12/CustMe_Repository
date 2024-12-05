<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrintingSkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $printingSkills = [
            "Business Cards Printing",
            "Brochure/Flyer Printing",
            "Large Format Printing (Banners, Posters)",
            "T-shirt/Clothing Printing",
            "Packaging/Box Printing",
            "Digital Printing",
            "Offset Printing",
            "3D Printing",
        ];

        foreach ($printingSkills as $skill) {
            DB::table('printing_skills')->insert([
                'printing_skill_name' => $skill,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
