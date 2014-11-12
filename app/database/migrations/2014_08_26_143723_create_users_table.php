<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		// create codes table
		Schema::create('users', function($table) {
		    $table->increments('id');
		    $table->decimal('lat', 10, 8);
		    $table->decimal('lng', 11, 8);
		    $table->timestamps();
		    $table->integer('code_id')->unsigned();
		});
		Schema::table('users', function($table) {
	    	$table->foreign('code_id')->references('id')
	    		  ->on('codes')->onDelete('cascade');
	    });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('users');
	}

}
