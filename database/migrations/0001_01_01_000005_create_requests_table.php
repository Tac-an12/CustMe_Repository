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
        Schema::create('requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->string('request_type');
            $table->enum('status', ['pending', 'accepted', 'declined', 'refunded', '20% paid', 'file_uploaded', 'completed'])->default('pending');
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('target_user_id')->nullable();
            $table->foreign('target_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('post_id')->nullable();
            $table->foreign('post_id')->references('post_id')->on('posts')->onDelete('cascade');

            $table->text('request_content')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
