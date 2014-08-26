<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCodesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		// create codes table
		Schema::create('codes', function($table) {
		    $table->increments('id');
		    $table->string('value', 10);
		    $table->boolean('in_use')->default(false);
		    $table->timestamps();
		    $table->unique('value');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('codes');
	}

}
