<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tags')->insert([
            ['name' => 'Graphic Design'],
            ['name' => 'Printing'],
            ['name' => 'Logo Design'],
            ['name' => 'Illustration'],
            ['name' => 'Print Services'],
            ['name' => 'T-shirt Printing'],
            ['name' => 'Custom Apparel'],
            ['name' => 'Packaging Design'],
            ['name' => 'Business Cards'],
            ['name' => 'Poster Printing'],
        ]);
    }
}
