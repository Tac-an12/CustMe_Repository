<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('skills')->insert([
            ['skill_name' => 'Logo Design'],
            ['skill_name' => 'Illustration'],
            ['skill_name' => 'Typography'],
            ['skill_name' => 'Branding'],
            ['skill_name' => 'Editing'],
            ['skill_name' => 'Animation'],
        ]);
    }
}
