<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent {

	/**
     * Fillable fields
     */
    protected $fillable = array('lat', 'lng', 'code_id');

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	 /**
     * Relationship with 'Code' model
     */
	public function code()
	{
		return $this->belongsTo('Code');
	}

}