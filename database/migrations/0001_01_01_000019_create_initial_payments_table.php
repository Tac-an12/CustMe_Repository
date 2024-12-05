    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    class CreateInitialPaymentsTable extends Migration
    {
        public function up(): void
        {
            Schema::create('initial_payments', function (Blueprint $table) {
                $table->id('initial_payment_id');
                $table->unsignedBigInteger('request_id');
                $table->foreign('request_id')->references('request_id')->on('requests')->onDelete('cascade');

                $table->unsignedBigInteger('user_id'); // Payer (could be User, Designer, etc.)
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

                $table->decimal('amount', 10, 2); // Payment amount
                $table->enum('payment_type', ['initial', 'final'])->default('initial'); // Type of payment
                $table->enum('status', ['initiated', 'pending', 'completed',  'refunded', 'failed'])->default('pending');
                $table->string('transaction_id')->nullable(); // Transaction ID from payment provider
                $table->string('payment_method')->nullable(); // Payment method used


                $table->timestamps();
            });
        }

        public function down(): void
        {
            Schema::dropIfExists('initial_payments');
        }
    }
