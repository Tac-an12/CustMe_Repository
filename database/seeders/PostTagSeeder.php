<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the tags by name
        $graphicDesignTag = DB::table('tags')->where('name', 'Graphic Design')->first();
        $printingTag = DB::table('tags')->where('name', 'Printing')->first();
        $logoDesignTag = DB::table('tags')->where('name', 'Logo Design')->first();
        $illustrationTag = DB::table('tags')->where('name', 'Illustration')->first();
        $printServicesTag = DB::table('tags')->where('name', 'Print Services')->first();
        $tShirtPrintingTag = DB::table('tags')->where('name', 'T-shirt Printing')->first();
        $customApparelTag = DB::table('tags')->where('name', 'Custom Apparel')->first();
        $packagingDesignTag = DB::table('tags')->where('name', 'Packaging Design')->first();
        $businessCardsTag = DB::table('tags')->where('name', 'Business Cards')->first();
        $posterPrintingTag = DB::table('tags')->where('name', 'Poster Printing')->first();

        // Add posts with multiple tags (2 to 9 tags for each post)
        DB::table('post_tag')->insert([

            ['post_id' => 15, 'tag_id' => $graphicDesignTag->id],     // Post 15 with 'Graphic Design' tag
            ['post_id' => 15, 'tag_id' => $printingTag->id],          // Post 15 with 'Printing' tag

            ['post_id' => 18, 'tag_id' => $tShirtPrintingTag->id],    // Post 18 with 'T-shirt Printing' tag
            ['post_id' => 18, 'tag_id' => $customApparelTag->id],     // Post 18 with 'Custom Apparel' tag

            ['post_id' => 19, 'tag_id' => $posterPrintingTag->id],    // Post 19 with 'Poster Printing' tag
            ['post_id' => 19, 'tag_id' => $printingTag->id],          // Post 19 with 'Printing' tag

            ['post_id' => 20, 'tag_id' => $graphicDesignTag->id],    // Post 20 with 'Graphic Design' tag
            ['post_id' => 20, 'tag_id' => $printingTag->id],          // Post 20 with 'Printing' tag
            ['post_id' => 20, 'tag_id' => $tShirtPrintingTag->id],    // Post 20 with 'T-shirt Printing' tag
            
            ['post_id' => 21, 'tag_id' => $logoDesignTag->id],        // Post 21 with 'Logo Design' tag
            ['post_id' => 21, 'tag_id' => $graphicDesignTag->id],     // Post 21 with 'Graphic Design' tag
            
            ['post_id' => 22, 'tag_id' => $illustrationTag->id],      // Post 22 with 'Illustration' tag
            ['post_id' => 22, 'tag_id' => $graphicDesignTag->id],     // Post 22 with 'Graphic Design' tag
            
            ['post_id' => 23, 'tag_id' => $printServicesTag->id],     // Post 23 with 'Print Services' tag
            ['post_id' => 23, 'tag_id' => $printingTag->id],          // Post 23 with 'Printing' tag
            
            ['post_id' => 24, 'tag_id' => $tShirtPrintingTag->id],    // Post 24 with 'T-shirt Printing' tag
            ['post_id' => 24, 'tag_id' => $customApparelTag->id],     // Post 24 with 'Custom Apparel' tag
            
            ['post_id' => 25, 'tag_id' => $packagingDesignTag->id],   // Post 25 with 'Packaging Design' tag
            ['post_id' => 25, 'tag_id' => $printingTag->id],          // Post 25 with 'Printing' tag
            
            ['post_id' => 26, 'tag_id' => $businessCardsTag->id],     // Post 26 with 'Business Cards' tag
            ['post_id' => 26, 'tag_id' => $printServicesTag->id],     // Post 26 with 'Print Services' tag
            
            ['post_id' => 27, 'tag_id' => $posterPrintingTag->id],    // Post 27 with 'Poster Printing' tag
            ['post_id' => 27, 'tag_id' => $printingTag->id],          // Post 27 with 'Printing' tag
            
            ['post_id' => 28, 'tag_id' => $packagingDesignTag->id],   // Post 28 with 'Packaging Design' tag
            ['post_id' => 28, 'tag_id' => $customApparelTag->id],     // Post 28 with 'Custom Apparel' tag
            ['post_id' => 28, 'tag_id' => $businessCardsTag->id],     // Post 28 with 'Business Cards' tag
        ]);
    }
}
