<?php

namespace App\Http\Controllers\Api;

use App\Models\Tags; // Import the Tags model
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\Post;

class TagsController extends Controller
{
    /**
     * Display a listing of all tags.
     *
     * @return \Illuminate\Http\Responses
     */
    public function getAllTags()
    {
        
        $tags = Tags::all();
        return response()->json($tags);
    }


    public function searchByTag(Request $request)
{
    $tagName = $request->query('tag'); // Get the tag name from the query parameter

    // Log the tag name for debugging
    Log::debug('Searching for posts with tag: ' . $tagName);

    // Check if the tag name is provided
    if (!$tagName) {
        return response()->json(['message' => 'Tag parameter is required'], 400);
    }

    // Trim and normalize the tag name
    $tagName = trim($tagName);
    $words = preg_split('/\s+/', $tagName); // Split by whitespace

    // Create the query to search for posts that match any of the words
    $query = Post::whereHas('tags', function ($query) use ($words) {
        foreach ($words as $word) {
            $query->orWhereRaw('LOWER(name) LIKE ?', ['%' . strtolower($word) . '%']);
        }
    })->with('tags');

    // For debugging, log the raw SQL query
    Log::debug('SQL Query: ' . $query->toSql());

    // Execute the query
    $posts = $query->get();

    // Check if any posts were found
    if ($posts->isEmpty()) {
        Log::debug('No posts found for tag: ' . $tagName);
        return response()->json([], 200); // Return empty array with 200 status
    }

    // Return the posts as a response
    return response()->json($posts);
}
}