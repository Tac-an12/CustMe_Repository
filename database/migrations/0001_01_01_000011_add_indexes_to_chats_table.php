<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            // Add indexes to optimize querying by sender_id, receiver_id, and created_at
            $table->index('sender_id');
            $table->index('receiver_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            // Drop the indexes if the migration is rolled back
            $table->dropIndex(['sender_id']);
            $table->dropIndex(['receiver_id']);
            $table->dropIndex(['created_at']);
        });
    }
};
